import { GenesisBus } from './bus.js';
import { M68k } from './cpu/m68k.js';
import { Z80 } from './cpu/z80.js';
import { Controllers } from './io/controllers.js';
import { AudioMixer } from './sound/mixer.js';
import { Sn76489 } from './sound/sn76489.js';
import { Ym2612 } from './sound/ym2612.js';
import { captureState, restoreState } from './state/snapshot.js';
import { Vdp } from './vdp/vdp.js';
/** The master clock: the 68000 runs at a seventh of it, the Z80 at a fifteenth. */
export const MASTER_HZ = { ntsc: 53_693_175, pal: 53_203_424 };
export const MASTER_PER_LINE = 3420;
const M68K_DIVIDER = 7;
const Z80_DIVIDER = 15;
/** Where in the line the horizontal blanking (and its interrupt) starts. */
const HBLANK_START = 2640;
/** The two CPUs take turns in slices this long (an eighth of a line), so they see each other's writes promptly. */
const SLICE = MASTER_PER_LINE / 8;
/**
 * The whole console: the 68000 with 64K of RAM; the Z80 with 8K of its own,
 * which mostly drives the sound; the VDP with the PSG in it; the YM2612; two
 * controller ports; and a cartridge. Runs a scanline at a time. The VDP
 * interrupts the 68000 at each frame (and, if asked, every few lines), and
 * the Z80 once a frame.
 */
export class Genesis {
    vdp = new Vdp();
    psg = new Sn76489();
    ym = new Ym2612();
    controllers = new Controllers();
    bus = new GenesisBus(this.vdp, this.psg, this.ym, this.controllers);
    cpu = new M68k(this.bus);
    z80 = new Z80(this.bus.z80);
    audio = new AudioMixer(this.psg, this.ym);
    region = 'export';
    tv = 'ntsc';
    /** Master clocks into the current line each CPU has run to. */
    cpuClock = 0;
    z80Clock = 0;
    /** Which CPU is running, so a write to a sound chip lands at that CPU's time. */
    z80Turn = false;
    /** Called with each finished picture: colours (see Vdp), the width of each line, and its height. */
    onFrame = () => { };
    constructor() {
        this.vdp.onInterrupt = (level) => (this.cpu.irqLevel = level);
        this.vdp.dmaRead = (address) => this.bus.read16(address & 0xfffffe);
        this.vdp.lineCycle = () => this.cpuClock / M68K_DIVIDER;
        this.bus.now = () => this.cpu.cycles;
        this.bus.onZ80Reset = () => this.z80.reset();
        this.bus.beforeSound = () => this.audio.runTo(this.z80Turn ? this.z80Clock : this.cpuClock);
        this.powerOn();
    }
    get clockHz() {
        return MASTER_HZ[this.tv];
    }
    get cartridge() {
        return this.bus.cartridge;
    }
    /** The player's TMSS boot ROM (null for none): it shows Sega's licence screen before the game. Takes effect at power on. */
    setBootRom(rom) {
        this.bus.bootRom = rom;
    }
    get hasBootRom() {
        return this.bus.bootRom !== null;
    }
    get canRun() {
        return this.cartridge !== null;
    }
    insertCartridge(cartridge) {
        this.bus.cartridge = cartridge;
        this.powerOn();
    }
    setRegion(region) {
        this.region = region;
        this.bus.region = region;
    }
    setTv(tv) {
        this.tv = tv;
        this.vdp.pal = tv === 'pal';
        this.bus.pal = tv === 'pal';
    }
    setPadType(type) {
        this.controllers.padType = type;
    }
    /** Power on: everything back to its initial state, RAM cleared. */
    powerOn() {
        this.bus.ram.fill(0);
        this.bus.z80Ram.fill(0);
        this.cartridge?.reset();
        this.vdp.reset();
        this.restart();
    }
    /** The console's Reset button: the CPUs, sound chips and ports restart; RAM and video memory keep their contents. */
    pressReset() {
        if (this.canRun)
            this.restart();
    }
    restart() {
        this.psg.reset();
        this.ym.reset();
        this.controllers.reset();
        this.bus.reset();
        this.z80.reset();
        this.z80.irq = false;
        this.cpu.irqLevel = 0;
        this.cpuClock = this.z80Clock = 0;
        this.audio.lineClock = 0;
        this.cpu.reset();
    }
    /** Runs one scanline: the VDP starts it (drawing it if it is in the picture), then the CPUs run their share. */
    runLine() {
        const finished = this.vdp.startLine();
        // The Z80's interrupt is held for one line at the start of the vertical blanking.
        this.z80.irq = this.vdp.line === this.vdp.activeLines;
        this.runCpus(HBLANK_START);
        this.vdp.startHblank();
        this.runCpus(MASTER_PER_LINE);
        this.cpuClock -= MASTER_PER_LINE;
        this.z80Clock -= MASTER_PER_LINE;
        this.audio.endLine(MASTER_PER_LINE);
        if (finished)
            this.onFrame(this.vdp.framebuffer, this.vdp.lineWidths, this.vdp.frameLines);
    }
    /** Runs both CPUs up to `until` master clocks into the line, a slice at a time each. */
    runCpus(until) {
        const { cpu, bus } = this;
        for (let end = Math.min(this.cpuClock, this.z80Clock) + SLICE;; end += SLICE) {
            const sliceEnd = Math.min(end, until);
            while (this.cpuClock < sliceEnd) {
                const cycles = cpu.step() + bus.stall;
                bus.stall = 0;
                this.cpuClock += cycles * M68K_DIVIDER;
            }
            this.z80Turn = true;
            if (bus.z80Running) {
                while (this.z80Clock < sliceEnd)
                    this.z80Clock += this.z80.step() * Z80_DIVIDER;
            }
            else {
                this.z80Clock = Math.max(this.z80Clock, sliceEnd);
            }
            this.z80Turn = false;
            if (sliceEnd >= until)
                return;
        }
    }
    /** Runs lines until the next picture is complete. */
    runFrame() {
        const target = this.vdp.frames + 1;
        while (this.vdp.frames < target)
            this.runLine();
        while (this.vdp.line !== this.vdp.activeLines)
            this.runLine();
    }
    /** Everything in the console except the cartridge ROM (save RAM and bank registers included). */
    saveState() {
        return captureState(this);
    }
    /** Restores a saved state; the same cartridge must already be in. */
    loadState(state) {
        restoreState(this, state);
        this.setRegion(this.region);
        this.setTv(this.tv);
    }
}

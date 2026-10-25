import { Genesis, MASTER_PER_LINE } from './genesis.js';
/** Maximum catch-up window: limits long bursts on slower mobile browsers instead of letting a delayed tab monopolize the main thread. */
const MAX_CATCH_UP_MS = 40;
/** Glues the machine to the screen and the speakers, and runs it in step with real time. */
export class Emulator {
    screen;
    machine = new Genesis();
    clockDebt = 0;
    audioRate = 48000;
    idleShown = false;
    constructor(screen) {
        this.screen = screen;
        this.machine.onFrame = (frame, widths, lines) => screen.capture(frame, widths, lines);
        this.updateAudioRate();
    }
    get canRun() {
        return this.machine.canRun;
    }
    setAudioRate(rate) {
        this.audioRate = rate;
        this.updateAudioRate();
    }
    setTv(tv) {
        if (tv === this.machine.tv)
            return;
        this.machine.setTv(tv);
        this.updateAudioRate();
    }
    /** Follows the TV system of a restored save state. */
    restored() {
        this.updateAudioRate();
        this.resetTiming();
    }
    updateAudioRate() {
        this.machine.audio.setRates(this.machine.clockHz, this.audioRate);
    }
    /** Forgets time owed, e.g. after a pause, so the machine doesn't race to catch up. */
    resetTiming() {
        this.clockDebt = 0;
    }
    /** Runs the machine for `elapsedMs` of real time (no more than MAX_CATCH_UP_MS). */
    run(elapsedMs) {
        if (!this.canRun) {
            if (!this.idleShown)
                this.screen.showIdle();
            this.idleShown = true;
            return;
        }
        this.idleShown = false;
        this.clockDebt += (Math.min(elapsedMs, MAX_CATCH_UP_MS) * this.machine.clockHz) / 1000;
        while (this.clockDebt >= MASTER_PER_LINE) {
            this.machine.runLine();
            this.clockDebt -= MASTER_PER_LINE;
        }
    }
    takeAudioSamples() {
        return this.machine.audio.takeSamples();
    }
}

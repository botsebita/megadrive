import { AudioOutput } from "../vendor/genesis/audio/audio-output.js";
import { Cartridge } from "../vendor/genesis/cart/cartridge.js";
import { detectRom } from "../vendor/genesis/cart/detect.js";
import { filesFrom, readMedia } from "../vendor/genesis/cart/load.js";
import { Emulator } from "../vendor/genesis/emulator.js";
import { Button } from "../vendor/genesis/io/controllers.js";
import { GamepadManager, padName, readGamepad } from "../vendor/genesis/io/gamepad-input.js";
import { Screen } from "../vendor/genesis/render/screen.js";
import { decodeState, encodeState } from "../vendor/genesis/state/snapshot.js";
export const BUNDLED_GAMES = [
    {
        id: "snow-bros",
        title: "Snow Bros. - Nick & Tom (ESP)",
        file: "./roms/snow-bros.md",
        credit: "ROM aportada por el propietario del proyecto",
        hint: "Juego inicial precargado.",
    },
    {
        id: "mines",
        title: "Minesweeper MD",
        file: "./roms/minesweeper.bin",
        credit: "Nightwolf-47 · MIT",
        hint: "A descubre, C pone bandera, B hace acorde y Start vuelve al menú.",
    },
    {
        id: "power-rangers",
        title: "Mighty Morphin Power Rangers (ESP)",
        file: "./roms/power-rangers.bin",
        credit: "ROM aportada por el propietario del proyecto",
        hint: "Cartucho precargado.",
    },
    {
        id: "street-fighter-ii-sce",
        title: "Street Fighter II' - Special Champion Edition (ESP)",
        file: "./roms/street-fighter-ii-sce.bin",
        credit: "ROM aportada por el propietario del proyecto",
        hint: "Cartucho precargado.",
    },
    {
        id: "worms",
        title: "Worms (ESP)",
        file: "./roms/worms.bin",
        credit: "ROM aportada por el propietario del proyecto",
        hint: "Cartucho precargado.",
    },
    {
        id: "streets-of-rage-3",
        title: "Streets of Rage 3 (ESP)",
        file: "./roms/streets-of-rage-3.bin",
        credit: "ROM aportada por el propietario del proyecto",
        hint: "Cartucho precargado.",
    },
    {
        id: "toejam-earl-funkotron",
        title: "ToeJam & Earl in Panic on Funkotron",
        file: "./roms/toejam-earl-funkotron.bin",
        credit: "ROM aportada por el propietario del proyecto",
        hint: "Cartucho precargado.",
    },
    {
        id: "streets-of-rage-2",
        title: "Streets of Rage 2 (ESP)",
        file: "./roms/streets-of-rage-2.bin",
        credit: "ROM aportada por el propietario del proyecto",
        hint: "Cartucho precargado.",
    },
    {
        id: "gunstar-heroes",
        title: "Gunstar Heroes (ESP)",
        file: "./roms/gunstar-heroes.bin",
        credit: "ROM aportada por el propietario del proyecto",
        hint: "Cartucho precargado.",
    },
    {
        id: "contra-hard-corps",
        title: "Contra: Hard Corps (ESP)",
        file: "./roms/contra-hard-corps.bin",
        credit: "ROM aportada por el propietario del proyecto",
        hint: "Cartucho precargado.",
    },
    {
        id: "tmnt-tournament-fighters",
        title: "Teenage Mutant Ninja Turtles: Tournament Fighters (ESP)",
        file: "./roms/tmnt-tournament-fighters.bin",
        credit: "ROM aportada por el propietario del proyecto",
        hint: "Cartucho precargado.",
    },
    {
        id: "tmnt-hyperstone-heist",
        title: "Teenage Mutant Ninja Turtles: The Hyperstone Heist (ESP)",
        file: "./roms/tmnt-hyperstone-heist.bin",
        credit: "ROM aportada por el propietario del proyecto",
        hint: "Cartucho precargado.",
    },
    {
        id: "micro-machines-96",
        title: "Micro Machines: Turbo Tournament '96 (ESP)",
        file: "./roms/micro-machines-96.bin",
        credit: "ROM aportada por el propietario del proyecto",
        hint: "Cartucho precargado.",
    },
    {
        id: "zombies-ate-my-neighbors",
        title: "Zombies Ate My Neighbors",
        file: "./roms/zombies-ate-my-neighbors.bin",
        credit: "ROM aportada por el propietario del proyecto",
        hint: "Cartucho precargado.",
    },
    {
        id: "world-of-illusion",
        title: "World of Illusion Starring Mickey Mouse and Donald Duck (ESP)",
        file: "./roms/world-of-illusion.bin",
        credit: "ROM aportada por el propietario del proyecto",
        hint: "Cartucho precargado.",
    },
    {
        id: "golden-axe",
        title: "Golden Axe (ESP)",
        file: "./roms/golden-axe.bin",
        credit: "ROM aportada por el propietario del proyecto",
        hint: "Cartucho precargado.",
    },
    {
        id: "golden-axe-ii",
        title: "Golden Axe II (ESP)",
        file: "./roms/golden-axe-ii.bin",
        credit: "ROM aportada por el propietario del proyecto",
        hint: "Cartucho precargado.",
    },
    {
        id: "golden-axe-iii",
        title: "Golden Axe III (ESP)",
        file: "./roms/golden-axe-iii.bin",
        credit: "ROM aportada por el propietario del proyecto",
        hint: "Cartucho precargado.",
    },
    {
        id: "nba-jam-te",
        title: "NBA Jam: Tournament Edition",
        file: "./roms/nba-jam-te.bin",
        credit: "ROM aportada por el propietario del proyecto",
        hint: "Cartucho precargado.",
    },
    {
        id: "battletoads-blast-processing",
        title: "Battletoads in Blast Processing",
        file: "./roms/battletoads-blast-processing.bin",
        credit: "Homebrew v1.0 por Soulchip TV",
        hint: "Cartucho precargado.",
    },
];
const ACTION_BIT = {
    up: Button.Up,
    down: Button.Down,
    left: Button.Left,
    right: Button.Right,
    a: Button.A,
    b: Button.B,
    c: Button.C,
    x: Button.X,
    y: Button.Y,
    z: Button.Z,
    start: Button.Start,
    mode: Button.Mode,
};
export function buttonsFromActions(actions) {
    let bits = 0;
    for (const action of actions)
        bits |= ACTION_BIT[action];
    return bits;
}
export function buttonsFromCodes(codes, keys) {
    const byCode = new Map();
    for (const action of Object.keys(keys))
        byCode.set(keys[action], ACTION_BIT[action]);
    let bits = 0;
    for (const code of codes)
        bits |= byCode.get(code) ?? 0;
    return bits;
}
function displayTitle(info, fileName) {
    const fromName = fileName.replace(/\.[^.]+$/, "").replace(/_/g, " ").trim();
    return info.title || fromName || "Cartucho";
}
function spanishError(error) {
    const msg = error instanceof Error ? error.message : String(error);
    if (/empty/i.test(msg))
        return new Error("El archivo está vacío.");
    if (/too big/i.test(msg))
        return new Error("El archivo es demasiado grande para un cartucho de Mega Drive.");
    if (/isn't a cartridge/i.test(msg))
        return new Error("Formato no admitido. Usa .bin, .gen, .md, .smd o un ZIP que los contenga.");
    if (/no Genesis/i.test(msg))
        return new Error("Ese ZIP no contiene una ROM de Mega Drive.");
    if (/damaged|zip/i.test(msg))
        return new Error("No se pudo leer el ZIP. Prueba con la ROM suelta.");
    return new Error("No se pudo abrir la ROM.");
}
export async function createSession(canvas) {
    const screen = new Screen(canvas);
    const emulator = new Emulator(screen);
    const gamepads = new GamepadManager();
    gamepads.attach(window);
    let audio = null;
    try {
        audio = await AudioOutput.create();
        emulator.setAudioRate(audio.sampleRate);
        audio.resumeOnGesture(window, () => undefined);
    }
    catch {
        audio = null;
    }
    let paused = false;
    let current = null;
    let netplayRole = null;
    let localPlayer = 0;
    const remotePlayer = () => (localPlayer === 0 ? 1 : 0);
    let regionChoice = "auto";
    let tvChoice = "auto";
    const listeners = new Set();
    const frameListeners = new Set();
    let padText = "";
    let alive = true;
    const emit = () => listeners.forEach((fn) => fn());
    const applyHardware = () => {
        const info = current?.info ?? null;
        const region = regionChoice === "auto" ? (info?.region ?? "export") : regionChoice;
        const tv = tvChoice === "auto" ? (info?.tv ?? "ntsc") : tvChoice;
        emulator.machine.setRegion(region);
        emulator.setTv(tv);
    };
    const session = {
        loadBytes(bytes, fileName) {
            const info = detectRom(bytes, fileName);
            const cartridge = new Cartridge(info.rom, info.saveRam);
            emulator.machine.insertCartridge(cartridge);
            current = { info, fileName, title: displayTitle(info, fileName) };
            applyHardware();
            paused = false;
            emulator.resetTiming();
            audio?.flush();
            emit();
            return current;
        },
        async loadFile(file) {
            try {
                const inner = await filesFrom(file);
                for (const entry of inner) {
                    const media = await readMedia(entry);
                    if (media.kind === "cartridge")
                        return session.loadBytes(media.image, media.name);
                }
                throw new Error("no Genesis");
            }
            catch (error) {
                throw spanishError(error);
            }
        },
        setPaused(next) {
            if (paused === next)
                return;
            paused = next;
            if (paused) {
                emulator.resetTiming();
                audio?.flush();
            }
            emit();
        },
        isPaused: () => paused,
        reset() {
            emulator.machine.pressReset();
            emulator.resetTiming();
            audio?.flush();
            paused = false;
            emit();
        },
        /** A cold boot used by Netplay so both consoles start from cleared RAM. */
        prepareNetplayStart() {
            if (!current || !emulator.machine.canRun)
                throw new Error("Primero carga el mismo juego en ambos navegadores.");
            emulator.machine.powerOn();
            emulator.resetTiming();
            audio?.flush();
            paused = false;
            emit();
        },
        /** Compressed authoritative state snapshots keep the guest close to the host. */
        async exportNetplayState() {
            return encodeState(emulator.machine.saveState());
        },
        async importNetplayState(bytes) {
            const input = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
            const state = await decodeState(input);
            if (!current || !emulator.machine.canRun)
                return;
            emulator.machine.loadState(state);
            emulator.restored();
            paused = false;
            emit();
        },
        /** A compressed snapshot of the whole console, for the player's own save states. */
        async saveSnapshot() {
            if (!current || !emulator.machine.canRun)
                throw new Error("No hay ningún juego en marcha.");
            return encodeState(emulator.machine.saveState());
        },
        async loadSnapshot(bytes) {
            if (!current || !emulator.machine.canRun)
                throw new Error("No hay ningún juego en marcha.");
            const state = await decodeState(bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes));
            emulator.machine.loadState(state);
            emulator.restored();
            audio?.flush();
            emit();
        },
        setLowLatency(low) {
            audio?.setLowLatency(Boolean(low));
        },
        powerOff() {
            emulator.machine.insertCartridge(null);
            current = null;
            paused = false;
            audio?.flush();
            emit();
        },
        applyConsole(region, tv, pad) {
            regionChoice = region;
            tvChoice = tv;
            emulator.machine.setPadType(pad);
            applyHardware();
            emit();
        },
        setSound(enabled, volume) {
            audio?.setEnabled(enabled);
            audio?.setVolume(volume);
        },
        setKeyboard(buttons) {
            emulator.machine.controllers.inputs[localPlayer].set("keyboard", { buttons });
        },
        setTouch(buttons) {
            emulator.machine.controllers.inputs[localPlayer].set("touch", { buttons });
        },
        setNetplayRole(role) {
            netplayRole = role;
            localPlayer = role === "guest" ? 1 : 0;
            for (const input of emulator.machine.controllers.inputs) {
                input.clear("keyboard");
                input.clear("touch");
                input.clear("gamepad");
                input.clear("netplay");
            }
        },
        setRemoteButtons(buttons) {
            if (!netplayRole)
                return;
            emulator.machine.controllers.inputs[remotePlayer()].set("netplay", { buttons });
        },
        localButtons() {
            return emulator.machine.controllers.inputs[localPlayer].state.buttons;
        },
        padLabels: () => padText,
        current: () => current,
        onChange(listener) {
            listeners.add(listener);
            return () => listeners.delete(listener);
        },
        onFrame(listener) {
            frameListeners.add(listener);
            return () => frameListeners.delete(listener);
        },
        destroy() {
            alive = false;
            audio?.flush();
        },
    };
    let last = performance.now();
    const frame = (now) => {
        if (!alive)
            return;
        const elapsed = now - last;
        last = now;
        const pads = gamepads.connected();
        if (netplayRole) {
            const pad = pads[0];
            const localInput = emulator.machine.controllers.inputs[localPlayer];
            const remoteInput = emulator.machine.controllers.inputs[remotePlayer()];
            if (pad)
                localInput.set("gamepad", readGamepad(pad));
            else
                localInput.clear("gamepad");
            remoteInput.clear("gamepad");
        }
        else {
            for (let player = 0; player < 2; player++) {
                const pad = pads[player];
                const input = emulator.machine.controllers.inputs[player];
                if (pad)
                    input.set("gamepad", readGamepad(pad));
                else
                    input.clear("gamepad");
            }
        }
        const names = netplayRole
            ? pads[0] ? `Netplay · local ${netplayRole === "host" ? "J1" : "J2"}: ${padName(pads[0])}` : `Netplay · local ${netplayRole === "host" ? "J1" : "J2"}`
            : pads.slice(0, 2).map((pad, index) => `J${index + 1}: ${padName(pad)}`).join(" · ");
        if (names !== padText) {
            padText = names;
            emit();
        }
        if (!paused) {
            emulator.run(elapsed);
            if (audio)
                audio.play(emulator.takeAudioSamples());
        }
        else {
            emulator.takeAudioSamples();
        }
        screen.present();
        frameListeners.forEach((fn) => fn());
        requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
    screen.showIdle();
    screen.present();
    return session;
}

export const ACTION_LABEL = {
    up: "Arriba",
    down: "Abajo",
    left: "Izquierda",
    right: "Derecha",
    a: "A",
    b: "B",
    c: "C",
    x: "X",
    y: "Y",
    z: "Z",
    start: "Start",
    mode: "Mode",
};
export const ACTIONS = Object.keys(ACTION_LABEL);
export const DEFAULT_SETTINGS = {
    region: "auto",
    tv: "auto",
    pad: "six",
    controllerStyle: "sega",
    volume: 0.7,
    sound: true,
    crt: false,
    integerScale: true,
    lowLatency: true,
    touchScale: 100,
    keys: {
        up: "ArrowUp",
        down: "ArrowDown",
        left: "ArrowLeft",
        right: "ArrowRight",
        a: "KeyZ",
        b: "KeyX",
        c: "KeyC",
        x: "KeyA",
        y: "KeyS",
        z: "KeyD",
        start: "Enter",
        mode: "ShiftRight",
    },
};
const STORAGE_KEY = "retro-genesis-settings-v1";
export function loadSettings() {
    if (typeof localStorage === "undefined")
        return DEFAULT_SETTINGS;
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw)
            return DEFAULT_SETTINGS;
        const parsed = JSON.parse(raw);
        return {
            ...DEFAULT_SETTINGS,
            ...parsed,
            keys: { ...DEFAULT_SETTINGS.keys, ...(parsed.keys ?? {}) },
            volume: clampVolume(parsed.volume ?? DEFAULT_SETTINGS.volume),
        };
    }
    catch {
        return DEFAULT_SETTINGS;
    }
}
export function saveSettings(settings) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
}
export function clampVolume(value) {
    if (!Number.isFinite(value))
        return DEFAULT_SETTINGS.volume;
    return Math.min(1, Math.max(0, value));
}
export function keyLabel(code) {
    const named = {
        ArrowUp: "↑",
        ArrowDown: "↓",
        ArrowLeft: "←",
        ArrowRight: "→",
        Enter: "Enter",
        ShiftRight: "Shift der.",
        ShiftLeft: "Shift izq.",
        Space: "Espacio",
        Escape: "Esc",
    };
    if (named[code])
        return named[code];
    if (code.startsWith("Key"))
        return code.slice(3);
    if (code.startsWith("Digit"))
        return code.slice(5);
    return code;
}

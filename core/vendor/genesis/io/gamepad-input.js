import { Button } from './controllers.js';
const AXIS_THRESHOLD = 0.5;
/** Axes never go past ±1; a hat switch reads about 1.29 when centred. */
const HAT_NEUTRAL_LIMIT = 1.05;
// Standard gamepad mapping (https://w3c.github.io/gamepad/#remapping), laid out as Sega's
// own collections do: left, bottom and right face buttons are A, B and C; the left
// shoulder, top face button and right shoulder are X, Y and Z; Back is Mode.
const DPAD_UP = 12;
const DPAD_DOWN = 13;
const DPAD_LEFT = 14;
const DPAD_RIGHT = 15;
const BUTTONS = [
    [2, Button.A],
    [0, Button.B],
    [1, Button.C],
    [4, Button.X],
    [3, Button.Y],
    [5, Button.Z],
    [9, Button.Start],
    [8, Button.Mode],
];
const HAT_STEPS = [
    Button.Up,
    Button.Up | Button.Right,
    Button.Right,
    Button.Down | Button.Right,
    Button.Down,
    Button.Down | Button.Left,
    Button.Left,
    Button.Up | Button.Left,
];
/**
 * Directions of a hat switch reported as one axis: eight positions from -1
 * (up) clockwise in steps of 2/7, and a value beyond ±1 when centred. Many USB
 * pads report their D-pad this way when the browser has no standard mapping.
 */
export function hatDirections(value) {
    if (Math.abs(value) > HAT_NEUTRAL_LIMIT)
        return 0;
    return HAT_STEPS[Math.round((value + 1) * 3.5)] ?? 0;
}
/** Axes seen resting beyond ±1, which makes them hat switches, by pad id. */
const knownHatAxes = new Map();
function hatAxes(pad) {
    let hats = knownHatAxes.get(pad.id);
    if (!hats) {
        hats = new Set();
        knownHatAxes.set(pad.id, hats);
    }
    pad.axes.forEach((value, index) => {
        if (Math.abs(value) > HAT_NEUTRAL_LIMIT)
            hats.add(index);
    });
    return hats;
}
function axisPairDirs(x, y) {
    let dirs = 0;
    if (y < -AXIS_THRESHOLD)
        dirs |= Button.Up;
    if (y > AXIS_THRESHOLD)
        dirs |= Button.Down;
    if (x < -AXIS_THRESHOLD)
        dirs |= Button.Left;
    if (x > AXIS_THRESHOLD)
        dirs |= Button.Right;
    return dirs;
}
/** A pad as a Genesis controller: D-pad or stick, face and shoulder buttons for A, B, C, X, Y and Z, and Start. */
export function readGamepad(pad) {
    const pressed = (i) => pad.buttons[i]?.pressed ?? false;
    const axes = pad.axes;
    let buttons = 0;
    if (pad.mapping === 'standard') {
        if (pressed(DPAD_UP))
            buttons |= Button.Up;
        if (pressed(DPAD_DOWN))
            buttons |= Button.Down;
        if (pressed(DPAD_LEFT))
            buttons |= Button.Left;
        if (pressed(DPAD_RIGHT))
            buttons |= Button.Right;
        buttons |= axisPairDirs(axes[0] ?? 0, axes[1] ?? 0);
    }
    else {
        const hats = hatAxes(pad);
        if (!hats.has(0) && !hats.has(1))
            buttons |= axisPairDirs(axes[0] ?? 0, axes[1] ?? 0);
        for (const index of hats)
            buttons |= hatDirections(axes[index] ?? 2);
    }
    for (const [index, button] of BUTTONS)
        if (pressed(index))
            buttons |= button;
    return { buttons };
}
/** Connected gamepads in the order they were plugged in; the first is player 1, the second player 2. */
export class GamepadManager {
    source;
    connectOrder = [];
    constructor(source = browserGamepads) {
        this.source = source;
    }
    attach(target) {
        target.addEventListener('gamepadconnected', (event) => this.noteConnected(event.gamepad.index));
        target.addEventListener('gamepaddisconnected', (event) => {
            const at = this.connectOrder.indexOf(event.gamepad.index);
            if (at >= 0)
                this.connectOrder.splice(at, 1);
        });
    }
    noteConnected(index) {
        if (!this.connectOrder.includes(index))
            this.connectOrder.push(index);
    }
    connected() {
        const pads = [...this.source()].filter((pad) => pad !== null && pad.connected !== false);
        for (const pad of pads)
            this.noteConnected(pad.index);
        const rank = (pad) => this.connectOrder.indexOf(pad.index);
        return pads.sort((a, b) => rank(a) - rank(b));
    }
}
function browserGamepads() {
    try {
        return navigator.getGamepads?.() ?? [];
    }
    catch {
        // Blocked by a permissions policy.
        return [];
    }
}
/** A short, readable name for a pad (browsers add vendor and product codes). */
export function padName(pad) {
    return pad.id.replace(/\s*\(.*\)\s*$/, '').trim() || 'Gamepad';
}

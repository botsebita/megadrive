const workletUrl = new URL("./player-worklet.js", import.meta.url).href;
/**
 * Sends emulator audio to the speakers through an AudioWorklet. Browsers only
 * allow audio to start after a user gesture, so playback begins on the first
 * click, tap or key press.
 */
export class AudioOutput {
    context;
    node;
    enabled = true;
    gain;
    constructor(context, node) {
        this.context = context;
        this.node = node;
        this.gain = context.createGain();
        node.connect(this.gain).connect(context.destination);
    }
    static async create() {
        const context = new AudioContext({ latencyHint: 'interactive' });
        await context.audioWorklet.addModule(workletUrl);
        const node = new AudioWorkletNode(context, 'sample-player', { outputChannelCount: [2] });
        return new AudioOutput(context, node);
    }
    get sampleRate() {
        return this.context.sampleRate;
    }
    /** True once the browser has let audio start. */
    get running() {
        return this.context.state === 'running';
    }
    /** Resumes playback on the first user gesture; calls `onStart` once it is running. */
    resumeOnGesture(target, onStart) {
        const resume = () => {
            void this.context.resume().then(() => {
                if (!this.running)
                    return;
                target.removeEventListener('pointerdown', resume);
                target.removeEventListener('keydown', resume);
                onStart();
            });
        };
        target.addEventListener('pointerdown', resume);
        target.addEventListener('keydown', resume);
    }
    setEnabled(enabled) {
        this.enabled = enabled;
        if (!enabled)
            this.flush();
    }
    setVolume(volume) {
        this.gain.gain.value = volume;
    }
    /** Queues samples for playback (ignored while muted or before audio has started). */
    play(samples) {
        if (!this.enabled || !this.running || samples.length === 0)
            return;
        this.node.port.postMessage(samples, [samples.buffer]);
    }
    /** Low-latency mode keeps less audio queued: faster response, less slack for slow devices. */
    setLowLatency(low) {
        this.node.port.postMessage({ latency: low ? 0.045 : 0.06, max: low ? 0.14 : 0.2 });
    }
    /** Drops queued audio, e.g. after pausing. */
    flush() {
        this.node.port.postMessage('flush');
    }
}

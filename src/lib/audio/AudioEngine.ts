import { computeBands, type FrequencyBands } from "./bands";
import { BpmDetector } from "./bpm";

export interface AudioAnalysis {
  frequency: Uint8Array; // raw FFT data (0–255)
  bands: FrequencyBands; // bass / mid / treble (0–1)
  bpm: number;
  level: number;         // overall loudness (0–1)
}

const FFT_SIZE = 1024;

const EMPTY_BANDS: FrequencyBands = { bass: 0, mid: 0, treble: 0 };

/**
 * Framework-agnostic Web Audio wrapper.
 *
 * Signal graph:  <audio> → MediaElementSource → Analyser → Gain → destination
 *
 * The graph is built lazily on first `play()` (must follow a user gesture so
 * the AudioContext can start). Attach any <audio> element via `attach()`;
 * dropping an mp3 into that element's `src` is all that's needed to connect.
 */
export class AudioEngine {
  private ctx: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private gain: GainNode | null = null;
  private source: MediaElementAudioSourceNode | null = null;
  private el: HTMLAudioElement | null = null;

  private data = new Uint8Array(FFT_SIZE / 2);
  private bpmDetector = new BpmDetector();

  get isReady() {
    return this.ctx !== null;
  }

  /** Bind the <audio> element. Safe to call repeatedly with the same element. */
  attach(el: HTMLAudioElement) {
    this.el = el;
  }

  private ensureGraph() {
    if (this.ctx || !this.el) return;

    const ctx = new AudioContext();
    const analyser = ctx.createAnalyser();
    analyser.fftSize = FFT_SIZE;
    analyser.smoothingTimeConstant = 0.8;

    const gain = ctx.createGain();
    const source = ctx.createMediaElementSource(this.el);

    source.connect(analyser);
    analyser.connect(gain);
    gain.connect(ctx.destination);

    this.ctx = ctx;
    this.analyser = analyser;
    this.gain = gain;
    this.source = source;
    this.data = new Uint8Array(analyser.frequencyBinCount);
  }

  async play() {
    this.ensureGraph();
    if (this.ctx?.state === "suspended") await this.ctx.resume();
    await this.el?.play();
  }

  pause() {
    this.el?.pause();
  }

  setVolume(v: number) {
    if (this.gain) this.gain.gain.value = v;
  }

  /** Sample the current frame. Call inside a requestAnimationFrame loop. */
  analyse(now: number): AudioAnalysis {
    if (!this.analyser || !this.ctx) {
      return { frequency: this.data, bands: EMPTY_BANDS, bpm: 0, level: 0 };
    }

    this.analyser.getByteFrequencyData(this.data);
    const bands = computeBands(this.data, this.ctx.sampleRate, FFT_SIZE);
    const bpm = this.bpmDetector.update(bands.bass, now);
    const level = (bands.bass + bands.mid + bands.treble) / 3;

    return { frequency: this.data, bands, bpm, level };
  }

  dispose() {
    this.source?.disconnect();
    this.analyser?.disconnect();
    this.gain?.disconnect();
    this.ctx?.close();
    this.ctx = null;
    this.analyser = null;
    this.gain = null;
    this.source = null;
    this.bpmDetector.reset();
  }
}

/**
 * Real-time BPM estimator.
 *
 * Energy-based beat detection: a beat is registered when instantaneous bass
 * energy spikes above a moving average. The median interval between recent
 * beats gives the tempo. Approximate, but stable enough for reactive visuals.
 */
export class BpmDetector {
  private energyHistory: number[] = [];
  private intervals: number[] = [];
  private lastBeat = 0;
  private bpm = 0;

  // ~1s of history at 60fps.
  private static readonly HISTORY = 60;
  // Reject beats closer than this (ms) → caps at 240 BPM.
  private static readonly MIN_INTERVAL = 250;
  // Sensitivity: bass must exceed avg * SPIKE to count as a beat.
  private static readonly SPIKE = 1.3;

  /** @param bassEnergy 0–1  @param now performance.now() in ms */
  update(bassEnergy: number, now: number): number {
    const hist = this.energyHistory;
    hist.push(bassEnergy);
    if (hist.length > BpmDetector.HISTORY) hist.shift();

    const avg = hist.reduce((a, b) => a + b, 0) / hist.length;
    const threshold = avg * BpmDetector.SPIKE + 0.02;

    if (
      bassEnergy > threshold &&
      now - this.lastBeat > BpmDetector.MIN_INTERVAL
    ) {
      if (this.lastBeat > 0) {
        this.intervals.push(now - this.lastBeat);
        if (this.intervals.length > 12) this.intervals.shift();

        const sorted = [...this.intervals].sort((a, b) => a - b);
        const median = sorted[Math.floor(sorted.length / 2)];
        this.bpm = Math.round(60000 / median);
      }
      this.lastBeat = now;
    }

    return this.bpm;
  }

  reset() {
    this.energyHistory = [];
    this.intervals = [];
    this.lastBeat = 0;
    this.bpm = 0;
  }
}

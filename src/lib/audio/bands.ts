// Splits raw FFT frequency data into bass / mid / treble bands.

export interface FrequencyBands {
  bass: number;   // 0–1
  mid: number;    // 0–1
  treble: number; // 0–1
}

// Standard-ish audio band boundaries (Hz).
const BANDS = {
  bass:   [20, 250],
  mid:    [250, 4000],
  treble: [4000, 16000],
} as const;

/**
 * Averages the FFT bins that fall inside each band and normalizes to 0–1.
 *
 * @param data      Uint8Array from analyser.getByteFrequencyData (0–255)
 * @param sampleRate AudioContext.sampleRate (Hz)
 * @param fftSize   AnalyserNode.fftSize
 */
export function computeBands(
  data: Uint8Array,
  sampleRate: number,
  fftSize: number
): FrequencyBands {
  const binHz = sampleRate / fftSize;

  const avg = (loHz: number, hiHz: number) => {
    const lo = Math.max(0, Math.floor(loHz / binHz));
    const hi = Math.min(data.length - 1, Math.ceil(hiHz / binHz));
    let sum = 0;
    let n = 0;
    for (let i = lo; i <= hi; i++) {
      sum += data[i];
      n++;
    }
    return n ? sum / n / 255 : 0;
  };

  return {
    bass:   avg(BANDS.bass[0], BANDS.bass[1]),
    mid:    avg(BANDS.mid[0], BANDS.mid[1]),
    treble: avg(BANDS.treble[0], BANDS.treble[1]),
  };
}

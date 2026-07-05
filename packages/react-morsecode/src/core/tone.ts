export type OscillatorWave = "sine" | "square" | "sawtooth" | "triangle";

export interface ToneOptions {
  oscillatorType?: OscillatorWave;
  frequencyHz?: number;
  /** Duration of one dot in seconds. T = 1.2s / words-per-minute. */
  dotSeconds?: number;
}

export const DEFAULT_TONE: Required<ToneOptions> = {
  oscillatorType: "sine",
  frequencyHz: 750,
  dotSeconds: 0.08,
};

/** Merge partial tone options over the defaults, ignoring undefined values. */
export function resolveTone(options: ToneOptions = {}): Required<ToneOptions> {
  return {
    oscillatorType: options.oscillatorType ?? DEFAULT_TONE.oscillatorType,
    frequencyHz: options.frequencyHz ?? DEFAULT_TONE.frequencyHz,
    dotSeconds: options.dotSeconds ?? DEFAULT_TONE.dotSeconds,
  };
}

import { buildSchedule } from "./schedule.js";
import { resolveTone, type OscillatorWave, type ToneOptions } from "./tone.js";

export interface WavOptions extends ToneOptions {
  /** Output sample rate. Defaults to 22050 Hz. */
  sampleRate?: number;
}

const TAIL_SECONDS = 0.1;
const AMPLITUDE = Math.round(0.8 * 0x7fff);

/**
 * Render a morse string as a complete WAV file (16-bit mono PCM).
 * Pure and deterministic — no Web Audio required.
 */
export function encodeWav(morse: string, options: WavOptions = {}): Uint8Array {
  const { oscillatorType, frequencyHz, dotSeconds } = resolveTone(options);
  const sampleRate = options.sampleRate ?? 22050;

  const schedule = buildSchedule(morse, { dotSeconds });
  const totalSamples = Math.ceil((schedule.duration + TAIL_SECONDS) * sampleRate);
  const samples = new Int16Array(totalSamples);

  for (const pulse of schedule.pulses) {
    const startSample = Math.floor(pulse.start * sampleRate);
    const endSample = Math.min(totalSamples, Math.floor((pulse.start + pulse.duration) * sampleRate));
    for (let i = startSample; i < endSample; i++) {
      samples[i] = Math.round(AMPLITUDE * waveSample(oscillatorType, frequencyHz, i / sampleRate));
    }
  }

  return wrapWavHeader(samples, sampleRate);
}

/** Render a morse string as a WAV Blob, ready to download or feed to an <audio> element. */
export function renderWavBlob(morse: string, options: WavOptions = {}): Blob {
  const bytes = encodeWav(morse, options);
  return new Blob([bytes.buffer as ArrayBuffer], { type: "audio/wav" });
}

function waveSample(type: OscillatorWave, frequencyHz: number, timeSeconds: number): number {
  const phase = (timeSeconds * frequencyHz) % 1;
  switch (type) {
    case "square":
      return phase < 0.5 ? 1 : -1;
    case "sawtooth":
      return 2 * phase - 1;
    case "triangle":
      if (phase < 0.25) return 4 * phase;
      if (phase < 0.75) return 2 - 4 * phase;
      return 4 * phase - 4;
    case "sine":
      return Math.sin(2 * Math.PI * phase);
  }
}

function wrapWavHeader(samples: Int16Array, sampleRate: number): Uint8Array {
  const dataBytes = samples.length * 2;
  const buffer = new ArrayBuffer(44 + dataBytes);
  const view = new DataView(buffer);

  writeAscii(view, 0, "RIFF");
  view.setUint32(4, 36 + dataBytes, true);
  writeAscii(view, 8, "WAVE");
  writeAscii(view, 12, "fmt ");
  view.setUint32(16, 16, true); // fmt chunk size
  view.setUint16(20, 1, true); // PCM
  view.setUint16(22, 1, true); // mono
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true); // byte rate
  view.setUint16(32, 2, true); // block align
  view.setUint16(34, 16, true); // bits per sample
  writeAscii(view, 36, "data");
  view.setUint32(40, dataBytes, true);
  new Int16Array(buffer, 44).set(samples);

  return new Uint8Array(buffer);
}

function writeAscii(view: DataView, offset: number, text: string): void {
  for (let i = 0; i < text.length; i++) {
    view.setUint8(offset + i, text.charCodeAt(i));
  }
}

import { describe, expect, it } from "vitest";
import { buildSchedule } from "./schedule.js";
import { encodeWav } from "./wav.js";

const SAMPLE_RATE = 8000;

function ascii(bytes: Uint8Array, start: number, length: number): string {
  return String.fromCharCode(...bytes.subarray(start, start + length));
}

function readUint32(bytes: Uint8Array, offset: number): number {
  return new DataView(bytes.buffer, bytes.byteOffset).getUint32(offset, true);
}

function sampleAt(bytes: Uint8Array, index: number): number {
  return new DataView(bytes.buffer, bytes.byteOffset).getInt16(44 + index * 2, true);
}

describe("encodeWav", () => {
  it("produces a valid 16-bit mono PCM WAV header", () => {
    const wav = encodeWav("...", { sampleRate: SAMPLE_RATE });
    expect(ascii(wav, 0, 4)).toBe("RIFF");
    expect(ascii(wav, 8, 4)).toBe("WAVE");
    expect(ascii(wav, 36, 4)).toBe("data");
    expect(readUint32(wav, 24)).toBe(SAMPLE_RATE); // sample rate
    expect(readUint32(wav, 40)).toBe(wav.length - 44); // data chunk size
  });

  it("covers the schedule duration plus a silent tail", () => {
    const morse = "... --- ...";
    const schedule = buildSchedule(morse);
    const wav = encodeWav(morse, { sampleRate: SAMPLE_RATE });
    const samples = (wav.length - 44) / 2;
    expect(samples / SAMPLE_RATE).toBeGreaterThanOrEqual(schedule.duration);
  });

  it("has tone during pulses and silence during gaps", () => {
    // "." with dot=0.1s → tone in [0, 0.1), silence after
    const wav = encodeWav(".", { sampleRate: SAMPLE_RATE, dotSeconds: 0.1 });
    const midPulse = Math.floor(0.05 * SAMPLE_RATE);
    const inTail = Math.floor(0.15 * SAMPLE_RATE);

    let peak = 0;
    for (let i = 0; i < midPulse; i++) peak = Math.max(peak, Math.abs(sampleAt(wav, i)));
    expect(peak).toBeGreaterThan(10000);
    expect(sampleAt(wav, inTail)).toBe(0);
  });

  it("honors the square oscillator type", () => {
    const wav = encodeWav(".", { sampleRate: SAMPLE_RATE, dotSeconds: 0.1, oscillatorType: "square" });
    const amplitude = Math.round(0.8 * 0x7fff);
    const values = new Set<number>();
    for (let i = 1; i < 0.09 * SAMPLE_RATE; i++) values.add(sampleAt(wav, i));
    expect([...values].every((v) => v === amplitude || v === -amplitude)).toBe(true);
  });
});

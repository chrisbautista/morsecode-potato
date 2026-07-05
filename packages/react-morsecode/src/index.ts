// Core (framework-free)
export { CHAR_TO_MORSE } from "./core/alphabet.js";
export { ABBREVIATIONS, applyAbbreviations } from "./core/abbreviations.js";
export { encode, type EncodeOptions } from "./core/encode.js";
export { buildSchedule, type Pulse, type SignalSchedule } from "./core/schedule.js";
export { DEFAULT_TONE, type OscillatorWave, type ToneOptions } from "./core/tone.js";
export { encodeWav, renderWavBlob, type WavOptions } from "./core/wav.js";
export { saveBlob, saveText } from "./core/files.js";

// Playback engine
export {
  isAudioSupported,
  MorseTransport,
  type TransportOptions,
  type TransportSnapshot,
  type TransportState,
} from "./transport.js";

// React hooks
export { useMorse, type UseMorseOptions, type UseMorseResult } from "./useMorse.js";
export {
  useMorsePlayer,
  type UseMorsePlayerOptions,
  type UseMorsePlayerResult,
} from "./useMorsePlayer.js";

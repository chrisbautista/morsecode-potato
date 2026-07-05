import { useCallback, useEffect, useRef, useSyncExternalStore } from "react";
import {
  isAudioSupported,
  MorseTransport,
  type TransportOptions,
  type TransportState,
} from "./transport.js";

export type UseMorsePlayerOptions = TransportOptions;

export interface UseMorsePlayerResult {
  play: () => void;
  pause: () => void;
  resume: () => void;
  stop: () => void;
  state: TransportState;
  isPlaying: boolean;
  isPaused: boolean;
  /** True while a tone pulse is active — drives visual signalling. */
  signalOn: boolean;
  /** Playback position, 0..1. */
  progress: number;
  /** True when the browser can play sound (Web Audio available). */
  supportsAudio: boolean;
}

/**
 * Play a morse string as audio, as a silent visual signal, or both in sync.
 * Pass `audio: false` for visual-only playback; read `signalOn` to drive visuals.
 */
export function useMorsePlayer(morse: string, options: UseMorsePlayerOptions = {}): UseMorsePlayerResult {
  const { audio = true, oscillatorType, frequencyHz, dotSeconds } = options;

  const transportRef = useRef<MorseTransport | null>(null);
  transportRef.current ??= new MorseTransport({ audio, oscillatorType, frequencyHz, dotSeconds });
  const transport = transportRef.current;

  useEffect(() => {
    transport.setMorse(morse);
  }, [transport, morse]);

  useEffect(() => {
    transport.configure({ audio, oscillatorType, frequencyHz, dotSeconds });
  }, [transport, audio, oscillatorType, frequencyHz, dotSeconds]);

  useEffect(() => {
    return () => {
      transport.dispose();
    };
  }, [transport]);

  const subscribe = useCallback((onChange: () => void) => transport.subscribe(onChange), [transport]);
  const snapshot = useSyncExternalStore(
    subscribe,
    () => transport.snapshot,
    () => transport.snapshot,
  );

  return {
    play: useCallback(() => transport.play(), [transport]),
    pause: useCallback(() => transport.pause(), [transport]),
    resume: useCallback(() => transport.resume(), [transport]),
    stop: useCallback(() => transport.stop(), [transport]),
    state: snapshot.state,
    isPlaying: snapshot.state === "playing",
    isPaused: snapshot.state === "paused",
    signalOn: snapshot.signalOn,
    progress: snapshot.progress,
    supportsAudio: isAudioSupported(),
  };
}

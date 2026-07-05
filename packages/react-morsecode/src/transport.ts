import { buildSchedule, type SignalSchedule } from "./core/schedule.js";
import { resolveTone, type ToneOptions } from "./core/tone.js";

export interface TransportOptions extends ToneOptions {
  /** Play sound while running. When false the transport is a silent visual clock. Default true. */
  audio?: boolean;
}

export type TransportState = "idle" | "playing" | "paused";

export interface TransportSnapshot {
  state: TransportState;
  /** True while a tone pulse is active — drives visual signalling. */
  signalOn: boolean;
  /** Playback position, 0..1. */
  progress: number;
}

const IDLE_SNAPSHOT: TransportSnapshot = { state: "idle", signalOn: false, progress: 0 };
const TICK_MS = 16;
const AUDIO_LEAD_SECONDS = 0.05;

export function isAudioSupported(): boolean {
  return typeof window !== "undefined" && typeof window.AudioContext === "function";
}

/**
 * Playback engine for a morse signal schedule.
 * One clock drives both the audio graph and the `signalOn` visual state,
 * so sound and visuals can never drift apart.
 */
export class MorseTransport {
  #morse = "";
  #audio: boolean;
  #tone: Required<ToneOptions>;
  #schedule: SignalSchedule | null = null;

  #audioContext: AudioContext | null = null;
  #oscillator: OscillatorNode | null = null;
  #gain: GainNode | null = null;
  #audioStartTime = 0;
  #usingAudio = false;

  // Clock for silent (visual-only) playback.
  #perfStartMs = 0;
  #pausedElapsed = 0;

  #tickHandle: ReturnType<typeof setTimeout> | null = null;
  #endHandle: ReturnType<typeof setTimeout> | null = null;
  #listeners = new Set<() => void>();
  #snapshot: TransportSnapshot = IDLE_SNAPSHOT;

  constructor(options: TransportOptions = {}) {
    this.#audio = options.audio ?? true;
    this.#tone = resolveTone(options);
  }

  /** Update options. Takes effect on the next play(). */
  configure(options: TransportOptions): void {
    if (options.audio !== undefined) this.#audio = options.audio;
    this.#tone = resolveTone({ ...this.#tone, ...options });
  }

  /** Set the morse string to play. Takes effect on the next play(). */
  setMorse(morse: string): void {
    this.#morse = morse;
  }

  get snapshot(): TransportSnapshot {
    return this.#snapshot;
  }

  subscribe(listener: () => void): () => void {
    this.#listeners.add(listener);
    return () => {
      this.#listeners.delete(listener);
    };
  }

  play(): void {
    if (this.#snapshot.state !== "idle") return;

    const schedule = buildSchedule(this.#morse, { dotSeconds: this.#tone.dotSeconds });
    if (schedule.duration === 0) return;
    this.#schedule = schedule;
    this.#usingAudio = this.#audio && isAudioSupported();

    if (this.#usingAudio) {
      this.#startAudio(schedule);
    } else {
      this.#perfStartMs = nowMs();
      this.#pausedElapsed = 0;
    }

    this.#setSnapshot({ state: "playing", signalOn: false, progress: 0 });
    this.#scheduleTick();
    this.#armEndTimer();
  }

  pause(): void {
    if (this.#snapshot.state !== "playing") return;
    if (this.#usingAudio) {
      void this.#audioContext?.suspend();
    } else {
      this.#pausedElapsed = this.#elapsed();
    }
    this.#stopTicking();
    this.#setSnapshot({ ...this.#snapshot, state: "paused" });
  }

  resume(): void {
    if (this.#snapshot.state !== "paused") return;
    if (this.#usingAudio) {
      void this.#audioContext?.resume();
    } else {
      this.#perfStartMs = nowMs();
    }
    this.#setSnapshot({ ...this.#snapshot, state: "playing" });
    this.#scheduleTick();
    this.#armEndTimer();
  }

  stop(): void {
    if (this.#snapshot.state === "idle") return;
    this.#finish();
  }

  /** Stop playback and release the AudioContext. Call when done with the transport. */
  dispose(): void {
    this.stop();
    if (this.#audioContext) {
      void this.#audioContext.close();
      this.#audioContext = null;
    }
    this.#listeners.clear();
  }

  #startAudio(schedule: SignalSchedule): void {
    const context = this.#ensureContext();
    // Autoplay policies may leave a fresh context suspended until a user gesture.
    void context.resume();

    const startAt = context.currentTime + AUDIO_LEAD_SECONDS;
    const gain = context.createGain();
    gain.gain.setValueAtTime(0, context.currentTime);
    for (const pulse of schedule.pulses) {
      gain.gain.setValueAtTime(1, startAt + pulse.start);
      gain.gain.setValueAtTime(0, startAt + pulse.start + pulse.duration);
    }

    const oscillator = context.createOscillator();
    oscillator.type = this.#tone.oscillatorType;
    oscillator.frequency.value = this.#tone.frequencyHz;
    oscillator.connect(gain);
    gain.connect(context.destination);
    oscillator.start(startAt);
    oscillator.stop(startAt + schedule.duration + AUDIO_LEAD_SECONDS);

    this.#oscillator = oscillator;
    this.#gain = gain;
    this.#audioStartTime = startAt;
  }

  #ensureContext(): AudioContext {
    if (!this.#audioContext || this.#audioContext.state === "closed") {
      this.#audioContext = new AudioContext();
    }
    return this.#audioContext;
  }

  #teardownAudio(): void {
    if (this.#oscillator) {
      try {
        this.#oscillator.stop();
      } catch {
        // Already stopped — fine.
      }
      this.#oscillator.disconnect();
      this.#oscillator = null;
    }
    if (this.#gain) {
      this.#gain.disconnect();
      this.#gain = null;
    }
  }

  #finish(): void {
    this.#teardownAudio();
    this.#stopTicking();
    this.#schedule = null;
    this.#setSnapshot(IDLE_SNAPSHOT);
  }

  #elapsed(): number {
    if (this.#usingAudio && this.#audioContext) {
      return Math.max(0, this.#audioContext.currentTime - this.#audioStartTime);
    }
    if (this.#snapshot.state === "paused") {
      return this.#pausedElapsed;
    }
    return this.#pausedElapsed + (nowMs() - this.#perfStartMs) / 1000;
  }

  #tick = (): void => {
    const schedule = this.#schedule;
    if (!schedule || this.#snapshot.state !== "playing") return;

    const elapsed = this.#elapsed();
    if (elapsed >= schedule.duration) {
      this.#finish();
      return;
    }

    const signalOn = schedule.pulses.some(
      (pulse) => elapsed >= pulse.start && elapsed < pulse.start + pulse.duration,
    );
    this.#setSnapshot({
      state: "playing",
      signalOn,
      progress: Math.min(1, elapsed / schedule.duration),
    });
    this.#scheduleTick();
  };

  #scheduleTick(): void {
    this.#tickHandle = setTimeout(this.#tick, TICK_MS);
  }

  /**
   * Backstop for browser timer throttling: the 16ms tick chain can be slowed to
   * seconds (or worse) in background tabs, so a fresh one-shot timer is armed for
   * the remaining duration to guarantee playback still ends close to on time.
   */
  #armEndTimer(): void {
    this.#clearEndTimer();
    const schedule = this.#schedule;
    if (!schedule) return;
    const remainingMs = Math.max(0, (schedule.duration - this.#elapsed()) * 1000);
    this.#endHandle = setTimeout(this.#tick, remainingMs + 25);
  }

  #clearEndTimer(): void {
    if (this.#endHandle !== null) {
      clearTimeout(this.#endHandle);
      this.#endHandle = null;
    }
  }

  #stopTicking(): void {
    if (this.#tickHandle !== null) {
      clearTimeout(this.#tickHandle);
      this.#tickHandle = null;
    }
    this.#clearEndTimer();
  }

  #setSnapshot(next: TransportSnapshot): void {
    const prev = this.#snapshot;
    if (prev.state === next.state && prev.signalOn === next.signalOn && prev.progress === next.progress) {
      return;
    }
    this.#snapshot = next;
    for (const listener of this.#listeners) listener();
  }
}

function nowMs(): number {
  return typeof performance !== "undefined" ? performance.now() : Date.now();
}

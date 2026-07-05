import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { MorseTransport } from "./transport.js";

describe("MorseTransport (visual-only mode)", () => {
  beforeEach(() => {
    vi.useFakeTimers({ toFake: ["setTimeout", "clearTimeout", "performance", "Date"] });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  function makeTransport(morse: string): MorseTransport {
    const transport = new MorseTransport({ audio: false, dotSeconds: 0.1 });
    transport.setMorse(morse);
    return transport;
  }

  it("starts idle and does nothing for an empty morse string", () => {
    const transport = makeTransport("");
    expect(transport.snapshot.state).toBe("idle");
    transport.play();
    expect(transport.snapshot.state).toBe("idle");
  });

  it("turns the signal on during a pulse and off in a gap", () => {
    // ".-" with dot=0.1 → on [0,0.1), off [0.1,0.2), on [0.2,0.5)
    const transport = makeTransport(".-");
    transport.play();
    expect(transport.snapshot.state).toBe("playing");

    vi.advanceTimersByTime(50);
    expect(transport.snapshot.signalOn).toBe(true);

    vi.advanceTimersByTime(100); // t=0.15, in the symbol gap
    expect(transport.snapshot.signalOn).toBe(false);

    vi.advanceTimersByTime(150); // t=0.30, inside the dash
    expect(transport.snapshot.signalOn).toBe(true);
  });

  it("returns to idle automatically when playback ends", () => {
    const transport = makeTransport("."); // 0.1s total
    transport.play();
    vi.advanceTimersByTime(500);
    expect(transport.snapshot.state).toBe("idle");
    expect(transport.snapshot.signalOn).toBe(false);
    expect(transport.snapshot.progress).toBe(0);
  });

  it("pauses and resumes without losing its position", () => {
    const transport = makeTransport(".-"); // 0.5s total
    transport.play();
    vi.advanceTimersByTime(50);
    transport.pause();
    expect(transport.snapshot.state).toBe("paused");

    const pausedProgress = transport.snapshot.progress;
    vi.advanceTimersByTime(1000); // time passes while paused
    expect(transport.snapshot.progress).toBe(pausedProgress);
    expect(transport.snapshot.state).toBe("paused");

    transport.resume();
    vi.advanceTimersByTime(200); // t≈0.25 into the schedule → inside the dash
    expect(transport.snapshot.state).toBe("playing");
    expect(transport.snapshot.signalOn).toBe(true);
  });

  it("stop() resets to idle immediately", () => {
    const transport = makeTransport(".-");
    transport.play();
    vi.advanceTimersByTime(50);
    transport.stop();
    expect(transport.snapshot).toEqual({ state: "idle", signalOn: false, progress: 0 });
  });

  it("notifies subscribers on change and stops notifying after unsubscribe", () => {
    const transport = makeTransport(".-");
    const listener = vi.fn();
    const unsubscribe = transport.subscribe(listener);

    transport.play();
    expect(listener).toHaveBeenCalled();

    listener.mockClear();
    unsubscribe();
    transport.stop();
    expect(listener).not.toHaveBeenCalled();
  });
});

describe("MorseTransport (audio mode)", () => {
  class FakeAudioParam {
    events: Array<{ value: number; time: number }> = [];
    value = 0;
    setValueAtTime(value: number, time: number): void {
      this.events.push({ value, time });
    }
  }

  class FakeNode {
    connected: unknown[] = [];
    connect(target: unknown): void {
      this.connected.push(target);
    }
    disconnect(): void {
      this.connected = [];
    }
  }

  class FakeOscillator extends FakeNode {
    type = "sine";
    frequency = new FakeAudioParam();
    startedAt: number | null = null;
    stoppedAt: number | null = null;
    start(when: number): void {
      this.startedAt = when;
    }
    stop(when = 0): void {
      this.stoppedAt = when;
    }
  }

  class FakeGain extends FakeNode {
    gain = new FakeAudioParam();
  }

  class FakeAudioContext {
    static instances: FakeAudioContext[] = [];
    currentTime = 0;
    state = "running";
    destination = {};
    oscillators: FakeOscillator[] = [];
    gains: FakeGain[] = [];

    constructor() {
      FakeAudioContext.instances.push(this);
    }
    createOscillator(): FakeOscillator {
      const oscillator = new FakeOscillator();
      this.oscillators.push(oscillator);
      return oscillator;
    }
    createGain(): FakeGain {
      const gain = new FakeGain();
      this.gains.push(gain);
      return gain;
    }
    resume(): Promise<void> {
      this.state = "running";
      return Promise.resolve();
    }
    suspend(): Promise<void> {
      this.state = "suspended";
      return Promise.resolve();
    }
    close(): Promise<void> {
      this.state = "closed";
      return Promise.resolve();
    }
  }

  beforeEach(() => {
    FakeAudioContext.instances = [];
    vi.stubGlobal("AudioContext", FakeAudioContext);
    vi.useFakeTimers({ toFake: ["setTimeout", "clearTimeout", "performance", "Date"] });
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  it("schedules gain automation matching the pulse schedule", () => {
    const transport = new MorseTransport({ audio: true, dotSeconds: 0.1 });
    transport.setMorse(".-"); // pulses at 0 (0.1s) and 0.2 (0.3s)
    transport.play();

    const context = FakeAudioContext.instances[0]!;
    const gain = context.gains[0]!;
    const oscillator = context.oscillators[0]!;

    // initial zero + 2 events per pulse
    expect(gain.gain.events).toHaveLength(1 + 4);
    const [, on1, off1, on2, off2] = gain.gain.events;
    expect(off1!.time - on1!.time).toBeCloseTo(0.1);
    expect(off2!.time - on2!.time).toBeCloseTo(0.3);
    expect(on2!.time - on1!.time).toBeCloseTo(0.2);

    expect(oscillator.startedAt).not.toBeNull();
    expect(oscillator.frequency.value).toBe(750);
    expect(oscillator.connected).toContain(gain);
    expect(gain.connected).toContain(context.destination);
  });

  it("reuses one AudioContext across plays and closes it on dispose", () => {
    const transport = new MorseTransport({ audio: true, dotSeconds: 0.1 });
    transport.setMorse(".");
    transport.play();
    transport.stop();
    transport.play();
    transport.stop();
    expect(FakeAudioContext.instances).toHaveLength(1);

    transport.dispose();
    expect(FakeAudioContext.instances[0]!.state).toBe("closed");
  });

  it("suspends the context on pause and resumes on resume", () => {
    const transport = new MorseTransport({ audio: true, dotSeconds: 0.1 });
    transport.setMorse(".-");
    transport.play();
    const context = FakeAudioContext.instances[0]!;

    transport.pause();
    expect(context.state).toBe("suspended");
    expect(transport.snapshot.state).toBe("paused");

    transport.resume();
    expect(context.state).toBe("running");
    expect(transport.snapshot.state).toBe("playing");
  });

  it("honors configured tone options on the next play", () => {
    const transport = new MorseTransport({ audio: true });
    transport.setMorse(".");
    transport.configure({ oscillatorType: "square", frequencyHz: 440 });
    transport.play();

    const oscillator = FakeAudioContext.instances[0]!.oscillators[0]!;
    expect(oscillator.type).toBe("square");
    expect(oscillator.frequency.value).toBe(440);
  });
});

import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useMorsePlayer } from "./useMorsePlayer.js";

describe("useMorsePlayer (visual-only)", () => {
  beforeEach(() => {
    vi.useFakeTimers({ toFake: ["setTimeout", "clearTimeout", "performance", "Date"] });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("starts idle", () => {
    const { result } = renderHook(() => useMorsePlayer("... --- ...", { audio: false }));
    expect(result.current.isPlaying).toBe(false);
    expect(result.current.isPaused).toBe(false);
    expect(result.current.signalOn).toBe(false);
  });

  it("plays, signals, and returns to idle at the end", () => {
    const { result } = renderHook(() =>
      useMorsePlayer(".-", { audio: false, dotSeconds: 0.1 }),
    );

    act(() => result.current.play());
    expect(result.current.isPlaying).toBe(true);

    act(() => vi.advanceTimersByTime(50));
    expect(result.current.signalOn).toBe(true);
    expect(result.current.progress).toBeGreaterThan(0);

    act(() => vi.advanceTimersByTime(1000));
    expect(result.current.isPlaying).toBe(false);
    expect(result.current.signalOn).toBe(false);
  });

  it("pause and resume round-trip", () => {
    const { result } = renderHook(() =>
      useMorsePlayer(".-", { audio: false, dotSeconds: 0.1 }),
    );

    act(() => result.current.play());
    act(() => vi.advanceTimersByTime(50));
    act(() => result.current.pause());
    expect(result.current.isPaused).toBe(true);

    act(() => result.current.resume());
    expect(result.current.isPlaying).toBe(true);

    act(() => result.current.stop());
    expect(result.current.isPlaying).toBe(false);
  });

  it("plays the latest morse string after a prop change", () => {
    const { result, rerender } = renderHook(
      ({ morse }) => useMorsePlayer(morse, { audio: false, dotSeconds: 0.1 }),
      { initialProps: { morse: "." } },
    );

    rerender({ morse: "-" });
    act(() => result.current.play());
    // "-" lasts 0.3s; at 0.2s a lone "." would already have ended
    act(() => vi.advanceTimersByTime(200));
    expect(result.current.isPlaying).toBe(true);
    expect(result.current.signalOn).toBe(true);
  });
});

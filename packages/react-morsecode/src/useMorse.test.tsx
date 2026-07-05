import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { useMorse } from "./useMorse.js";

describe("useMorse", () => {
  it("translates the initial text", () => {
    const { result } = renderHook(() => useMorse("SOS"));
    expect(result.current.morse).toBe("... --- ...");
    expect(result.current.message).toBe("SOS");
  });

  it("retranslates when the text changes", () => {
    const { result } = renderHook(() => useMorse("E"));
    act(() => result.current.setText("T"));
    expect(result.current.morse).toBe("-");
  });

  it("applies abbreviations when enabled", () => {
    const { result } = renderHook(() => useMorse("HELP", { abbreviate: true }));
    expect(result.current.message).toBe("SOS");
    expect(result.current.morse).toBe("... --- ...");
  });

  it("reacts to the abbreviate flag changing", () => {
    const { result, rerender } = renderHook(
      ({ abbreviate }) => useMorse("HELP", { abbreviate }),
      { initialProps: { abbreviate: false } },
    );
    expect(result.current.message).toBe("HELP");

    rerender({ abbreviate: true });
    expect(result.current.message).toBe("SOS");
  });
});

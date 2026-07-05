import { describe, expect, it } from "vitest";
import { applyAbbreviations } from "./abbreviations.js";

describe("applyAbbreviations", () => {
  it("replaces a known phrase", () => {
    expect(applyAbbreviations("HELP")).toBe("SOS");
    expect(applyAbbreviations("THIS IS ME")).toBe("DE ME");
  });

  it("is case-insensitive and uppercases the result", () => {
    expect(applyAbbreviations("help me")).toBe("SOS ME");
  });

  it("only matches whole words — HELPFUL stays intact", () => {
    expect(applyAbbreviations("HELPFUL")).toBe("HELPFUL");
    expect(applyAbbreviations("REPORTS")).toBe("REPORTS");
  });

  it("replaces every occurrence, not just the first", () => {
    expect(applyAbbreviations("HELP HELP HELP")).toBe("SOS SOS SOS");
  });

  it("prefers the longest matching phrase", () => {
    expect(applyAbbreviations("I REPEAT AS FOLLOWS")).toBe("RPT");
    expect(applyAbbreviations("REPEAT PLEASE")).toBe("RPT");
  });

  it("handles multiple different phrases in one message", () => {
    expect(applyAbbreviations("THIS IS BOB FROM OHIO")).toBe("DE BOB FM OHIO");
  });
});

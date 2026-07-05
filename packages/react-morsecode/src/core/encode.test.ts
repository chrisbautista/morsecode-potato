import { describe, expect, it } from "vitest";
import { CHAR_TO_MORSE } from "./alphabet.js";
import { encode } from "./encode.js";

describe("CHAR_TO_MORSE", () => {
  it("uses the ITU-R M.1677-1 codes (spot checks, incl. previously wrong punctuation)", () => {
    expect(CHAR_TO_MORSE["A"]).toBe(".-");
    expect(CHAR_TO_MORSE["E"]).toBe(".");
    expect(CHAR_TO_MORSE["0"]).toBe("-----");
    expect(CHAR_TO_MORSE["9"]).toBe("----.");
    expect(CHAR_TO_MORSE["."]).toBe(".-.-.-");
    expect(CHAR_TO_MORSE[","]).toBe("--..--");
    expect(CHAR_TO_MORSE["?"]).toBe("..--..");
    expect(CHAR_TO_MORSE[":"]).toBe("---...");
    expect(CHAR_TO_MORSE["/"]).toBe("-..-.");
    expect(CHAR_TO_MORSE["("]).toBe("-.--.");
    expect(CHAR_TO_MORSE[")"]).toBe("-.--.-");
  });

  it("has no internal spaces in any code", () => {
    for (const [char, code] of Object.entries(CHAR_TO_MORSE)) {
      expect(code, `code for ${char}`).toMatch(/^[.-]+$/);
    }
  });
});

describe("encode", () => {
  it("encodes letters separated by spaces", () => {
    expect(encode("SOS")).toBe("... --- ...");
  });

  it("separates words with ' / '", () => {
    expect(encode("HI YOU")).toBe(".... .. / -.-- --- ..-");
  });

  it("is case-insensitive", () => {
    expect(encode("sos")).toBe(encode("SOS"));
  });

  it("drops characters with no morse representation", () => {
    expect(encode("A#B")).toBe(".- -...");
  });

  it("trims and collapses whitespace", () => {
    expect(encode("  HI   YOU  ")).toBe(encode("HI YOU"));
  });

  it("returns an empty string for empty or blank input", () => {
    expect(encode("")).toBe("");
    expect(encode("   ")).toBe("");
  });

  it("applies abbreviations when asked", () => {
    expect(encode("HELP", { abbreviate: true })).toBe(encode("SOS"));
    expect(encode("HELP", { abbreviate: false })).toBe(encode("HELP"));
  });
});

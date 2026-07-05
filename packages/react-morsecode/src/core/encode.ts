import { CHAR_TO_MORSE } from "./alphabet.js";
import { applyAbbreviations } from "./abbreviations.js";

export interface EncodeOptions {
  /** Replace known phrases (e.g. HELP) with their abbreviations (SOS) before encoding. */
  abbreviate?: boolean;
}

/**
 * Encode text as international morse code.
 * Letters are separated by single spaces, words by " / ".
 * Characters with no morse representation are dropped. Case-insensitive.
 */
export function encode(text: string, options: EncodeOptions = {}): string {
  const source = options.abbreviate ? applyAbbreviations(text) : text;
  return source
    .trim()
    .toUpperCase()
    .split(/\s+/)
    .map(encodeWord)
    .filter((word) => word.length > 0)
    .join(" / ");
}

function encodeWord(word: string): string {
  return [...word]
    .map((char) => CHAR_TO_MORSE[char] ?? "")
    .filter((code) => code.length > 0)
    .join(" ");
}

import { useMemo, useState } from "react";
import { applyAbbreviations } from "./core/abbreviations.js";
import { encode } from "./core/encode.js";

export interface UseMorseOptions {
  /** Replace known phrases (e.g. HELP) with their abbreviations (SOS). */
  abbreviate?: boolean;
}

export interface UseMorseResult {
  /** The raw input text. */
  text: string;
  setText: (text: string) => void;
  /** The text after abbreviation substitution (equal to `text` when abbreviate is off). */
  message: string;
  /** The message encoded as morse code. */
  morse: string;
}

/** Translate text to morse code, optionally substituting common phrase abbreviations. */
export function useMorse(initialText = "", options: UseMorseOptions = {}): UseMorseResult {
  const { abbreviate = false } = options;
  const [text, setText] = useState(initialText);

  const message = useMemo(() => (abbreviate ? applyAbbreviations(text) : text), [text, abbreviate]);
  const morse = useMemo(() => encode(message), [message]);

  return { text, setText, message, morse };
}

export interface Pulse {
  /** Seconds from playback start when the tone turns on. */
  start: number;
  /** Tone duration in seconds. */
  duration: number;
}

export interface SignalSchedule {
  pulses: Pulse[];
  /** Total playback duration in seconds. */
  duration: number;
}

/**
 * Convert a morse string ("... --- ... / .-") into timed tone pulses.
 * Standard timing: dash = 3 dots, gap between symbols = 1 dot,
 * between letters = 3 dots, between words = 7 dots.
 */
export function buildSchedule(morse: string, options: { dotSeconds?: number } = {}): SignalSchedule {
  const dot = options.dotSeconds ?? 0.08;
  const pulses: Pulse[] = [];
  let t = 0;

  const words = morse
    .split("/")
    .map((word) => word.trim())
    .filter((word) => word.length > 0);

  words.forEach((word, wordIndex) => {
    if (wordIndex > 0) t += 7 * dot;

    const letters = word.split(/\s+/).filter((letter) => letter.length > 0);
    letters.forEach((letter, letterIndex) => {
      if (letterIndex > 0) t += 3 * dot;

      const symbols = [...letter].filter((symbol) => symbol === "." || symbol === "-");
      symbols.forEach((symbol, symbolIndex) => {
        if (symbolIndex > 0) t += dot;
        const duration = symbol === "-" ? 3 * dot : dot;
        pulses.push({ start: t, duration });
        t += duration;
      });
    });
  });

  return { pulses, duration: t };
}

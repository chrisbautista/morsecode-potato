/** Common phrase → morse abbreviation substitutions. */
export const ABBREVIATIONS: Readonly<Record<string, string>> = {
  HELP: "SOS",
  "I SAY AGAIN": "II",
  CONFIRM: "CFM",
  REPORT: "RPT",
  "REPEAT PLEASE": "RPT",
  "I REPEAT AS FOLLOWS": "RPT",
  "YES; CORRECT": "C",
  FROM: "FM",
  "THIS IS": "DE",
  DISTANCE: "DX",
  "INVITATION TO TRANSMIT": "K",
};

function escapeRegExp(text: string): string {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// Longest phrase first so e.g. "REPEAT PLEASE" wins over any shorter overlap.
const MATCHERS = Object.keys(ABBREVIATIONS)
  .sort((a, b) => b.length - a.length)
  .map((phrase) => ({
    replacement: ABBREVIATIONS[phrase] as string,
    // Word-boundary guards: "HELPFUL" must not become "SOSFUL".
    pattern: new RegExp(`(?<![A-Z0-9])${escapeRegExp(phrase)}(?![A-Z0-9])`, "g"),
  }));

/**
 * Replace known phrases with their morse abbreviations.
 * Matching is case-insensitive, whole-word only, and replaces every occurrence.
 * The result is uppercased.
 */
export function applyAbbreviations(text: string): string {
  let result = text.toUpperCase();
  for (const { pattern, replacement } of MATCHERS) {
    result = result.replace(pattern, replacement);
  }
  return result;
}

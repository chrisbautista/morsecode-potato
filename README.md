# morsecode-potato

Morse code translation, audio/visual playback, and file export for React — a framework-free
core wrapped in hooks, published as [`@codespud/react-morsecode`](packages/react-morsecode),
with a demo app deployed to [GitHub Pages](https://chrisbautista.github.io/morsecode-potato).

## Repo layout

- `packages/react-morsecode` — the published package (`@codespud/react-morsecode`, ESM-only, TypeScript).
- `apps/demo` — the Vite + React 19 demo site.

## Usage

```tsx
import { useMorse, useMorsePlayer, renderWavBlob, saveBlob, saveText } from "@codespud/react-morsecode";

function Translator() {
  const { message, setText, morse } = useMorse("NOTHING LIKE POTATOES.", { abbreviate: true });
  const { play, pause, resume, stop, isPlaying, signalOn, progress, supportsAudio } =
    useMorsePlayer(morse, { audio: true, frequencyHz: 750, dotSeconds: 0.08 });

  // signalOn drives a blinking light in sync with (or instead of) the audio.
  // Save the signal as a file:
  const downloadWav = () => saveBlob(renderWavBlob(morse), "morsecode.wav");
  const downloadTxt = () => saveText(morse, "morsecode.txt");
  // ...
}
```

### `useMorse(initialText, { abbreviate })`

Translates text to international morse (ITU-R M.1677-1). Returns:

- `text` / `setText` — the raw input.
- `message` — the input after abbreviation substitution (whole-word, e.g. `HELP` → `SOS`).
- `morse` — the encoded message; letters separated by spaces, words by ` / `.

### `useMorsePlayer(morse, options)`

Plays a morse string as audio, as a silent visual signal, or both in sync — one clock drives
everything, so sound and light can't drift.

Options: `audio` (default `true`; set `false` for visual-only playback), `oscillatorType`
(`"sine"` default), `frequencyHz` (750), `dotSeconds` (0.08 ≈ 15 wpm, `T = 1.2s / wpm`).

Returns `play`, `pause`, `resume`, `stop`, `isPlaying`, `isPaused`, `signalOn`, `progress`
(0..1), and `supportsAudio`. Playback ends on its own when the message finishes.

### Core (no React required)

`encode`, `applyAbbreviations`, `buildSchedule` (morse → timed pulses), `encodeWav` /
`renderWavBlob` (deterministic 16-bit PCM WAV rendering), `saveBlob` / `saveText`,
`MorseTransport` (the playback engine), plus the `CHAR_TO_MORSE` and `ABBREVIATIONS` tables.

## Development

```sh
npm install
npm test        # unit + hook tests (Vitest)
npm run build   # builds the package, then the demo
npm run dev     # builds the package, then starts the demo dev server
```

The demo deploys to GitHub Pages automatically on push to `master`
(`.github/workflows/deploy.yml`); the package publishes to npm on a GitHub release
(`.github/workflows/publish.yml`, requires an `NPM_TOKEN` repo secret).

## Todo

- visualize message (lights) — ✅ signal light in the demo
- save to file — ✅ `.wav` and `.txt`
- gracefully notify user of demo site browser support

## Contributor

@codespud

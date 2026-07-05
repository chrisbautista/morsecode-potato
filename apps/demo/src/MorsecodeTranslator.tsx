import { useEffect, useMemo, useRef, useState } from "react";
import {
  ABBREVIATIONS,
  buildSchedule,
  isAudioSupported,
  renderWavBlob,
  saveBlob,
  saveText,
  useMorse,
  useMorsePlayer,
} from "@codespud/react-morsecode";

const MAX_CHARACTERS = 250;

function formatClock(seconds: number): string {
  const whole = Math.max(0, Math.round(seconds));
  const minutes = String(Math.floor(whole / 60)).padStart(2, "0");
  return `${minutes}:${String(whole % 60).padStart(2, "0")}`;
}

function PlayIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}

function PauseIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
      <path d="M6 5h4v14H6zM14 5h4v14h-4z" />
    </svg>
  );
}

function StopIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
      <path d="M6 6h12v12H6z" />
    </svg>
  );
}

export default function MorsecodeTranslator() {
  const [abbreviate, setAbbreviate] = useState(false);
  const [soundOn, setSoundOn] = useState(true);
  const [fullVisual, setFullVisual] = useState(false);
  const [copied, setCopied] = useState(false);
  const tapeRef = useRef<HTMLDivElement>(null);

  const { message, setText, morse } = useMorse("NOTHING LIKE POTATOES.", { abbreviate });
  const { play, pause, resume, stop, isPlaying, isPaused, signalOn, progress, supportsAudio } =
    useMorsePlayer(morse, { audio: soundOn && isAudioSupported() });

  const schedule = useMemo(() => buildSchedule(morse), [morse]);
  const isActive = isPlaying || isPaused;
  const elapsed = progress * schedule.duration;

  // Index of the pulse (dot/dash) currently sounding or next up; drives the tape highlight.
  let activeSymbol = -1;
  if (isActive) {
    activeSymbol = schedule.pulses.findIndex((pulse) => elapsed < pulse.start + pulse.duration);
    if (activeSymbol === -1) activeSymbol = schedule.pulses.length;
  }

  const tapeChars = useMemo(() => {
    let symbolIndex = -1;
    return [...morse].map((char, index) => {
      if (char === "." || char === "-") symbolIndex += 1;
      return { char, symbolIndex, key: index };
    });
  }, [morse]);

  useEffect(() => {
    const scroller = tapeRef.current;
    if (!scroller) return;
    if (activeSymbol < 0) {
      scroller.scrollLeft = 0;
      return;
    }
    const active = scroller.querySelector<HTMLElement>('[data-state="active"]');
    if (active) {
      scroller.scrollLeft = active.offsetLeft - scroller.clientWidth / 2;
    }
  }, [activeSymbol]);

  const flashing = fullVisual && isActive;

  useEffect(() => {
    if (!flashing) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setFullVisual(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [flashing]);

  async function copyMorse() {
    try {
      await navigator.clipboard.writeText(morse);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard unavailable — leave the button label unchanged.
    }
  }

  const lampStatus = isPlaying ? "transmitting" : isPaused ? "paused" : "standing by";

  return (
    <div>
      <section className="telegram">
        <div className="form-strip">
          <label htmlFor="mpMessageBox">Message</label>
          <span>
            {message.length} / {MAX_CHARACTERS}
          </span>
        </div>
        <textarea
          id="mpMessageBox"
          maxLength={MAX_CHARACTERS}
          value={message}
          onChange={(event) => setText(event.target.value.toUpperCase())}
        />
        <div className="telegram-footer">
          <button
            type="button"
            className="chip"
            aria-pressed={abbreviate}
            title="Replace known phrases with morse abbreviations (see the operator's card)"
            onClick={() => setAbbreviate(!abbreviate)}
          >
            Abbreviations
          </button>
          {supportsAudio && (
            <button
              type="button"
              className="chip"
              aria-pressed={soundOn}
              title="Play sound during playback"
              onClick={() => setSoundOn(!soundOn)}
            >
              Sound
            </button>
          )}
        </div>
      </section>

      <section className="transport">
        <button
          type="button"
          className="key primary"
          onClick={play}
          disabled={!morse || isActive}
          aria-label="Play"
        >
          <PlayIcon />
        </button>
        <button
          type="button"
          className="key"
          onClick={isPaused ? resume : pause}
          disabled={!isActive}
          aria-label={isPaused ? "Resume" : "Pause"}
        >
          {isPaused ? <PlayIcon /> : <PauseIcon />}
        </button>
        <button type="button" className="key" onClick={stop} disabled={!isActive} aria-label="Stop">
          <StopIcon />
        </button>

        <div className={signalOn ? "lamp on" : "lamp"} role="img" aria-label={`Signal lamp: ${lampStatus}`}>
          <div className="filament" />
        </div>
        <div className="lamp-caption">
          Signal lamp
          <br />
          <strong>{lampStatus}</strong>
        </div>

        <button
          type="button"
          className="chip"
          aria-pressed={fullVisual}
          title="Flash the whole screen instead of the lamp during playback. Caution: rapidly flashing lights."
          onClick={() => setFullVisual(!fullVisual)}
        >
          Full screen
        </button>

        <div className="clock">
          {formatClock(elapsed)} / {formatClock(schedule.duration)}
        </div>
      </section>

      {flashing && (
        <div
          className={signalOn ? "flash-screen on" : "flash-screen"}
          onClick={() => setFullVisual(false)}
        >
          <div className="flash-hud" onClick={(event) => event.stopPropagation()}>
            <button type="button" onClick={isPaused ? resume : pause} aria-label={isPaused ? "Resume" : "Pause"}>
              {isPaused ? <PlayIcon /> : <PauseIcon />}
            </button>
            <button type="button" onClick={stop} aria-label="Stop">
              <StopIcon />
            </button>
            <span className="flash-clock">
              {formatClock(elapsed)} / {formatClock(schedule.duration)}
            </span>
            <span className="flash-hint">esc or click to exit</span>
          </div>
        </div>
      )}

      <section className="tape">
        <div className="tape-head">
          <span className="microlabel">Morse code tape</span>
          <button type="button" className="tape-copy" onClick={copyMorse} disabled={!morse}>
            {copied ? "copied" : "copy"}
          </button>
        </div>
        <div className="tape-holes" aria-hidden="true" />
        <div className="tape-scroll" ref={tapeRef} tabIndex={0} aria-label="Morse code">
          {morse ? (
            tapeChars.map(({ char, symbolIndex, key }) => {
              const isSymbol = char === "." || char === "-";
              const state =
                activeSymbol < 0 || !isSymbol
                  ? "idle"
                  : symbolIndex < activeSymbol
                    ? "played"
                    : symbolIndex === activeSymbol
                      ? "active"
                      : "idle";
              return (
                <span key={key} data-state={state}>
                  {char}
                </span>
              );
            })
          ) : (
            <span className="tape-empty">awaiting message</span>
          )}
        </div>
        <div className="tape-holes" aria-hidden="true" />
      </section>

      <section className="downloads">
        <button type="button" className="chip" disabled={!morse} onClick={() => saveBlob(renderWavBlob(morse), "morsecode.wav")}>
          Save .wav
        </button>
        <button type="button" className="chip" disabled={!morse} onClick={() => saveText(morse, "morsecode.txt")}>
          Save .txt
        </button>
      </section>

      <section className="operator-card">
        <div className="form-strip">
          <span>Operator's card</span>
          <span>abbreviations</span>
        </div>
        <div className="operator-scroll">
          <table>
            <thead>
              <tr>
                <th>Code</th>
                <th>Phrase</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(ABBREVIATIONS).map(([phrase, abbreviation]) => (
                <tr key={phrase}>
                  <td>{abbreviation}</td>
                  <td>{phrase.charAt(0) + phrase.slice(1).toLowerCase()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

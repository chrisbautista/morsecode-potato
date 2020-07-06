const { useState, useRef } = require("react");

// 
// useAudioMorseCodePlayer
// 
// Parameters: 
// - initial, value to start with
// - oscillatorType, (default "sine")
// - frequency, (default "750") - Hz
// - dotTiming, (default "0.08") -- computation T = 1.2s / 15 wpm(words per min)
// > https://en.wikipedia.org/wiki/Morse_code#Representation,_timing,_and_speeds 
//
// Hook variables
// - play, play generated audio
// - stop, stop generated audio
// - suspend, pause generated audio
// - isPlaying, flag when audio is playing
// - isSuspended, flag when paused
// - supportsAudio, this is set to TRUE if browser supports audio
// - setMorsecode, function to set encoded message
//
export default function useAudioMorseCodePlayer(
  initial,
  oscillatorType = "sine",
  frequency = 750, 
  dotTiming = 0.08 
) {
  let [morseCode, setMorsecode] = useState(initial);
  let [isPlaying, setIsPlaying] = useState(false);
  let [isSuspended, setIsSuspended] = useState(false);
  let supportsAudio = window.AudioContext || window.webkitAudioContext;

  let oscillatorRef = useRef();
  let actxRef = useRef();

  function play() {
    if (isPlaying || !actxRef) {
      return;
    }

    actxRef.current = getAudioContext();
    actxRef.current.onstatechange = function () {
      if (actxRef.current.state === "closed") {
        setIsPlaying(false);
        setIsSuspended(false);
      }
    };

    let track = setupAudioTrack(
      actxRef.current,
      morseCode,
      oscillatorType,
      frequency,
      dotTiming
    );

    track.oscillator.connect(track.gainRef);
    track.gainRef.connect(actxRef.current.destination);

    oscillatorRef.current = track.oscillator;

    setIsPlaying(true);
    setIsSuspended(false);
    oscillatorRef.current.start(0);
  }

  function suspend() {
    if (!isPlaying) {
      return;
    }

    if (actxRef.current.state === "running") {
      actxRef.current.suspend().then(function () {
        setIsSuspended(true);
      });
    } else if (actxRef.current.state === "suspended") {
      actxRef.current.resume().then(function () {
        setIsSuspended(false);
      });
    }
  }

  function stop() {
    if (!isPlaying) {
      return;
    }

    actxRef.current.close().then(function () {
      setIsPlaying(false);
    });
  }

  return {
    play,
    stop,
    suspend,
    isPlaying,
    isSuspended,
    supportsAudio,
    setMorsecode,
  };
}

export function getAudioContext() {
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  const actx = new AudioContext();
  return actx;
}

function setupAudioTrack(actx, message, type, frequency, dotTiming) {
  var t = actx.currentTime;

  var oscillator = actx.createOscillator();
  oscillator.type = type;
  oscillator.frequency.value = frequency;

  var gainRef = actx.createGain();
  gainRef.gain.setValueAtTime(0, t);

  message.split("").forEach(function (character) {
    switch (character) {
      case ".":
        gainRef.gain.setValueAtTime(1, t);
        t += dotTiming;
        gainRef.gain.setValueAtTime(0, t);
        t += dotTiming;
        break;
      case "-":
        gainRef.gain.setValueAtTime(1, t);
        t += 3 * dotTiming;
        gainRef.gain.setValueAtTime(0, t);
        t += dotTiming;
        break;
      case "/":
        t += 7 * dotTiming;
        break;
      default:
        break;
    }
  });

  oscillator.connect(gainRef);
  gainRef.connect(actx.destination);

  return { gainRef, oscillator };
}

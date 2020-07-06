// Copyright 2019–2020, Chris Bautista
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
//

import { useState, useEffect } from "react";

//
// ## UseMorsecode Hook
//
// Parameters: 
// - initial , value to start with
// - shouldAbbreviate, flag whether you want hook to abbreviate phrases
//
// Hook variables
// - message, the current message (could be abbreviated)
// - translated, the message in morse code
// - setMessage, function to update the message
//
export default function useMorsecode(initial, shouldReplaceWithAbbrev = true) {
  let [message, setMessage] = useState(initial);
  let [translated, setTranslated] = useState("");

  function cleanMessage(msg) {
    return msg ? msg.trim() : "";
  }

  useEffect(() => {
    let cleanedMessage = cleanMessage(message);

    let tmpMessage = shouldReplaceWithAbbrev
      ? replaceWithAbbrev(cleanedMessage)
      : cleanedMessage;

    if (tmpMessage !== cleanedMessage) {
      setMessage(tmpMessage);
    }

    setTranslated(alphaToMorsecode(tmpMessage));
  }, [message, shouldReplaceWithAbbrev]);

  return {
    message,
    translated,
    setMessage,
  };
}

const MorseCode = {
  ".-": "A",
  "-...": "B",
  "-.-.": "C",
  "-..": "D",
  ".": "E",
  "..-.": "F",
  "--.": "G",
  "....": "H",
  "..": "I",
  ".---": "J",
  "-.-": "K",
  ".-..": "L",
  "--": "M",
  "-.": "N",
  "---": "O",
  ".--.": "P",
  "--.-": "Q",
  ".-.": "R",
  "...": "S",
  "-": "T",
  "..-": "U",
  "...-": "V",
  ".--": "W",
  "-..-": "X",
  "-.--": "Y",
  "--..": "Z",
  "-----": "0",
  ".----": "1",
  "..---": "2",
  "...--": "3",
  "....-": "4",
  ".....": "5",
  "-....": "6",
  "--...": "7",
  "---..": "8",
  "----.": "9",

  /* punctuation marks */

  "..--..": ".",
  "._.--": ",",
  "-.- . .": ":",
  "-..-.": "?",
  "..-. .-..": "'",
  "... .-..": "-",
  "..- -": "/",
  "..... -.": "(",
  "..... .. ..": ")",
  "..-. -.": '"',
  ". ...": "&",
  "---.": "!",
  "... ..": ";",
};

export const MorsecodeAbbrev = {
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

const MorseKeys = Object.values(MorseCode);
const AlphaKeys = Object.keys(MorseCode);
const AbbrevKeys = Object.keys(MorsecodeAbbrev).sort(
  (a, b) => b.length - a.length
);

function getMorseCode(chr) {
  if (chr === " ") return "/";

  let codeKey = MorseKeys.indexOf(chr.toUpperCase());
  if (codeKey === -1 && chr !== " ") {
    return "";
  }

  return AlphaKeys[codeKey];
}

function alphaToMorsecode(msg) {
  if (typeof msg !== "string") {
    return "invalid msg";
  }
  const morse = msg.split("").map(getMorseCode);
  return `${morse.join(" ")}`;
}

function replaceWithAbbrev(text) {
  if (!text || typeof text !== "string") {
    return "";
  }

  let newMessage = text.toUpperCase();
  AbbrevKeys.forEach((key) => {
    let abbrevIndex = newMessage.indexOf(key);
    if (abbrevIndex !== -1) {
      newMessage = newMessage.replace(key, MorsecodeAbbrev[key]);
    }
  });

  return newMessage;
}

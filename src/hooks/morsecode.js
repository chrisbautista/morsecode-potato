/**
 * Taken from https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/International_Morse_Code.svg/315px-International_Morse_Code.svg.png
 */
export const MorseCode = {
  ".-"         : "A",
  "-..."       : "B",
  "-.-."       : "C",
  "-.."        : "D",
  "."          : "E",
  "..-."       : "F",
  "--."        : "G",
  "...."       : "H",
  ".."         : "I",
  ".---"       : "J",
  "-.-"        : "K",
  ".-.."       : "L",
  "--"         : "M",
  "-."         : "N",
  "---"        : "O",
  ".--."       : "P",
  "--.-"       : "Q",
  ".-."        : "R",
  "..."        : "S",
  "-"          : "T",
  "..-"        : "U",
  "...-"       : "V",
  ".--"        : "W",
  "-..-"       : "X",
  "-.--"       : "Y",
  "--.."       : "Z",
  "-----"      : "0",
  ".----"      : "1",
  "..---"      : "2",
  "...--"      : "3",
  "....-"      : "4",
  "....."      : "5",
  "-...."      : "6",
  "--..."      : "7",
  "---.."      : "8",
  "----."      : "9",
  "..--.."     : ".",
  "._.--"      : ",",
  "-.- . ."    : ":",
  "-..-."      : "?",
  "..-. .-.."  : "'",
  "... .-.."   : "-",
  "..- -"      : "/",
  "..... -."   : "(",
  "..... .. ..": ")",
  "..-. -."    : '"',
  ". ..."      : "&",
  "---."       : "!",
  "... .."     : ";",
};

export function alphaToMorsecode(msg) {
  if (typeof msg !== "string") {
    return "invalid msg";
  }
  const morse = msg.split("").map(getMorseCode);
  return morse.join(" ");
}

function getMorseCode(chr) {
    if (chr === " ") return "/";
  
    let codeKey = MorseKeys().indexOf(chr.toUpperCase());
  
    const codeKeyIsEmpty = codeKey === -1 && chr !== " ";
    if (codeKeyIsEmpty) {
      return "";
    }
  
    return AlphaKeys()[codeKey];
}

const AlphaKeys = () => Object.keys(MorseCode);

const MorseKeys = () =>
  AlphaKeys().map(function (alphakey) {
    return MorseCode[alphakey];
  });
  

export const MorsecodeAbbreviation = {
    HELP                    : "SOS",
    "I SAY AGAIN"           : "II",
    CONFIRM                 : "CFM",
    REPORT                  : "RPT",
    "REPEAT PLEASE"         : "RPT",
    "I REPEAT AS FOLLOWS"   : "RPT",
    "YES; CORRECT"          : "C",
    FROM                    : "FM",
    "THIS IS"               : "DE",
    DISTANCE                : "DX",
    "INVITATION TO TRANSMIT": "K",
};

export function replaceWithAbbreviation(text) {
  if (!text || typeof text !== "string") {
    return "";
  }

  let newMessage = text.toUpperCase();

  AbbrevKeys().forEach((key) => {
    let abbrevIndex = newMessage.indexOf(key);
    if (abbrevIndex !== -1) {
      newMessage = newMessage.replace(key, MorsecodeAbbreviation[key]);
    }
  });

  return newMessage;
}

const AbbrevKeys = () =>
  Object.keys(MorsecodeAbbreviation).sort((a, b) => b.length - a.length);

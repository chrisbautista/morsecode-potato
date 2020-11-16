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
import * as Morse from "./morsecode.js";

export default function useMorsecode(initial, shouldReplaceWithAbbreviation = true) {
  let [message, setMessage] = useState(initial);
  let [translated, setTranslated] = useState("");

  useEffect(translateMessage, [message, shouldReplaceWithAbbreviation]);

  function translateMessage() {
    let cleanedMessage = cleanMessage(message);

    let tmpMessage = shouldReplaceWithAbbreviation
      ? Morse.replaceWithAbbreviation(cleanedMessage)
      : cleanedMessage;

    const messageHasChanged = cleanedMessage !== tmpMessage; 
    if(messageHasChanged){
      setMessage(tmpMessage);
    }
  
    setTranslated(Morse.alphaToMorsecode(tmpMessage));
  }

  return {
    message,
    translated,
    setMessage,
  };
}

function cleanMessage(msg) {
  return msg ? msg.trim() : "";
}

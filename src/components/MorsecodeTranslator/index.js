import React, { useState, useEffect } from "react";
import styled from "styled-components";
import useMorsecode, { MorsecodeAbbrev } from "../../hooks/useMorsecode";
import useAudioMorsecodePlayer from "../../hooks/useAudioMorsecodePlayer";

const MAXCHARACTERS = 250;

const InputTextArea = styled.textarea`
  border: 1px solid #ddd;
  padding: 1rem;
  width: 100%;
  margin: 8px 0 0;
  border-radius: 3px;
  height: 120px;
  font-family: "Courier New", monospace;
`;

const Input = styled(InputTextArea)`
  border: 1px solid red;
  font-size: 1rem;
`;

const MorsecodeBox = styled(InputTextArea)`
  border: 1px solid #ddd;
  font-weight: bold;
  line-height: 1.8;
  background-color: #ededed;
  font-size: 0.75rem;
`;

const LabelSpan = styled.span`
  display: inline-block;
  padding: 0 8px;
  font-size: 0.875rem;
`;

const MorseCodeLabel = styled.label`
  margin-top: 1.2rem;
  display: block;
`;

const AbbrevTableWrapper = styled.div`
  font-size: 0.75rem;
  margin-top: 2rem;
  width: auto;
  height: 200px;
  overflow-y: auto;
  border: 1px solid #ddd;
  display: inline-block;
  padding: 5px 8px;
`;

const AbbrevTable = styled.table`
  th {
    background-color: #ddd;
  }
  td,
  th {
    text-align: left;
    border: 1px solid #ddd;
    padding: 4px;
  }
`;

const AudioPlayer = styled.div`
margin-top: 1rem;
margin-left: -5px;
  button {
    min-width: 40px;
    height: 40px;
    margin: 0 3px;
    font-weight: 800;
  }
`;

const labels = {
  messageLabel: "Message",
  morsecodeLabel: "Morse code",
  sampleMessage: "Nothing like potatoes.",
  replaceWithAbbrev: "Replace with abbreviations.(see list at the bottom)",
  phrase: "Phrase",
  abbreviation: "Abbreviation",
  playAudio: "Play audio",
  stopAudio: "Stop audio",
  pauseResumeAudio: "Pause/Resume",
};

const MorsecodeTranslator = () => {
  let [isReplacedAbbrev, setReplacedAbbrev] = useState(false);
  let { message, translated, setMessage } = useMorsecode(
    labels.sampleMessage.toUpperCase(),
    isReplacedAbbrev
  );
  let {
    play,
    stop,
    suspend,
    setMorsecode,
    isPlaying,
    isSuspended,
    supportsAudio,
  } = useAudioMorsecodePlayer(message);

  function onReplaceAbbrev(e) {
    setReplacedAbbrev(e.target.checked);
  }

  function updateMessage(text) {
    let newText = text;
    if(text.length > MAXCHARACTERS){
      newText = newText.substring(0, MAXCHARACTERS);
    }
    setMessage(newText);
  }

  useEffect(() => {
    setMorsecode(translated);
  }, [translated, setMorsecode]);

  function renderAbbrev() {
    const abbrevList = Object.keys(MorsecodeAbbrev).map((key) => {
      let title = key.toLowerCase();
      title = title.charAt(0).toUpperCase() + title.slice(1);
      return (
        <tr key={"abbrev" + key}>
          <td>{MorsecodeAbbrev[key]}</td>
          <td>{title}</td>
        </tr>
      );
    });

    return (
      <AbbrevTableWrapper>
        <AbbrevTable>
          <thead>
            <tr>
              <th>{labels.abbreviation}</th>
              <th>{labels.phrase}</th>
            </tr>
          </thead>
          <tbody>{abbrevList}</tbody>
        </AbbrevTable>
      </AbbrevTableWrapper>
    );
  }

  return (
    <div>
      <label htmlFor="mpMessageBox">{labels.messageLabel}</label>
      <Input
        id="mpMessageBox"
        value={message}
        onChange={(e) => updateMessage(e.target.value.toUpperCase())}
      />
      <div>
        <label>
          <input
            type="checkbox"
            value={1}
            checked={isReplacedAbbrev}
            onChange={onReplaceAbbrev}
          />
          <LabelSpan>{labels.replaceWithAbbrev}</LabelSpan>
        </label>
      </div>
      {supportsAudio && (
        <AudioPlayer>
          <button
            onClick={play}
            className="play"
            disabled={!message || isPlaying}
            aria-label={labels.playAudio}
          >
            {"[>"}
          </button>
          <button
            onClick={suspend}
            className="suspend"
            disabled={!message || (!isPlaying && !isSuspended)}
            aria-label={labels.pauseResumeAudio}
          >
            {isSuspended ? "[>>" : "||"}
          </button>
          <button
            onClick={stop}
            className="stop"
            disabled={!message || !isPlaying}
            aria-label={labels.stopAudio}
          >
            {"[]"}
          </button>
        </AudioPlayer>
      )}
      <MorseCodeLabel htmlFor="mpMorsecodeBox">
        {labels.morsecodeLabel}
      </MorseCodeLabel>
      <MorsecodeBox id="mpMorsecodeBox" value={translated} readOnly />
      <div>{renderAbbrev()}</div>
    </div>
  );
};

export default MorsecodeTranslator;

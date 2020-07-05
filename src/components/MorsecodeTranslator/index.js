import React, { useState } from "react";
import styled from "styled-components";
import useMorsecode, { MorsecodeAbbrev } from "../../hooks/useMorsecode";

const InputTextArea = styled.textarea`
  border: 1px solid #ddd;
  padding: 1rem;
  width: 100%;
  margin: 8px 0 0;
  border-radius: 3px;
  height: 160px;
`;

const Input = styled(InputTextArea)`
  border: 1px solid red;
`;

const MorsecodeBox = styled(InputTextArea)`
  border: 1px solid #ddd;
  font-weight: bolder;
  background-color: #ededed;
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

const labels = {
  messageLabel: "Message",
  morsecodeLabel: "Morse code",
  sampleMessage: "Nothing like potatoes.",
  replaceWithAbbrev: "Replace with abbreviations.(see list at the bottom)",
  phrase: "Phrase",
  abbreviation: "Abbreviation",
};

const MorsecodeTranslator = () => {
  let [isReplacedAbbrev, setReplacedAbbrev] = useState(false);
  let { message, translated, setMessage } = useMorsecode(
    labels.sampleMessage,
    isReplacedAbbrev
  );
  function onReplaceAbbrev(e) {
    setReplacedAbbrev(e.target.checked);
  }

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
        onChange={(e) => setMessage(e.target.value)}
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
      <MorseCodeLabel htmlFor="mpMorsecodeBox">
        {labels.morsecodeLabel}
      </MorseCodeLabel>
      <MorsecodeBox id="mpMorsecodeBox" value={translated} readOnly />
      <div>{renderAbbrev()}</div>
    </div>
  );
};

export default MorsecodeTranslator;

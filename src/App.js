import React from "react";
import "./App.css";
import styled from "styled-components";
import MorsecodeTranslator from "./components/MorsecodeTranslator";

const AppContainer = styled.div`
  padding: 4rem;
  margin: 0 auto;
  max-width: 1200px;
  @media screen and (max-width: 840px) {
    padding: 1rem;
  }
`;

const GithubAnchor = styled.a`
  display: inline-block;
  position: absolute;
  top: 0;
  right: 0;
  padding: 1rem;
  background-color: yellow;
  border: 1px solid #ddd;
  box-shadow: 0 1px 5px 0 rgba(0, 0, 0, 0.3);

  @media screen and (max-width: 840px) {
    width: 80px;
    font-size: 0.75rem;
    padding: 5px;
    text-align: right;
    transform: rotate(45deg);
    top: 25px;
  }
`;

function GitHub() {
  return (
    <GithubAnchor href="https://github.com/chrisbautista/morsecode-potato">
      codespud @ github
    </GithubAnchor>
  );
}

function App() {
  return (
    <AppContainer>
      <h1>Morsecode-Potato</h1>
      <MorsecodeTranslator />
      <GitHub />
    </AppContainer>
  );
}

export default App;

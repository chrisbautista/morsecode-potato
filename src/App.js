import React from "react";
import "./App.css";
import styled from "styled-components";
import MorsecodeTranslator from "./components/MorsecodeTranslator";

const AppContainer = styled.div`
  padding: 1rem 2rem;
  margin: 0 auto;
  max-width: 800px;
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
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.2);

  @media screen and (max-width: 840px) {
    width: 20px;
    font-size: 0.75rem;
    line-height: 1.5;
    padding: 5px;
    text-decoration: none;
    text-align: right;
    writing-mode: vertical-rl;
    text-orientation: upright;
    top: 0;
    span {
      display:none;
    }
  }
`;

function GitHub() {
  return (
    <GithubAnchor href="https://github.com/chrisbautista/morsecode-potato">
      <span>codespud @ </span>github
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

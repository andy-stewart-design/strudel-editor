// https://framagit.org/roipoussiere/strudel-vscode <- strudel vscode extension with syntax highlighting
// https://www.checklyhq.com/blog/customizing-monaco/ <- adding custom languages to monaco

import tsWorker from "monaco-editor/esm/vs/language/typescript/ts.worker?worker";
import * as monaco from "monaco-editor";
import theme from "./theme.ts";
// @ts-expect-error need to add strudel declaration file
import { prebake } from "./strudel.js";
import defaultBop from "./boots-and-cats.ts";
import "./style.css";

const strudel = await prebake();

self.MonacoEnvironment = {
  getWorker() {
    return new tsWorker();
  },
};

monaco.editor.defineTheme("NightOwl", theme);

const editor = monaco.editor.create(document.getElementById("app")!, {
  value: defaultBop,
  language: "typescript",
  theme: "NightOwl",
  minimap: {
    enabled: false,
  },
  autoClosingQuotes: "always",
  autoClosingBrackets: "always",
  renderValidationDecorations: "off",
  parameterHints: {
    enabled: false,
  },
  quickSuggestions: false,
  hover: {
    enabled: false,
  },
  fontSize: 14,
  automaticLayout: true,
});

let playing = false;

const playButton = document.querySelector("#play");
const pauseButton = document.querySelector("#pause");

function handlePlay() {
  if (playButton && !playing) playButton.ariaLabel = "update";
  strudel.evaluate(editor.getValue());
  playing = true;
}

function handlePause() {
  strudel.stop();
  playing = false;
  if (playButton) playButton.ariaLabel = "play";
}

playButton?.addEventListener("click", handlePlay);

pauseButton?.addEventListener("click", handlePause);

window.addEventListener("keydown", (e) => {
  if (e.altKey && e.key === "Enter") {
    e.preventDefault();
    handlePlay();
  } else if (e.key === "≥" && e.altKey) {
    e.preventDefault();
    handlePause();
  }
});

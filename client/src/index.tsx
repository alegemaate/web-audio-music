import React from "react";
import ReactDOM from "react-dom";
import { CssBaseline } from "@material-ui/core";

import "fontsource-roboto";
import "./libs/fulltilt";

import App from "./App";

window.AudioContext = window.AudioContext || (window as any).webkitAudioContext;

ReactDOM.render(
  <React.StrictMode>
    <CssBaseline />
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);

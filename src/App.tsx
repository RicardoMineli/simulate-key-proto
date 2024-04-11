import { useState } from "react";
import reactLogo from "./assets/react.svg";
import { invoke } from "@tauri-apps/api/core";
import "./App.css";

function App() {
  return (
    <div className="flex-column">
      <h1>Welcome to Tauri!</h1>

      <div className="flex">
        <div>
          <button
            className="shortcutButton"
            onClick={() => invoke("use_shortcut", { input: "ctrl+v" })}
          >
            Click Here
          </button>
        </div>
        <div>
          <button
            className="shortcutButton"
            onClick={() => invoke("use_shortcut", { input: "ctrl+v" })}
          >
            Click Here
          </button>
        </div>
        <div>
          <button
            className="shortcutButton"
            onClick={() => invoke("use_shortcut", { input: "ctrl+v" })}
          >
            Click Here
          </button>
        </div>
      </div>

      <p>Click on the Tauri, Vite, and React logos to learn more.</p>
    </div>
  );
}

export default App;

import { useEffect, useCallback, useState } from "react";
import reactLogo from "./assets/react.svg";
import { invoke } from "@tauri-apps/api/core";
import "./App.css";

import { Store } from "@tauri-apps/plugin-store";

function App() {
  const [inputs, setInputs] = useState<string[]>([
    "ctrl+c",
    "ctrl+v",
    "ctrl+k+ctrl+c",
    "ctrl+v",
    "ctrl+v",
    "ctrl+v",
  ]);
  const [show_and_hide_global_shortcut, setShow_and_hide_global_shortcut] =
    useState<string>();

  const setupStore = useCallback(async () => {
    const store = new Store("user_config.json");
    const val = await store.get<string>("show_and_hide_global_shortcut");
    const val2 = await store.get<string[]>("shortcuts");
    if (val) {
      setShow_and_hide_global_shortcut(val);
    } else {
      console.log("show_and_hide_global_shortcut / val is null");
    }
    if (val2) {
      setInputs(val2);
    } else {
      console.log("shortcuts / val2 is null");
    }
  }, []);

  useEffect(() => {
    setupStore().catch(console.error);
  }, [setupStore]);

  const listInputs = inputs.map((input) => (
    <button
      className="shortcutButton"
      onClick={() => invoke("use_shortcut", { input: input })}
    >
      {input}
    </button>
  ));

  return (
    <div className="flex-column">
      <h1>Welcome to Tauri!</h1>
      {show_and_hide_global_shortcut}

      <div className="flex"> {listInputs}</div>

      <p>Click on the Tauri, Vite, and React logos to learn more.</p>
    </div>
  );
}

export default App;

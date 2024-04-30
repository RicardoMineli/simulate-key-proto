import { useEffect, useCallback, useState } from "react";
import reactLogo from "./assets/react.svg";
import { invoke } from "@tauri-apps/api/core";
import "./App.css";

import { register, unregister } from "@tauri-apps/plugin-global-shortcut";
import { Store } from "@tauri-apps/plugin-store";

function App() {
  const [inputs, setInputs] = useState<string[]>([]);
  const [show_and_hide_global_shortcut, setShow_and_hide_global_shortcut] =
    useState<string>();

  const [currentInputs, setCurrentInputs] = useState<string[]>([]);
  const [
    current_show_and_hide_global_shortcut,
    setCurrent_Show_and_hide_global_shortcut,
  ] = useState<string>();

  const [editMode, setEditMode] = useState<boolean>(false);
  const [userConfigStore, setUserConfigStore] = useState<Store>();

  useEffect(() => {
    const setupStore = async () => {
      const store = new Store("user_config.json");
      setUserConfigStore(store);
      const val = await store.get<string>("show_and_hide_global_shortcut");
      const val2 = await store.get<string[]>("shortcuts");
      if (val) {
        setShow_and_hide_global_shortcut(val);
        setCurrent_Show_and_hide_global_shortcut(val);
      } else {
        console.log("show_and_hide_global_shortcut / val is null");
      }
      if (val2) {
        setInputs(val2);
        setCurrentInputs(val2);
      } else {
        console.log("shortcuts / val2 is null");
      }
    };

    setupStore().catch(console.error);
  }, []);

  const listInputs = inputs.map((input) => (
    <button
      className="shortcutButton"
      onClick={() => invoke("use_shortcut", { input: input })}
    >
      {input}
    </button>
  ));

  const editModeWarning = (
    <h1 style={{ border: "solid green", padding: 10, lineHeight: "100%" }}>
      You are editing shortcuts now! <br /> Confirm on the button to the right{" "}
      <br /> →
    </h1>
  );

  return (
    <div className="flex-column">
      <h1>Welcome to Tauri!</h1>
      {editMode && editModeWarning}
      {show_and_hide_global_shortcut}

      <div className="flex"> {listInputs}</div>

      <p>Click on the Tauri, Vite, and React logos to learn more.</p>

      <div
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          margin: 20,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <button
          className="shortcutButton"
          disabled={editMode}
          onClick={() => invoke("hide_window")}
        >
          <input
            disabled={!editMode}
            type="text"
            value={show_and_hide_global_shortcut}
            onChange={(e) => setShow_and_hide_global_shortcut(e.target.value)}
          />
        </button>

        <button
          className="shortcutButton"
          onClick={async () => {
            if (editMode) {
              invoke("update_shortcuts", {
                newShortcut: show_and_hide_global_shortcut,
              });
            }
            setEditMode(!editMode);
          }}
          style={{
            borderColor: editMode ? "green" : "",
            color: editMode ? "green" : "",
          }}
        >
          {editMode ? "CONFIRM" : "SETTINGS"}
        </button>
      </div>
    </div>
  );
}

export default App;

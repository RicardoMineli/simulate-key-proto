import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import Modal from "react-modal";

import { Store } from "@tauri-apps/plugin-store";

Modal.setAppElement("#root");
function App() {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [newShortcut, setNewShortcut] = useState<string>("");

  const [editMode, setEditMode] = useState<boolean>(false);

  const [shortcuts, setShortcuts] = useState<string[]>([]);
  const [show_and_hide_global_shortcut, setShow_and_hide_global_shortcut] =
    useState<string>();

  const [userConfigStore, setUserConfigStore] = useState<Store>();

  useEffect(() => {
    const setupStore = async () => {
      const store = new Store("user_config.json");
      setUserConfigStore(store);
      const val = await store.get<string>("show_and_hide_global_shortcut");
      const val2 = await store.get<string[]>("shortcuts");
      if (val) {
        setShow_and_hide_global_shortcut(val);
      } else {
        console.log("show_and_hide_global_shortcut / val is null");
      }
      if (val2) {
        setShortcuts(val2);
      } else {
        console.log("shortcuts / val2 is null");
      }
    };

    setupStore().catch(console.error);
  }, []);

  const openModal = () => {
    setModalIsOpen(true);
    console.log(modalIsOpen);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    console.log(modalIsOpen);
  };

  const editIcon = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="w-6 h-6 ml-2"
    >
      <path d="M21.731 2.269a2.625 2.625 0 0 0-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 0 0 0-3.712ZM19.513 8.199l-3.712-3.712-8.4 8.4a5.25 5.25 0 0 0-1.32 2.214l-.8 2.685a.75.75 0 0 0 .933.933l2.685-.8a5.25 5.25 0 0 0 2.214-1.32l8.4-8.4Z" />
      <path d="M5.25 5.25a3 3 0 0 0-3 3v10.5a3 3 0 0 0 3 3h10.5a3 3 0 0 0 3-3V13.5a.75.75 0 0 0-1.5 0v5.25a1.5 1.5 0 0 1-1.5 1.5H5.25a1.5 1.5 0 0 1-1.5-1.5V8.25a1.5 1.5 0 0 1 1.5-1.5h5.25a.75.75 0 0 0 0-1.5H5.25Z" />
    </svg>
  );

  const listInputs = shortcuts.map((shortcut) => (
    <button
      className=""
      onClick={() => invoke("use_shortcut", { input: shortcut })}
    >
      <span>{shortcut}</span>
      {editMode && editIcon}
    </button>
  ));

  return (
    <div className="flex flex-col items-center pt-20">
      {editMode && (
        <h1 className="border border-green-600 text-green-600 rounded-lg mb-5 p-3 text-center font-bold">
          You are editing shortcuts now!
          <br />
          Exit to the right →
        </h1>
      )}

      <div className="flex mb-5 space-x-2"> {listInputs}</div>

      <div className="flex flex-col absolute top-0 right-0 m-5 space-y-2">
        <button
          className="flex justify-center"
          onClick={() => (editMode ? openModal() : invoke("hide_window"))}
        >
          <span>{show_and_hide_global_shortcut}</span>
          {editMode && editIcon}
        </button>

        <button
          className=""
          onClick={() => {
            setEditMode(!editMode);
          }}
        >
          {editMode ? "Exit Edit Mode" : "SETTINGS"}
        </button>
      </div>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Button Edit Modal"
        className={
          "absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
        }
        style={{
          overlay: {
            backgroundColor: "rgb( 53 57 53 / 90%)",
            backdropFilter: "blur(5px)!important",
          },
        }}
      >
        <div className="flex flex-col w-80 h-72 bg-[#0f0f0f98] border border-[#396cd8] rounded-2xl p-4 shadow shadow-sky-800 justify-between items-center">
          <span className="text-center font-bold mb-6">Editing</span>
          <span className="mb-2 border border-[#396cd8] text-[1em] font-medium px-[1.2em] py-[0.6em] rounded-lg ">
            {show_and_hide_global_shortcut}
          </span>
          <span className="mb-2">To</span>
          <input
            className="text-center border border-[#396cd8]"
            type="text"
            value={newShortcut}
            onChange={(e) => {
              setNewShortcut(e.target.value);
            }}
          ></input>
          <div className="flex justify-center space-x-5 mt-auto">
            <button
              className="bg-red-700 hover:bg-red-800 px-4 py-2 rounded-md"
              onClick={closeModal}
            >
              Cancel
            </button>
            <button
              className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded-md"
              onClick={async () => {
                invoke("update_shortcuts", {
                  newShortcut: newShortcut,
                });
                setShow_and_hide_global_shortcut(newShortcut);
                setNewShortcut("");
                closeModal();
              }}
            >
              Confirm
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default App;

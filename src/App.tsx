import { useCallback, useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import Modal from "react-modal";

import { Store } from "@tauri-apps/plugin-store";

Modal.setAppElement("#root");
function App() {
  const [globalShortcutEditModalIsOpen, setGlobalShortcutEditModalIsOpen] =
    useState(false);
  const [shortcutEditModalIsOpen, setShortcutEditModalIsOpen] = useState(false);
  const [shortcutAddModalIsOpen, setShortcutAddModalIsOpen] = useState(false);
  const [selectedShortcut, setSelectedShortcut] = useState("");
  const [newShortcut, setNewShortcut] = useState<string>("");

  const [editMode, setEditMode] = useState<boolean>(false);

  const [shortcuts, setShortcuts] = useState<string[]>([]);
  const [show_and_hide_global_shortcut, setShow_and_hide_global_shortcut] =
    useState<string>("");

  const readUserConfig = useCallback(async () => {
    const store = new Store("user_config.json");
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
  }, []);

  useEffect(() => {
    readUserConfig().catch(console.error);
  }, [readUserConfig]);

  const openGlobalShortcutModal = (selectedShortcut: string) => {
    setSelectedShortcut(selectedShortcut);
    setGlobalShortcutEditModalIsOpen(true);
  };

  const closeGlobalShortcutModal = () => {
    setSelectedShortcut("");
    setGlobalShortcutEditModalIsOpen(false);
  };

  const openShortcutModal = (selectedShortcut: string) => {
    setSelectedShortcut(selectedShortcut);
    setShortcutEditModalIsOpen(true);
  };

  const closeShortcutModal = () => {
    setSelectedShortcut("");
    setShortcutEditModalIsOpen(false);
  };

  const openShortcutAddModal = () => {
    setShortcutAddModalIsOpen(true);
  };

  const closeShortcutAddModal = () => {
    setShortcutAddModalIsOpen(false);
  };

  const editIcon = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="w-6 h-6"
    >
      <path d="M21.731 2.269a2.625 2.625 0 0 0-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 0 0 0-3.712ZM19.513 8.199l-3.712-3.712-8.4 8.4a5.25 5.25 0 0 0-1.32 2.214l-.8 2.685a.75.75 0 0 0 .933.933l2.685-.8a5.25 5.25 0 0 0 2.214-1.32l8.4-8.4Z" />
      <path d="M5.25 5.25a3 3 0 0 0-3 3v10.5a3 3 0 0 0 3 3h10.5a3 3 0 0 0 3-3V13.5a.75.75 0 0 0-1.5 0v5.25a1.5 1.5 0 0 1-1.5 1.5H5.25a1.5 1.5 0 0 1-1.5-1.5V8.25a1.5 1.5 0 0 1 1.5-1.5h5.25a.75.75 0 0 0 0-1.5H5.25Z" />
    </svg>
  );

  const plusIcon = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="w-6 h-6"
    >
      <path
        fillRule="evenodd"
        d="M12 3.75a.75.75 0 0 1 .75.75v6.75h6.75a.75.75 0 0 1 0 1.5h-6.75v6.75a.75.75 0 0 1-1.5 0v-6.75H4.5a.75.75 0 0 1 0-1.5h6.75V4.5a.75.75 0 0 1 .75-.75Z"
        clipRule="evenodd"
      />
    </svg>
  );

  const trashIcon = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="w-6 h-6"
    >
      <path
        fillRule="evenodd"
        d="M16.5 4.478v.227a48.816 48.816 0 0 1 3.878.512.75.75 0 1 1-.256 1.478l-.209-.035-1.005 13.07a3 3 0 0 1-2.991 2.77H8.084a3 3 0 0 1-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 0 1-.256-1.478A48.567 48.567 0 0 1 7.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 0 1 3.369 0c1.603.051 2.815 1.387 2.815 2.951Zm-6.136-1.452a51.196 51.196 0 0 1 3.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 0 0-6 0v-.113c0-.794.609-1.428 1.364-1.452Zm-.355 5.945a.75.75 0 1 0-1.5.058l.347 9a.75.75 0 1 0 1.499-.058l-.346-9Zm5.48.058a.75.75 0 1 0-1.498-.058l-.347 9a.75.75 0 0 0 1.5.058l.345-9Z"
        clipRule="evenodd"
      />
    </svg>
  );

  const listInputs = shortcuts.map((shortcut, index) => (
    <button
      key={index}
      className="flex justify-center space-x-2"
      onClick={() =>
        editMode
          ? openShortcutModal(shortcut)
          : invoke("use_shortcut", { input: shortcut })
      }
    >
      <span>{shortcut}</span>
      {editMode && <span className="text-red-500">{trashIcon}</span>}
    </button>
  ));

  return (
    <div className="flex flex-col items-center pt-20">
      {editMode && (
        <h1 className="border border-green-600 text-green-600 bg-green-800/20 rounded-lg mb-5 p-3 text-center font-bold">
          You are editing shortcuts now!
          <br />
          Exit to the right →
        </h1>
      )}

      <div className="flex mb-5 space-x-2 pt-52">
        {listInputs}
        {editMode && (
          <button
            onClick={() => {
              openShortcutAddModal();
            }}
          >
            {plusIcon}
          </button>
        )}
      </div>

      <div className="flex flex-col absolute top-0 right-0 m-5 space-y-2">
        <div className="flex flex-col items-center space-y-1">
          {!editMode && (
            <span>
              This is the shortcut to <br /> hide/show the overlay. <br /> You
              can also click it.
            </span>
          )}
          <button
            className="flex justify-center space-x-2 w-full"
            onClick={() =>
              editMode
                ? openGlobalShortcutModal(show_and_hide_global_shortcut)
                : invoke("hide_window")
            }
          >
            {show_and_hide_global_shortcut}
            {editMode && <span className="ml-2">{editIcon}</span>}
          </button>
        </div>

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
        isOpen={globalShortcutEditModalIsOpen}
        onRequestClose={closeGlobalShortcutModal}
        contentLabel="Global Shortcut Edit Modal"
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
        <div className="flex flex-col w-80 h-[22rem] bg-[#0f0f0f98] border border-[#396cd8] rounded-2xl p-4 shadow shadow-sky-800 justify-between items-center">
          <span className="text-center">
            Warning: This shortcut overwrites all functionality of other
            shortcuts, if you use Ctrl+C here, Ctrl+C will stop copying!
          </span>
          <hr className="w-full border border-[#396cd8]" />
          <span className="text-center font-bold mb-1 mt-2">Editing</span>
          <span className="mb-2 border border-[#396cd8] text-[1em] font-medium px-[1.2em] py-[0.6em] rounded-lg ">
            {selectedShortcut}
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
              onClick={closeGlobalShortcutModal}
            >
              Cancel
            </button>
            <button
              className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded-md"
              onClick={async () => {
                invoke("update_global_shortcut", {
                  newShortcut: newShortcut,
                });
                setShow_and_hide_global_shortcut(newShortcut);
                setNewShortcut("");
                closeGlobalShortcutModal();
              }}
            >
              Confirm
            </button>
          </div>
        </div>
      </Modal>
      <Modal
        isOpen={shortcutEditModalIsOpen}
        onRequestClose={closeShortcutModal}
        contentLabel="Shortcut Edit Modal"
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
          <span className="text-center font-bold mb-6">Confirm Remove</span>
          <span className="mb-2">of</span>
          <span className="mb-2 border border-[#396cd8] text-[1em] font-medium px-[1.2em] py-[0.6em] rounded-lg ">
            {selectedShortcut}
          </span>

          <div className="flex justify-center space-x-5 mt-auto">
            <button
              className="bg-red-700 hover:bg-red-800 px-4 py-2 rounded-md"
              onClick={closeShortcutModal}
            >
              Cancel
            </button>
            <button
              className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded-md"
              onClick={async () => {
                invoke("remove_shortcut", {
                  shortcutToRemove: selectedShortcut,
                });
                readUserConfig();
                closeShortcutModal();
              }}
            >
              Confirm
            </button>
          </div>
        </div>
      </Modal>
      <Modal
        isOpen={shortcutAddModalIsOpen}
        onRequestClose={closeShortcutAddModal}
        contentLabel="Shortcut Add Modal"
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
          <span className="text-center font-bold mb-6">Add Shortcut</span>

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
              onClick={closeShortcutAddModal}
            >
              Cancel
            </button>
            <button
              className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded-md"
              onClick={async () => {
                invoke("add_shortcut", {
                  shortcutToAdd: newShortcut,
                });
                readUserConfig();
                closeShortcutAddModal();
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

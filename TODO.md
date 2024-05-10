- [ ] Prevent panic when changing shortcut to a invalid value

  - Example: Setting the global shortcut to "ctrl+f12gibberish" will panick the app

- [ ] Make app work on linux
- Currently the get handle on global hotkey is using Windows API calls
- so this app is Windows only right now

- [ ] Make app appear on current monitor for multi-monitor desktops

- [ ] Make react state observe and reflect the data of the user_config.json file.
  - This will make the UI automatically update without any function calls.

- [x] Make show_and_hide_shortcut user customizable

- [x] Warn users when selecting desired shortcut
  - Global shortcut removes the default functionality of the shortcut

- [ ] Make profiles for multiple user defined shortcuts

- [ ] Check if app work on games
  - [ ] Check enigo
  - [ ] Check Windows get handle

- [ ] Refactor whole code
  - Lots of code are repeating and need overall polish
  - Maybe just rewrite the whole thing when finishing this prototype

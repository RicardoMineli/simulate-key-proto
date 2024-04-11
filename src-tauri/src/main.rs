// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::sync::Mutex;

use tauri::{
    menu::{MenuBuilder, MenuItemBuilder},
    tray::{ClickType, TrayIconBuilder},
    Manager, State,
};

use enigo::{
    agent::{Agent, Token},
    Direction::{Click, Press, Release},
    Enigo, Key, Settings,
};

use windows::Win32::{
    Foundation::HWND,
    UI::WindowsAndMessaging::{GetForegroundWindow, SetForegroundWindow},
};

// https://blog.moonguard.dev/manage-state-with-tauri
struct AppState {
    previous_handle: Mutex<HWND>,
    enigo: Mutex<Enigo>,
}

#[tauri::command]
fn greet(name: &str) -> String {
    println!("Called {}", name);
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
fn use_shortcut(input: &str, window: tauri::Window, app_state: State<AppState>) {
    window.hide().unwrap();

    let previous_handle_lock = app_state.previous_handle.lock().unwrap();
    let mut enigo_lock = app_state.enigo.lock().unwrap();

    unsafe {
        SetForegroundWindow(*previous_handle_lock);
    }

    let tokens = parse_enigo_keys(input);

    for token in &tokens {
        enigo_lock.execute(token).unwrap();
    }
}

fn main() {
    tauri::Builder::default()
        .setup(|app| {
            #[cfg(desktop)]
            {
                // Init state
                app.manage(AppState {
                    previous_handle: Mutex::new(HWND(0)),
                    enigo: Mutex::new(Enigo::new(&Settings::default()).unwrap()),
                });

                let app_state: State<AppState> = app.state();

                let previous_handle_lock = app_state.previous_handle.lock().unwrap();

                println!("Previous window handle: {:?}", *previous_handle_lock);

                let quit = MenuItemBuilder::new("Quit").id("quit").build(app).unwrap();

                let menu = MenuBuilder::new(app).items(&[&quit]).build().unwrap();

                // remember to enable "tray-icon" cargo feature
                let _tray = TrayIconBuilder::new()
                    .icon(app.default_window_icon().unwrap().clone())
                    .tooltip("simulate-key-proto")
                    .menu(&menu)
                    .on_menu_event(|app, event| match event.id().as_ref() {
                        "quit" => {
                            app.exit(0);
                        }
                        _ => {}
                    })
                    .on_tray_icon_event(|tray, event| match event.click_type {
                        ClickType::Left => {
                            let window = tray.app_handle().get_window("main").unwrap();
                            window.show().unwrap();
                            window.unminimize().unwrap();
                            window.set_focus().unwrap();
                        }
                        ClickType::Right => {}
                        ClickType::Double => {}
                    })
                    .build(app);

                // Global Shortcut setup
                use tauri_plugin_global_shortcut::{Code, Modifiers, Shortcut};

                let show_and_hide_shortcut = Shortcut::new(Some(Modifiers::CONTROL), Code::F12);

                app.handle().plugin(
                    tauri_plugin_global_shortcut::Builder::new()
                        .with_shortcuts([show_and_hide_shortcut])?
                        .with_handler(move |app, shortcut| {
                            let window = app.get_window("main").unwrap();
                            if shortcut == &show_and_hide_shortcut {
                                if window.is_visible().unwrap() {
                                    window.hide().unwrap();
                                } else {
                                    window.show().unwrap();
                                    set_previous_handle_on_windows(app);
                                    // window.set_focus().unwrap();
                                }
                            }
                        })
                        .build(),
                )?;
            }

            Ok(())
        })
        // .plugin(tauri_plugin_global_shortcut::Builder::new().build())
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![greet, use_shortcut])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

fn set_previous_handle_on_windows(app: &tauri::AppHandle) {
    // Save state to var so we can use it from the app handle
    let app_state: State<AppState> = app.state::<AppState>();

    // Create lock for thread safety
    let mut previous_handle_lock = app_state.previous_handle.lock().unwrap();
    unsafe { *previous_handle_lock = GetForegroundWindow() }
}

// https://github.com/enigo-rs/enigo/blob/main/examples/serde.rs
fn parse_enigo_keys(input: &str) -> Vec<Token> {
    // Works for any Unicode, Control, Shift, Alt and F1...F24
    let mut used_ctrl: bool = false;
    let mut used_shift: bool = false;
    let mut used_alt: bool = false;

    let mut tokens = Vec::new();
    let input_lowercase = input.to_lowercase();
    let parts: Vec<&str> = input_lowercase.split('+').collect();
    for part in parts {
        let trimmed_part = part.trim();
        match trimmed_part {
            "ctrl" => {
                tokens.push(Token::Key(Key::Control, Press));
                used_ctrl = true;
            }
            "shift" => {
                tokens.push(Token::Key(Key::Shift, Press));
                used_shift = true;
            }
            "alt" => {
                tokens.push(Token::Key(Key::Alt, Press));
                used_alt = true;
            }
            "f1" => {
                println!("It got here");
                tokens.push(Token::Key(Key::F1, Press));
            }
            "f2" => {
                println!("It got here");
                tokens.push(Token::Key(Key::F2, Press));
            }
            "f3" => {
                println!("It got here");
                tokens.push(Token::Key(Key::F3, Press));
            }
            "f4" => {
                println!("It got here");
                tokens.push(Token::Key(Key::F4, Press));
            }
            "f5" => {
                println!("It got here");
                tokens.push(Token::Key(Key::F5, Press));
            }
            "f6" => {
                println!("It got here");
                tokens.push(Token::Key(Key::F6, Press));
            }
            "f7" => {
                println!("It got here");
                tokens.push(Token::Key(Key::F7, Press));
            }
            "f8" => {
                println!("It got here");
                tokens.push(Token::Key(Key::F8, Press));
            }
            "f9" => {
                println!("It got here");
                tokens.push(Token::Key(Key::F9, Press));
            }
            "f10" => {
                println!("It got here");
                tokens.push(Token::Key(Key::F10, Press));
            }
            "f11" => {
                println!("It got here");
                tokens.push(Token::Key(Key::F11, Press));
            }
            "f12" => {
                println!("It got here");
                tokens.push(Token::Key(Key::F12, Press));
            }
            "f13" => {
                println!("It got here");
                tokens.push(Token::Key(Key::F13, Press));
            }
            "f14" => {
                println!("It got here");
                tokens.push(Token::Key(Key::F14, Press));
            }
            "f15" => {
                println!("It got here");
                tokens.push(Token::Key(Key::F15, Press));
            }
            "f16" => {
                println!("It got here");
                tokens.push(Token::Key(Key::F16, Press));
            }
            "f17" => {
                println!("It got here");
                tokens.push(Token::Key(Key::F17, Press));
            }
            "f18" => {
                println!("It got here");
                tokens.push(Token::Key(Key::F18, Press));
            }
            "f19" => {
                println!("It got here");
                tokens.push(Token::Key(Key::F19, Press));
            }
            "f20" => {
                println!("It got here");
                tokens.push(Token::Key(Key::F20, Press));
            }
            "f21" => {
                println!("It got here");
                tokens.push(Token::Key(Key::F21, Press));
            }
            "f22" => {
                println!("It got here");
                tokens.push(Token::Key(Key::F22, Press));
            }
            "f23" => {
                println!("It got here");
                tokens.push(Token::Key(Key::F23, Press));
            }
            "f24" => {
                println!("It got here");
                tokens.push(Token::Key(Key::F24, Press));
            }

            s if s.len() == 1 => {
                if let Some(c) = trimmed_part.chars().next() {
                    tokens.push(Token::Key(Key::Unicode(c), Click));
                }
            }

            _ => {}
        }
    }

    if used_ctrl {
        tokens.push(Token::Key(Key::Control, Release));
    }
    if used_shift {
        tokens.push(Token::Key(Key::Shift, Release));
    }
    if used_alt {
        tokens.push(Token::Key(Key::Alt, Release));
    }

    tokens
}

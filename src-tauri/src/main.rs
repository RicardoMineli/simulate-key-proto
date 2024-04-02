// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn greet(name: &str) -> String {
    println!("Called {}", name);
    format!("Hello, {}! You've been greeted from Rust!", name)
}

fn main() {
    tauri::Builder::default()
        .setup(|app| {
            #[cfg(desktop)]
            {
                use tauri_plugin_global_shortcut::{Code, Modifiers, Shortcut};

                let ctrl_shift_n_shortcut =
                    Shortcut::new(Some(Modifiers::CONTROL | Modifiers::SHIFT), Code::KeyN);

                let ctrl_d_shortcut = Shortcut::new(Some(Modifiers::CONTROL), Code::KeyD);

                app.handle().plugin(
                    tauri_plugin_global_shortcut::Builder::new()
                        .with_shortcuts([ctrl_shift_n_shortcut, ctrl_d_shortcut])?
                        .with_handler(move |_app, shortcut| {
                            if shortcut == &ctrl_shift_n_shortcut {
                                println!("Ctrl-Shift-N Detected!");
                            }
                            if shortcut == &ctrl_d_shortcut {
                                println!("Ctrl-D Detected!");
                            }
                        })
                        .build(),
                )?;
            }

            Ok(())
        })
        // .plugin(tauri_plugin_global_shortcut::Builder::new().build())
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![greet])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::{
    menu::{MenuBuilder, MenuItemBuilder},
    tray::{ClickType, TrayIconBuilder},
    Manager,
};

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
                                    window.set_focus().unwrap();
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
        .invoke_handler(tauri::generate_handler![greet])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod greet;
use greet::greet;

mod installMod;
use installMod::installMod;

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![greet,installMod])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

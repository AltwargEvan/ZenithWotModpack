// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod greet;
use greet::greet;
mod install_mod;
use install_mod::install_mod;
mod wot_modification;

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![greet, install_mod])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

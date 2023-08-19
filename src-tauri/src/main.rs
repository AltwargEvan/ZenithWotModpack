// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod utils;
mod api_handlers;
use api_handlers::{greet::greet, install_mod::install_mod};


fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![greet,install_mod])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

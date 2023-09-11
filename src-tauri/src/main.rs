// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
use tauri_plugin_log::LogTarget;
mod api_handlers;
mod utils;
use api_handlers::{greet::greet, install_mod::install_mod, unzip_file::unzip_file};
fn main() {
    tauri::Builder::default()
        .plugin(
            tauri_plugin_log::Builder::default()
                .targets([LogTarget::LogDir, LogTarget::Stdout, LogTarget::Webview])
                .build(),
        )
        .plugin(tauri_plugin_store::Builder::default().build())
        .invoke_handler(tauri::generate_handler![greet, install_mod, unzip_file])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

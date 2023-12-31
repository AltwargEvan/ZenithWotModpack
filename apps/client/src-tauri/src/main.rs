// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
use db::state::AppState;
use tauri_plugin_log::LogTarget;
mod commands;
use commands::config::{detect_game_directories, get_config, set_game_directory};
use commands::misc::open_file_explorer;
use commands::mod_installer::{get_installed_configs, install_mods, uninstall_mod};
use commands::unzip_file_command::unzip_file;
mod db;
mod types;
mod utils;
use specta::collect_types;
use tauri::{Manager, State};
use tauri_specta::ts;

fn main() {
    // ts typegen
    #[cfg(debug_assertions)]
    ts::export(
        collect_types![
            get_config,
            set_game_directory,
            detect_game_directories,
            get_installed_configs,
            install_mods,
            uninstall_mod,
            open_file_explorer
        ],
        "../src/api/rust.ts",
    )
    .unwrap();

    tauri::Builder::default()
        .plugin(
            tauri_plugin_log::Builder::default()
                .targets([LogTarget::LogDir, LogTarget::Stdout, LogTarget::Webview])
                .build(),
        )
        .plugin(tauri_plugin_oauth::init())
        .manage(AppState {
            db: Default::default(),
        })
        .setup(|app| {
            let handle = app.handle();
            let app_state: State<AppState> = handle.state();
            let db =
                db::init::initialize_database(&handle).expect("Database initialize should succeed");
            *app_state.db.lock().unwrap() = Some(db);

            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            open_file_explorer,
            get_config,
            set_game_directory,
            unzip_file,
            detect_game_directories,
            get_installed_configs,
            install_mods,
            uninstall_mod,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

#[test]
fn export_bindings() {
    ts::export(
        collect_types![
            get_config,
            set_game_directory,
            detect_game_directories,
            get_installed_configs,
            install_mods,
            uninstall_mod,
            open_file_explorer
        ],
        "../src/api/rust.ts",
    )
    .unwrap();
}

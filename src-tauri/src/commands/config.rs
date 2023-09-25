use std::fs;
use std::{fs::read_dir, path::Path};

use crate::db;
use crate::db::queries::fetch_config;
use crate::db::state::ServiceAccess;
use crate::types::Config;
use tauri::AppHandle;

#[tauri::command]
#[specta::specta]
pub async fn get_config(app_handle: AppHandle) -> Result<Config, String> {
    return db::queries::fetch_config(&app_handle);
}

#[specta::specta]
#[tauri::command]
pub async fn set_game_directory(
    game_directory: String,
    app_handle: AppHandle,
) -> Result<(), String> {
    let path = Path::new(&game_directory);

    let current_game_dir = fetch_config(&app_handle)?.game_directory;
    if current_game_dir.is_some_and(|dir| dir == game_directory) {
        return Ok(());
    }

    if !is_game_dir(&path) {
        return Err(String::from(
            "The game client was not detected in the specified folder",
        ));
    };

    let sql = "--sql
        UPDATE config 
        SET game_directory = ?1
        WHERE id = 1
    ";

    // update db
    app_handle
        .db(|conn| conn.execute(sql, [game_directory]))
        .map_err(|e| e.to_string())?;

    Ok(())
}

#[specta::specta]
#[tauri::command]
pub async fn detect_game_directories() -> Vec<String> {
    let mut results: Vec<String> = Vec::new();
    let dir_string = String::from("C:\\Games");
    let default_games_dir = Path::new(&dir_string);

    if !default_games_dir.is_dir() {
        return results;
    }

    if let Ok(entries) = read_dir(default_games_dir) {
        for entry in entries {
            if let Ok(dir) = entry {
                let path = dir.path();
                if path.is_dir() && is_game_dir(&path) {
                    path.to_str()
                        .and_then(|val| Some(results.push(val.to_string())));
                }
            }
        }
    }
    results
}

fn is_game_dir(path: &Path) -> bool {
    return path.join("WorldOfTanks.exe").try_exists().unwrap_or(false);
}

#[specta::specta]
#[tauri::command]
pub async fn get_game_version(app_handle: AppHandle) -> Result<String, String> {
    detect_game_version(&app_handle)
}

pub fn detect_game_version(app_handle: &AppHandle) -> Result<String, String> {
    let config = db::queries::fetch_config(&app_handle)?;

    let game_directory = config
        .game_directory
        .ok_or("No game directory specified in user config")?;

    let game_version_data_filepath = Path::new(&game_directory).join("version.xml");

    let contents = fs::read_to_string(game_version_data_filepath).map_err(|e| e.to_string())?;
    let mut start = contents
        .find("<version>")
        .ok_or("Failed to parse version.xml file.")?;
    let mut end = contents
        .find("</version>")
        .ok_or("Failed to parse version.xml file.")?;

    let unparsed_version = contents[start + 9..end - 1].to_string();
    start = unparsed_version
        .find("v.")
        .ok_or("Failed to parse version.xml file.")?;
    end = unparsed_version
        .find(" #")
        .ok_or("Failed to parse version.xml file.")?;
    let version = unparsed_version[start + 2..end].into();
    Ok(version)
}

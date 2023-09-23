use std::{fs::read_dir, path::Path};

use crate::state;
use crate::types::Config;
use rusqlite::{named_params, params, Error};
use state::ServiceAccess;
use tauri::AppHandle;

#[tauri::command]
#[specta::specta]
pub async fn get_config(app_handle: AppHandle) -> Result<Config, String> {
    app_handle
        .db(|conn| {
            conn.query_row("SELECT * FROM CONFIG LIMIT 1", [], |row| {
                Ok(Config {
                    game_directory: row.get("game_directory")?,
                })
            })
        })
        .map_err(|err| err.to_string().into())
}

#[specta::specta]
#[tauri::command]
pub async fn set_game_directory(
    game_directory: String,
    app_handle: AppHandle,
) -> Result<(), String> {
    app_handle.db(|conn| {
        let path = Path::new(&game_directory);
        println!("Set Dir Path: {}", path.to_str().unwrap());

        if !is_game_dir(&path) {
            return Err(String::from(
                "The game client was not detected in the specified folder",
            ));
        };

        match conn.execute(
            "UPDATE config 
            SET game_directory = ?1
            WHERE id = 1",
            [game_directory],
        ) {
            Ok(_) => Ok(()),
            Err(err) => Err(err.to_string()),
        }
    })
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
    let exec_path = path.join("WorldOfTanks.exe");
    let data = exec_path.to_str().unwrap();
    println!("Path: {}", data);
    return exec_path.try_exists().unwrap_or(false);
}

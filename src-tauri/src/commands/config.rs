use crate::state;
use crate::types::Config;
use rusqlite::{params, Error};
use state::ServiceAccess;
use tauri::AppHandle;

#[tauri::command]
#[specta::specta]
pub async fn get_config(app_handle: AppHandle) -> Result<Config, String> {
    app_handle
        .db(|db| {
            db.query_row("SELECT * FROM CONFIG LIMIT 1", [], |row| {
                Ok(Config {
                    game_directory: row.get("game_directory")?,
                })
            })
        })
        .map_err(|err| err.to_string().into())
}

// #[tauri::command]
// pub async fn set_game_directory(
//     game_directory: &str,
//     app_handle: AppHandle,
// ) -> Result<(), rusqlite::Error> {
//     app_handle.db(|db| {
//         let mut statement =
//             db.prepare("INSERT INTO config (game_directory) VALUES (@game_directory)");
//         let mut data = statement.execute(named_params! { "@game_directory": game_directory})?;

//         Ok(())
//     })
// }

use std::fmt::format;

use crate::types::{Config, Mod};
use rusqlite::named_params;
use tauri::AppHandle;

use super::state::ServiceAccess;

pub async fn fetch_mod(mod_id: i32, app_handle: &AppHandle) -> Result<Mod, String> {
    let sql = "--sql
        SELECT * FROM mods
        WHERE id = &1
    ";

    app_handle
        .db(|conn| {
            conn.query_row(sql, [mod_id], |row| {
                Ok(Mod {
                    id: row.get("id")?,
                    wg_mods_id: row.get("wg_mods_id")?,
                    name: row.get("name")?,
                    mod_version: row.get("mod_version")?,
                    game_version: row.get("game_version")?,
                    thumbnail_url: row.get("thumbnail_url")?,
                })
            })
        })
        .map_err(|e| e.to_string())
}

pub async fn fetch_config(app_handle: &AppHandle) -> Result<Config, String> {
    let sql = "--sql
        SELECT * FROM config
        WHERE ID = 1
    ";

    app_handle
        .db(|conn| {
            conn.query_row(sql, [], |row| {
                Ok(Config {
                    game_directory: row.get("game_directory")?,
                })
            })
        })
        .map_err(|err| err.to_string().into())
}

pub async fn update_mod(mod_data: Mod, app_handle: &AppHandle) -> Result<(), String> {
    let sql = "--sql
        INSERT OR REPLACE INTO mods (id, game_version, mod_version, name, thumbnail_url, wg_mods_id)
        VALUES (:id, :game_version, :mod_version, :name, :thumbnail_url, :wg_mods_id)
    ";

    let params = named_params! {
        ":id": mod_data.id,
        ":game_version": mod_data.game_version,
        ":mod_version": mod_data.mod_version,
        ":name": mod_data.name,
        ":thumbnail_url": mod_data.thumbnail_url,
        ":wg_mods_id": mod_data.wg_mods_id
    };

    app_handle
        .db(|conn| conn.execute(sql, params))
        .map_err(|err| err.to_string())?;
    Ok(())
}

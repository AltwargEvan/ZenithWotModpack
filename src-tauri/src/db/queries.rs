use std::fmt::format;

use crate::types::{Config, Mod};
use sql_builder::SqlBuilder;
use tauri::AppHandle;

use super::state::ServiceAccess;

pub async fn fetch_mod(mod_id: i32, app_handle: &AppHandle) -> Result<Mod, String> {
    let sql = SqlBuilder::select_from("mods")
        .field("*")
        .and_where(format!("id = {}", mod_id))
        .sql()
        .map_err(|e| e.to_string())?;

    app_handle
        .db(|conn| {
            conn.query_row(&sql, (), |row| {
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
    let sql = SqlBuilder::select_from("config")
        .field("*")
        .and_where(format!("id = 1"))
        .sql()
        .map_err(|e| e.to_string())?;

    app_handle
        .db(|conn| {
            conn.query_row(&sql, [], |row| {
                Ok(Config {
                    game_directory: row.get("game_directory")?,
                })
            })
        })
        .map_err(|err| err.to_string().into())
}

pub async fn update_mod(data: Mod, app_handle: &AppHandle) -> Result<(), String> {
    let sql = SqlBuilder::update_table("mods")
        .set("game_version", data.game_version)
        .set("mod_version", data.mod_version)
        .set("name", data.name)
        .set("thumbnail_url", data.thumbnail_url)
        .and_where(format!("id={}", data.id))
        .sql()
        .map_err(|e| e.to_string())?;

    app_handle
        .db(|conn| conn.execute(&sql, ()))
        .map_err(|err| err.to_string())?;
    Ok(())
}

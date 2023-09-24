use tauri::AppHandle;

use crate::{
    state::ServiceAccess,
    types::{Config, Mod},
};

pub async fn fetch_mod(mod_id: i32, app_handle: &AppHandle) -> Result<Mod, String> {
    app_handle
        .db(|conn| {
            conn.query_row("SELECT * FROM mods WHERE id=?1", [mod_id], |row| {
                Ok(Mod {
                    id: row.get("id")?,
                    wg_mods_id: row.get("id")?,
                    name: row.get("name")?,
                    mod_version: row.get("mod_version")?,
                    game_version: row.get("game_version")?,
                    thumbnail_url: row.get("thumbnail_url")?,
                })
            })
        })
        .map_err(|err| err.to_string().into())
}

pub async fn fetch_config(app_handle: &AppHandle) -> Result<Config, String> {
    app_handle
        .db(|conn| {
            conn.query_row("SELECT * FROM WHERE id=?1", [1], |row| {
                Ok(Config {
                    game_directory: row.get("game_directory")?,
                })
            })
        })
        .map_err(|err| err.to_string().into())
}

pub async fn update_mod(data: Mod, app_handle: &AppHandle) -> Result<Config, String> {
    todo!()
}

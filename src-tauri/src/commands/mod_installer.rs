use std::error::Error;

use rusqlite::named_params;
use tauri::AppHandle;

use crate::{
    state::ServiceAccess,
    types::{InstallConfig, Mod},
};

#[tauri::command]
#[specta::specta]
pub async fn get_mod(mod_id: i32, app_handle: AppHandle) -> Result<Mod, String> {
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

#[tauri::command]
#[specta::specta]
pub async fn upsert_mod(
    mod_data: Mod,
    install_configs: Vec<InstallConfig>,
    app_handle: AppHandle,
) -> Result<(), String> {
    return app_handle.db(|conn| {
        // add mod
        conn.execute(
            "UPSERT INTO mods (id, wg_mods_id, name, mod_version, game_version, thumbnail_url)
            VALUES (:id, :wg_mods_id, :name, :mod_version, :game_version, :thumbnail_url)",
            named_params! {
                ":id": mod_data.id,
                ":name": mod_data.name,
                ":mod_version": mod_data.mod_version,
                ":game_version": mod_data.game_version,
                ":thumbnail_url": mod_data.thumbnail_url
            },
        )
        .map_err(|e| e.to_string())?;
        // delete all old configs associated with mod
        conn.execute("DELETE FROM install_configs WHERE mod_id=?1", [mod_data.id])
            .map_err(|e| e.to_string())?;

        // add new configs
        for install_config in install_configs {
            conn.execute(
                "INSERT INTO install_configs (mod_id, mods_path, res_path, configs_path)
            VALUES (:mod_id, :mods_path, :res_path, :configs_path)",
                named_params! {
                    ":mod_id": install_config.mod_id,
                    ":mods_path": install_config.mods_path,
                    ":res_path": install_config.res_path,
                    ":configs_path": install_config.configs_path
                },
            )
            .map_err(|e| e.to_string())?;
        }

        Ok(())
    });
}

use crate::types::{Config, InstallConfig, Mod};
use rusqlite::named_params;
use tauri::AppHandle;

use super::state::ServiceAccess;

pub async fn fetch_mod(mod_id: i32, app_handle: &AppHandle) -> Result<Mod, String> {
    let sql = format!(
        "--sql
        SELECT * FROM mods
        WHERE id = {}
    ",
        mod_id
    );

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

pub async fn update_mod(
    mod_data: Mod,
    install_configs: Vec<InstallConfig>,
    app_handle: &AppHandle,
) -> Result<(), String> {
    let update_mod_sql = "--sql
        INSERT OR REPLACE INTO mods (id, game_version, mod_version, name, thumbnail_url, wg_mods_id)
        VALUES (:id, :game_version, :mod_version, :name, :thumbnail_url, :wg_mods_id)
    ";

    let update_mod_params = named_params! {
        ":id": mod_data.id,
        ":game_version": mod_data.game_version,
        ":mod_version": mod_data.mod_version,
        ":name": mod_data.name,
        ":thumbnail_url": mod_data.thumbnail_url,
        ":wg_mods_id": mod_data.wg_mods_id
    };

    let delete_configs_sql = "--sql
        DELETE FROM install_configs WHERE mod_id = ?1
    ";

    let create_config_sql = "--sql
        INSERT OR REPLACE INTO install_configs (mod_id, mods_path, res_path, configs_path)
        VALUES (:mod_id, :mods_path, :res_path, :configs_path)
    ";

    app_handle.db(|conn| {
        conn.execute(update_mod_sql, update_mod_params)
            .map_err(|e| e.to_string())?;

        conn.execute(&delete_configs_sql, [mod_data.id])
            .map_err(|e| e.to_string())?;

        for cfg in install_configs {
            let params = named_params! {
                ":mod_id": cfg.mod_id,
                ":mods_path": cfg.mods_path,
                ":res_path": cfg.res_path,
                ":configs_path": cfg.configs_path
            };
            conn.execute(create_config_sql, params)
                .map_err(|e| e.to_string())?;
        }
        Ok(())
    })
}

use crate::types::{CachedMod, Config, LocalInstallConfig};
use rusqlite::named_params;
use tauri::AppHandle;

use super::state::ServiceAccess;

pub fn fetch_cached_mods(app_handle: &AppHandle) -> Result<Vec<CachedMod>, String> {
    let sql = "--sql
        SELECT * FROM mods
    ";
    let mut result = Vec::new();

    app_handle.db(|conn| {
        let mut stmt = conn.prepare(sql).map_err(|e| e.to_string())?;
        let iter = stmt
            .query_map([], |row| {
                Ok(CachedMod {
                    id: row.get("id")?,
                    name: row.get("name")?,
                    mod_version: row.get("mod_version")?,
                    game_version: row.get("game_version")?,
                })
            })
            .map_err(|e| e.to_string())?;

        for item in iter {
            match item {
                Ok(item) => result.push(item),
                Err(err) => println!("Failed to unwrap item: {}", err.to_string()),
            }
        }
        Ok(result)
    })
}

pub fn fetch_installed_mods(app_handle: &AppHandle) -> Result<Vec<LocalInstallConfig>, String> {
    let sql = "--sql
        SELECT * FROM installed_mods
    ";
    let mut result = Vec::new();

    app_handle.db(|conn| {
        let mut stmt = conn.prepare(sql).map_err(|e| e.to_string())?;
        let iter = stmt
            .query_map([], |row| {
                Ok(LocalInstallConfig {
                    id: row.get("id")?,
                    name: row.get("name")?,
                    mod_id: row.get("mod_id")?,
                    mods_path: row.get("mods_path")?,
                    res_path: row.get("res_path")?,
                    configs_path: row.get("configs_path")?,
                    game_directory: row.get("game_directory")?,
                })
            })
            .map_err(|e| e.to_string())?;

        for item in iter {
            match item {
                Ok(item) => result.push(item),
                Err(err) => println!("Failed to unwrap item: {}", err.to_string()),
            }
        }
        Ok(result)
    })
}

pub fn fetch_installed_configs_for_mod(
    mod_id: i32,
    game_directory: String,
    app_handle: &AppHandle,
) -> Result<Vec<LocalInstallConfig>, String> {
    let sql = format!(
        "--sql
        SELECT * FROM installed_mods
        WHERE mod_id = {mod_id} AND game_directory = '{game_directory}'
        "
    );
    let mut result = Vec::new();

    app_handle.db(|conn| {
        let mut stmt = conn.prepare(&sql).map_err(|e| e.to_string())?;
        let mod_iter = stmt
            .query_map([], |row| {
                Ok(LocalInstallConfig {
                    id: row.get("id")?,
                    mod_id: row.get("mod_id")?,
                    mods_path: row.get("mods_path")?,
                    res_path: row.get("res_path")?,
                    configs_path: row.get("configs_path")?,
                    name: row.get("name")?,
                    game_directory: row.get("game_directory")?,
                })
            })
            .map_err(|e| e.to_string())?;

        for item in mod_iter {
            match item {
                Ok(item) => result.push(item),
                Err(err) => println!("Failed to unwrap item: {}", err.to_string()),
            }
        }
        Ok(result)
    })
}

pub fn fetch_config(app_handle: &AppHandle) -> Result<Config, String> {
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

pub fn update_mod(mod_data: &CachedMod, app_handle: &AppHandle) -> Result<(), String> {
    let update_mod_sql = "--sql
        INSERT OR REPLACE INTO mods (id, game_version, mod_version, name, thumbnail_url, wg_mods_id)
        VALUES (:id, :game_version, :mod_version, :name, :thumbnail_url, :wg_mods_id)
    ";

    let update_mod_params = named_params! {
        ":id": mod_data.id,
        ":game_version": mod_data.game_version,
        ":mod_version": mod_data.mod_version,
        ":name": mod_data.name,
    };

    app_handle.db(|conn| {
        conn.execute(update_mod_sql, update_mod_params)
            .map_err(|e| e.to_string())?;
        Ok(())
    })
}

pub fn fetch_install(
    mod_id: i32,
    install_config_id: &i32,
    app_handle: &AppHandle,
) -> Result<LocalInstallConfig, String> {
    let sql = format!(
        "--sql
            SELECT * FROM installed_mods WHERE id = {install_config_id}
        "
    );

    app_handle
        .db(|conn| {
            conn.query_row(&sql, (), |row| {
                Ok(LocalInstallConfig {
                    id: row.get("id")?,
                    game_directory: row.get("game_directory")?,
                    mod_id: row.get("mod_id")?,
                    mods_path: row.get("mods_path")?,
                    res_path: row.get("res_path")?,
                    configs_path: row.get("configs_path")?,
                    name: row.get("name")?,
                })
            })
        })
        .map_err(|e| e.to_string())
}

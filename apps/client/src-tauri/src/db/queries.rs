use crate::types::{Config, InstallConfig, Mod};
use rusqlite::named_params;
use tauri::AppHandle;

use super::state::ServiceAccess;

pub fn fetch_mod(mod_id: i32, app_handle: &AppHandle) -> Result<Mod, String> {
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

pub fn fetch_cached_mods(app_handle: &AppHandle) -> Result<Vec<Mod>, String> {
    let sql = "--sql
        SELECT * FROM mods
    ";
    let mut result = Vec::new();

    app_handle.db(|conn| {
        let mut stmt = conn.prepare(sql).map_err(|e| e.to_string())?;
        let iter = stmt
            .query_map([], |row| {
                Ok(Mod {
                    id: row.get("id")?,
                    wg_mods_id: row.get("wg_mods_id")?,
                    name: row.get("name")?,
                    mod_version: row.get("mod_version")?,
                    game_version: row.get("game_version")?,
                    thumbnail_url: row.get("thumbnail_url")?,
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

pub fn fetch_installed_mods(app_handle: &AppHandle) -> Result<Vec<InstallConfig>, String> {
    let sql = "--sql
        SELECT * FROM installed_mods
    ";
    let mut result = Vec::new();

    app_handle.db(|conn| {
        let mut stmt = conn.prepare(sql).map_err(|e| e.to_string())?;
        let iter = stmt
            .query_map([], |row| {
                Ok(InstallConfig {
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
) -> Result<Vec<InstallConfig>, String> {
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
                Ok(InstallConfig {
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

pub fn update_mod(mod_data: Mod, app_handle: &AppHandle) -> Result<(), String> {
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

    app_handle.db(|conn| {
        conn.execute(update_mod_sql, update_mod_params)
            .map_err(|e| e.to_string())?;
        Ok(())
    })
}

pub fn delete_mod(mod_data: Mod, app_handle: &AppHandle) -> Result<(), String> {
    let sql = "--sql
        DELETE FROM mods WHERE id = ?1
    ";

    app_handle.db(|conn| {
        conn.execute(sql, [mod_data.id])
            .map_err(|e| e.to_string())?;
        Ok(())
    })
}

pub fn insert_installed_mod(mod_data: InstallConfig, app_handle: &AppHandle) -> Result<(), String> {
    let sql = "--sql
        INSERT OR REPLACE INTO installed_mods (mod_id, mods_path, res_path, configs_path, name, game_directory)
        VALUES (:mod_id, :mods_path, :res_path, :configs_path, :name, :game_directory)
    ";

    let params = named_params! {
        ":mod_id": mod_data.mod_id,
        ":mods_path": mod_data.mods_path,
        ":res_path": mod_data.res_path,
        ":configs_path": mod_data.configs_path,
        ":name": mod_data.name,
        ":game_directory": mod_data.game_directory
    };

    app_handle.db(|conn| {
        conn.execute(sql, params).map_err(|e| e.to_string())?;
        Ok(())
    })
}

pub fn delete_install(install_name: String, app_handle: &AppHandle) -> Result<(), String> {
    let sql = format!(
        "--sql
            DELETE FROM installed_mods WHERE name = '{install_name}'
        "
    );

    app_handle.db(|conn| {
        conn.execute(&sql, ()).map_err(|e| e.to_string())?;
        Ok(())
    })
}

pub fn fetch_install(
    mod_id: i32,
    install_config_name: &String,
    app_handle: &AppHandle,
) -> Result<InstallConfig, String> {
    let sql = format!(
        "--sql
            SELECT * FROM installed_mods WHERE mod_id = {mod_id} AND name = '{install_config_name}'
        "
    );

    app_handle
        .db(|conn| {
            conn.query_row(&sql, (), |row| {
                Ok(InstallConfig {
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

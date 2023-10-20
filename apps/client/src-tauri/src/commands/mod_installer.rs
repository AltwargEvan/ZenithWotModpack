use std::{
    fs::{self},
    path::Path,
};

use crate::{
    db::{queries::fetch_installed_configs, state::ServiceAccess},
    types::{CachedMod, LocalInstallConfig},
    utils::{
        self,
        file::{copy_dir_all, copy_dir_wotmods},
    },
};
use rusqlite::named_params;
use tauri::AppHandle;

use super::config::detect_game_version;

#[tauri::command]
#[specta::specta]
pub fn get_installed_configs(app_handle: AppHandle) -> Result<Vec<LocalInstallConfig>, String> {
    fetch_installed_configs(&app_handle)
}

/// Compares the version of cached mod and requested mod.
/// When the version differs, download the provided version and update the cache
pub async fn validate_or_add_mod_to_cache(
    mod_data: &CachedMod,
    download_url: String,
    force_redownload: bool,
    app_handle: &AppHandle,
) -> Result<(), String> {
    // check current cache data and see if mod is already cached
    if !force_redownload {
        let fetch_cached_mod_sql = format!(
            "--sql
                SELECT * FROM mods_in_cache
                WHERE id = {0}
            ",
            mod_data.id
        );

        let cached_mod = app_handle.db(|conn| {
            conn.query_row(&fetch_cached_mod_sql, (), |row| {
                Ok(CachedMod {
                    id: row.get("id")?,
                    name: row.get("name")?,
                    mod_version: row.get("mod_version")?,
                    game_version: row.get("game_version")?,
                })
            })
        });

        match cached_mod {
            Ok(cached_mod) => {
                // mod already cached - return early
                if cached_mod.is_equal(mod_data) {
                    return Ok(());
                }
            }
            Err(e) => match e {
                // mod not found in cache, continue
                rusqlite::Error::QueryReturnedNoRows => (),
                // sql errror
                _ => return Err(e.to_string()),
            },
        }
    }

    // 1. download version from passed download_url
    let cache_dir = app_handle
        .path_resolver()
        .app_cache_dir()
        .expect("The app cache directory should exist.");

    fs::create_dir_all(&cache_dir).expect("The app cache directory should be created.");
    let destination = cache_dir.join(format!("mods\\{}", mod_data.id));

    // clean directory
    if destination.try_exists().unwrap_or(false) {
        let _ = fs::remove_dir_all(&destination);
    }
    let _ = fs::create_dir_all(&destination);

    utils::file::download_file(download_url, destination).await?;

    // 2. update db
    let update_mod_sql = "--sql
        INSERT OR REPLACE INTO mods_in_cache (id, game_version, mod_version, name)
        VALUES (:id, :game_version, :mod_version, :name)
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

#[tauri::command]
#[specta::specta]
pub async fn remove_mod_from_cache(
    mod_data: CachedMod,
    app_handle: AppHandle,
) -> Result<(), String> {
    // delete directory in cache
    let cache_dir = app_handle
        .path_resolver()
        .app_cache_dir()
        .expect("The app cache directory should exist.");

    let destination = cache_dir.join(format!("mods\\{}", mod_data.id));
    if destination.try_exists().unwrap_or(false) {
        let _ = fs::remove_dir_all(&destination);
    }

    // update db
    let sql = "--sql
        DELETE FROM mods WHERE id = ?1
    ";

    app_handle.db(|conn| {
        conn.execute(sql, [mod_data.id])
            .map_err(|e| e.to_string())?;
        Ok(())
    })
}

#[tauri::command]
#[specta::specta]
pub async fn install_mods(
    mod_data: CachedMod,
    install_configs: Vec<LocalInstallConfig>,
    download_url: String,
    app_handle: AppHandle,
) -> Result<(), String> {
    validate_or_add_mod_to_cache(&mod_data, download_url, false, &app_handle).await?;

    for install_config in install_configs {
        let game_version = detect_game_version(&install_config.game_directory, &app_handle)?;
        let game_dir = Path::new(install_config.game_directory.as_str());
        let mods_dir = game_dir.join(format!(
            "mods\\{game_version}\\{0} - {1}",
            mod_data.name, install_config.name
        )); // res mods have to be copied directly in or else shit breaks.
            // TODO - resolve res mods conflicts
        let res_mods_dir = game_dir.join(format!("res_mods\\{game_version}"));
        let config_dir = game_dir.join("mods\\configs");

        let cache_dir = app_handle
            .path_resolver()
            .app_cache_dir()
            .expect("The app cache directory should exist.")
            .join(format!("mods\\{}", mod_data.id));

        // Copy designed files from config to correct folder
        if let Some(mods_path) = &install_config.mods_path {
            let src = match !mods_path.is_empty() {
                true => cache_dir.clone(),
                false => cache_dir.join(mods_path),
            };

            println!("Mods src: {}", &src.to_str().unwrap());

            copy_dir_wotmods(src, mods_dir).map_err(|e| e.to_string())?;
        }
        if let Some(configs_path) = &install_config.configs_path {
            let src = cache_dir.join(configs_path);
            copy_dir_all(src, config_dir).map_err(|e| e.to_string())?;
        }
        if let Some(res_path) = &install_config.res_path {
            let src = cache_dir.join(res_path);
            copy_dir_all(src, res_mods_dir).map_err(|e| e.to_string())?;
        }

        // update local database
        let sql = "--sql
        INSERT OR REPLACE INTO installed_configs (id, mod_id, name, mods_path, res_path, configs_path, game_directory)
        VALUES (:id, :mod_id, :name, :mods_path, :res_path, :configs_path, :game_directory)
    ";

        let params = named_params! {
            ":id": install_config.id,
            ":mod_id": install_config.mod_id,
            ":name": install_config.name,
            ":mods_path": install_config.mods_path,
            ":res_path": install_config.res_path,
            ":configs_path": install_config.configs_path,
            ":game_directory": install_config.game_directory
        };

        app_handle.db(|conn| {
            return conn.execute(sql, params).map_err(|e| e.to_string());
        })?;
    }
    Ok(())
}

#[tauri::command]
#[specta::specta]
pub fn uninstall_mod(
    mod_data: CachedMod,
    install_config: LocalInstallConfig,
    app_handle: AppHandle,
) -> Result<(), String> {
    let game_version = detect_game_version(&install_config.game_directory, &app_handle)?;
    let game_dir = Path::new(install_config.game_directory.as_str());

    let mods_dir = game_dir.join(format!(
        "mods\\{game_version}\\{0} - {1}",
        mod_data.name, install_config.name
    ));

    // res mods have to be copied directly in or else shit breaks.
    // TODO - resolve res mods conflicts
    let res_mods_dir = game_dir.join(format!("res_mods\\{game_version}"));
    // TODO - config files need specific shit too
    let config_dir = game_dir.join("mods\\configs");

    // remove directories with installed mod
    if mods_dir.try_exists().unwrap_or(false) {
        let _ = fs::remove_dir_all(&mods_dir);
    }
    // temp solution purely for region changer
    if res_mods_dir.try_exists().unwrap_or(false) {
        let _ = fs::remove_dir_all(&res_mods_dir);
    }

    // update db
    let sql = format!(
        "--sql
            DELETE FROM installed_configs WHERE id = '{0}'
        ",
        install_config.id
    );

    app_handle.db(|conn| {
        conn.execute(&sql, ()).map_err(|e| e.to_string())?;
        Ok(())
    })
}

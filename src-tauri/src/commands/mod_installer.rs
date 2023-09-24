use std::{error::Error, fs, path::PathBuf};

use rusqlite::named_params;
use tauri::{api::path::cache_dir, AppHandle};

use crate::{
    db::{self, queries::fetch_mod},
    state::ServiceAccess,
    types::{InstallConfig, Mod},
};

#[tauri::command]
#[specta::specta]
pub async fn get_mod(mod_id: i32, app_handle: AppHandle) -> Result<Mod, String> {
    return db::queries::fetch_mod(mod_id, &app_handle).await;
}

pub async fn download(url: String, dest: PathBuf) -> Result<(), String> {
    todo!()
}

#[tauri::command]
#[specta::specta]
pub async fn cache_mod(
    mod_data: Mod,
    install_configs: Vec<InstallConfig>,
    download_url: String,
    app_handle: AppHandle,
) -> Result<(), String> {
    // check current cache data and see if mod is already cached
    let cached_mod_version = fetch_mod(mod_data.id, &app_handle).await?;

    // if installed, compare versions. if same do nothing
    if mod_data.is_equal(cached_mod_version) {
        return Ok(());
    }

    // if versions differ:
    // 1. download latest version from passed download_url
    let cache_directory = cache_dir().ok_or("The app cache directory should be exist.")?;
    fs::create_dir_all(&cache_directory).expect("The app cache directory should be created.");
    let download_dir = cache_directory.join(format!("/mods/{}", mod_data.name));

    // clean directory
    fs::remove_dir_all(&download_dir)
        .map_err(|e| format!("Failed to clean cache directory.\n{}", e.to_string()))?;
    fs::create_dir_all(&download_dir)
        .map_err(|e| format!("Failed to recreate cache directory.\n{}", e.to_string()))?;

    download(download_url, download_dir).await?;

    // 2. update mods table
    db::queries::update_mod(mod_data, &app_handle).await?;
    // 3. delete all install configs and create new ones with passed data

    todo!()
}

pub async fn install_mod(app_handle: AppHandle) {}

#[tauri::command]
#[specta::specta]
pub async fn cache_and_install_mod(
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

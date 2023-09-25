use std::fs;

use crate::{
    db,
    types::{InstallConfig, Mod},
    utils,
};
use tauri::AppHandle;

#[tauri::command]
#[specta::specta]
pub async fn get_install_state(mod_id: i32, app_handle: AppHandle) -> String {
    let cached = db::queries::fetch_mod(mod_id, &app_handle).await;
    if cached.is_err() {
        return "Not Installed".to_string();
    }
    let installed = db::queries::fetch_installed_mods(mod_id, &app_handle).await;
    if installed.is_ok_and(|res| res.len() > 0) {
        return "Installed".to_string();
    };

    return "Cached".to_string();
}

#[tauri::command]
#[specta::specta]
/// Compares the version of cached mod and requested mod.
/// When the version differs, download the provided version and update the cache
pub async fn cache_mod(
    mod_data: Mod,
    install_configs: Vec<InstallConfig>,
    download_url: String,
    app_handle: AppHandle,
) -> Result<(), String> {
    // check current cache data and see if mod is already cached
    match db::queries::fetch_mod(mod_data.id, &app_handle).await {
        // if installed, compare versions. if same do nothing
        Ok(cached_mod) => {
            if mod_data.is_equal(cached_mod) {
                return Ok(());
            }
        }
        Err(_) => (),
    }

    // if versions differ:
    // 1. download latest version from passed download_url
    let cache_dir = app_handle
        .path_resolver()
        .app_cache_dir()
        .expect("The app cache directory should exist.");

    fs::create_dir_all(&cache_dir).expect("The app cache directory should be created.");
    let destination = cache_dir.join(format!("mods\\{}", mod_data.name));

    // clean directory
    if destination.try_exists().unwrap_or(false) {
        let _ = fs::remove_dir_all(&destination);
    }
    let _ = fs::create_dir_all(&destination);

    utils::download::download_file(download_url, destination).await?;

    // 2. update db
    db::queries::update_mod(mod_data, install_configs, &app_handle).await?;
    Ok(())
}

#[tauri::command]
#[specta::specta]
pub async fn uncache_mod() {
    todo!()
}
#[tauri::command]
#[specta::specta]
pub async fn install_mod(
    mod_data: Mod,
    install_config: InstallConfig,
    app_handle: AppHandle,
) -> Result<(), String> {
    todo!()
}
#[tauri::command]
#[specta::specta]
pub async fn uninstall_mod(
    mod_data: Mod,
    install_config: InstallConfig,
    app_handle: AppHandle,
) -> Result<(), String> {
    todo!()
}

use std::{
    fs::{self},
    path::Path,
};

use crate::{
    db::{
        self,
        queries::{
            delete_install, fetch_cached_mods, fetch_install, fetch_installed_mods, fetch_mod,
            insert_installed_mod,
        },
    },
    types::{InstallConfig, Mod},
    utils::{self, file::copy_dir_all},
};
use tauri::AppHandle;

use super::config::detect_game_version;

#[tauri::command]
#[specta::specta]
pub async fn get_cached_mods(app_handle: AppHandle) -> Result<Vec<Mod>, String> {
    fetch_cached_mods(&app_handle)
}
#[tauri::command]
#[specta::specta]
pub async fn get_installed_mods(app_handle: AppHandle) -> Result<Vec<InstallConfig>, String> {
    fetch_installed_mods(&app_handle)
}

#[tauri::command]
#[specta::specta]
pub async fn get_install_state(
    mod_id: i32,
    app_handle: AppHandle,
) -> (String, Option<Mod>, Option<Vec<InstallConfig>>) {
    let cached = match db::queries::fetch_mod(mod_id, &app_handle) {
        Ok(res) => res,
        Err(err) => {
            println!("{}", err);
            return ("Not Installed".into(), None, None);
        }
    };

    match db::queries::fetch_installed_configs_for_mod(mod_id, &app_handle) {
        Ok(res) => {
            if res.len() > 0 {
                return ("Installed".into(), Some(cached), Some(res));
            }
        }
        Err(err) => println!("Failed to fetch install data {}", err),
    };
    return ("Cached".into(), Some(cached), None);
}

#[tauri::command]
#[specta::specta]
/// Compares the version of cached mod and requested mod.
/// When the version differs, download the provided version and update the cache
pub async fn cache_mod(
    mod_data: Mod,
    download_url: String,
    app_handle: AppHandle,
) -> Result<(), String> {
    // check current cache data and see if mod is already cached
    match db::queries::fetch_mod(mod_data.id, &app_handle) {
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

    utils::file::download_file(download_url, destination).await?;

    // 2. update db
    db::queries::update_mod(mod_data, &app_handle)?;
    Ok(())
}

#[tauri::command]
#[specta::specta]
pub async fn uncache_mod(mod_data: Mod, app_handle: AppHandle) -> Result<(), String> {
    // delete directory in cache
    let cache_dir = app_handle
        .path_resolver()
        .app_cache_dir()
        .expect("The app cache directory should exist.");

    let destination = cache_dir.join(format!("mods\\{}", mod_data.name));
    if destination.try_exists().unwrap_or(false) {
        let _ = fs::remove_dir_all(&destination);
    }

    // update db
    db::queries::delete_mod(mod_data, &app_handle)
}

#[tauri::command]
#[specta::specta]
pub async fn install_mod(
    mod_data: Mod,
    install_config: InstallConfig,
    app_handle: AppHandle,
) -> Result<(), String> {
    if db::queries::fetch_mod(mod_data.id, &app_handle).is_err() {
        return Err("Requested mod is not stored in cache".into());
    }
    let game_version = detect_game_version(&app_handle)?;
    let game_dir = Path::new(&install_config.game_directory);
    let mods_dir = game_dir.join(format!(
        "mods\\{game_version}\\{0}\\{1}",
        mod_data.name, install_config.name
    ));
    let res_mods_dir = game_dir.join(format!(
        "res_mods\\{game_version}\\{0}\\{1}",
        mod_data.name, install_config.name
    ));
    let config_dir = game_dir.join("mods\\configs");

    let cache_dir = app_handle
        .path_resolver()
        .app_cache_dir()
        .expect("The app cache directory should exist.")
        .join(format!("mods\\{}", mod_data.name));

    if let Some(mods_path) = &install_config.mods_path {
        let src = cache_dir.join(mods_path);
        copy_dir_all(src, mods_dir).map_err(|e| e.to_string())?;
    }
    if let Some(configs_path) = &install_config.configs_path {
        let src = cache_dir.join(configs_path);
        copy_dir_all(src, config_dir).map_err(|e| e.to_string())?;
    }
    if let Some(res_path) = &install_config.res_path {
        let src = cache_dir.join(res_path);
        copy_dir_all(src, res_mods_dir).map_err(|e| e.to_string())?;
    }
    insert_installed_mod(install_config, &app_handle)?;
    Ok(())
}

#[tauri::command]
#[specta::specta]
pub async fn uninstall_mod(
    mod_id: i32,
    install_config_name: String,
    app_handle: AppHandle,
) -> Result<(), String> {
    let mod_data = fetch_mod(mod_id, &app_handle)?;
    let install_config = fetch_install(mod_id, &install_config_name, &app_handle)?;
    let game_version = detect_game_version(&app_handle)?;
    let game_dir = Path::new(&install_config.game_directory);
    let mods_dir = game_dir.join(format!("mods\\{game_version}\\{0}", mod_data.name));
    let res_mods_dir = game_dir.join(format!(
        "res_mods\\{game_version}\\{0}\\{1}",
        mod_data.name, install_config.name
    ));

    // remove directories with installed mod
    if mods_dir.try_exists().unwrap_or(false) {
        let _ = fs::remove_dir_all(&mods_dir);
    }
    if res_mods_dir.try_exists().unwrap_or(false) {
        let _ = fs::remove_dir_all(&res_mods_dir);
    }

    // update db
    delete_install(install_config_name, &app_handle)?;

    Ok(())
}

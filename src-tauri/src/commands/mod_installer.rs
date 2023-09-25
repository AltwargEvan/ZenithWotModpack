use std::{
    fs,
    path::{Path, PathBuf},
};

use crate::{
    db::{self, queries::fetch_mod},
    types::{InstallConfig, Mod},
};
use tauri::api::http::{ClientBuilder, HttpRequestBuilder, ResponseType};
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

async fn download(target: String, dest: PathBuf) -> Result<(), String> {
    // download to memory
    let client = ClientBuilder::new().max_redirections(3).build().unwrap();
    let request = HttpRequestBuilder::new("GET", &target)
        .map_err(|e| e.to_string())?
        .response_type(ResponseType::Binary);

    let response = client.send(request).await.map_err(|e| e.to_string())?;
    let content = response.bytes().await.map_err(|e| e.to_string())?.data;

    // write to destination
    let remote_target_path = Path::new(&target);
    let file_name = remote_target_path
        .file_name()
        .ok_or("Target URL doesn't provide a filename")?;
    let dest_file_path = dest.join(&file_name);
    fs::write(&dest_file_path, content).map_err(|e| e.to_string())?;
    // unzip if zip
    if remote_target_path.extension().unwrap() == "zip" {
        zip_extensions::zip_extract(&dest_file_path, &dest).map_err(|e| e.to_string())?;
        fs::remove_file(dest_file_path).map_err(|e| e.to_string())?;
    }
    Ok(())
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
    match fetch_mod(mod_data.id, &app_handle).await {
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

    download(download_url, destination).await?;

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

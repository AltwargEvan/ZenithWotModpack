use tauri_plugin_oauth::start_with_config;

#[tauri::command]
#[specta::specta]
pub async fn oauth_start() {
    start_with_config(config, handler)
}

pub async fn oauth_cancel() {}

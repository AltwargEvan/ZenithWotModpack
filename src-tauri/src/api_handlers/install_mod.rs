use crate::utils::{download_file::download_file, game_modification::GameModification};

#[tauri::command]
pub async fn install_mod(
    game_dir: String,
    mod_id: usize,
    mod_files_root: Option<String>,
) -> String {
    let default_root = String::from("/");
    let mod_file_root_calc = mod_files_root.unwrap_or(default_root);

    GameModification::builder()
        .wargaming_mod_id(mod_id)
        .downloaded_mod_file_root(mod_file_root_calc)
        .download()
        .await;

    format!("res")
}

use crate::wot_modification::WotModification;

#[tauri::command]
pub fn install_mod(game_dir: &str, mod_id: usize, mod_files_root: &str) -> String {
    WotModification::new()
        .wargaming_mod_id(mod_id)
        .downloaded_mod_file_root(String::from(mod_files_root))
        .download()
        .install(String::from(game_dir));

    return String::from("output string go here");
}

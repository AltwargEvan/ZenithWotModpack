use crate::wot_modification::WotModification;

#[tauri::command]
pub fn install_mod(game_dir: &str, mod_id: usize, mod_files_root: Option<&str>) -> String {
    let default_root: &str = "/";
    let mod_file_root_calc: &str = mod_files_root.unwrap_or(default_root);

    WotModification::new()
        .wargaming_mod_id(mod_id)
        .downloaded_mod_file_root(mod_file_root_calc)
        .download()
        .install(String::from(game_dir));

    return String::from("output string go here");
}

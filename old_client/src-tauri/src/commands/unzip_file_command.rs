use std::path::PathBuf;
use zip_extensions::*;

#[tauri::command]
pub fn unzip_file(file_path: &str, target_dir: &str) -> String {
    let archive_file = PathBuf::from(file_path);
    let target_path = PathBuf::from(target_dir);
    let _ = zip_extract(&archive_file, &target_path);
    format!("unzip success")
}

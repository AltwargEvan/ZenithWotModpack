use std::{env, process::Command};
#[tauri::command]
#[specta::specta]
pub fn open_file_explorer(filepath: &str) {
    let _ = match env::consts::OS {
        "macos" => {
            let args = ["-R", filepath];
            Command::new("open")
                .args(args)
                .spawn()
                .map_err(|e| e.to_string())
        }
        "windows" => {
            let args = ["/select", filepath];
            Command::new("explorer")
                .args(args)
                .spawn()
                .map_err(|e| e.to_string())
        }

        _ => Err("OS not supported. This command only works on windows or macos".to_string()),
    };
}

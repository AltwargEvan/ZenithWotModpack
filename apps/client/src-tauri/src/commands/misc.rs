use std::{env, process::Command};

#[tauri::command]
#[specta::specta]
pub fn open_file_explorer(filepath: String) -> Result<(), String> {
    let command = match env::consts::OS {
        "macos" => "open",
        "windows" => "explorer",
        "linux" => "xdg-open",
        _ => "",
    };

    if command.is_empty() {
        return Err(
            "OS not supported. This command only works on windows, macos, or linux".to_string(),
        );
    }

    Command::new(command)
        .arg(filepath)
        .spawn()
        .map_err(|e| e.to_string())?;
    Ok(())
}

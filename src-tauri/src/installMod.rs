
// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
pub fn installMod(gamedir: &str, modid: usize) -> String {
    format!("Hello, You've been greeted from Rust!")
}

use serde::{Deserialize, Serialize};
use specta::Type;

#[derive(Serialize, Deserialize, Type)]
pub struct Config {
    pub game_directory: Option<String>,
}

#[derive(Serialize, Deserialize, Type)]
pub struct Mod {
    pub id: i32,
    pub wg_mods_id: i32,
    pub name: String,
    pub mod_version: String,
    pub game_version: String,
    pub thumbnail_url: String,
}

#[derive(Serialize, Deserialize, Type)]
pub struct InstallConfig {
    pub id: i32,
    pub mod_id: i32,
    pub mods_path: Option<String>,
    pub res_path: Option<String>,
    pub configs_path: Option<String>,
    pub name: Option<String>,
}

pub struct InstalledMod {
    install_config_id: i32,
    mod_id: i32,
    installed_at: String,
}

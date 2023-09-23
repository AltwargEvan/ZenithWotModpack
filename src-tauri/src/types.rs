use serde::{Deserialize, Serialize};
use specta::Type;

#[derive(Serialize, Deserialize, Type)]
pub struct Config {
    pub game_directory: Option<String>,
}

#[derive(Serialize, Deserialize, Type)]
pub struct Mod {
    pub id: u32,
    pub wg_mods_id: u32,
    pub name: String,
    pub mod_version: String,
    pub game_version: String,
    pub thumbnail_url: String,
}

#[derive(Serialize, Deserialize, Type)]
pub struct InstallConfig {
    pub id: u32,
    pub mod_id: u32,
    pub mods_path: String,
    pub res_path: String,
    pub configs_path: String,
}

pub struct InstalledMod {
    install_config_id: u32,
    mod_id: u32,
    installed_at: String,
}

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

impl Mod {
    pub fn is_equal(&self, other: Mod) -> bool {
        self.id == other.id
            && self.game_version == other.game_version
            && self.mod_version == other.mod_version
    }
}

#[derive(Serialize, Deserialize, Type)]
pub struct InstallConfig {
    /// Primary key
    pub name: String,
    pub mod_id: i32,
    pub mods_path: Option<String>,
    pub res_path: Option<String>,
    pub configs_path: Option<String>,
    pub game_directory: String,
}


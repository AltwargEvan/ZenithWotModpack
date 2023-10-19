use serde::{Deserialize, Serialize};
use specta::Type;

#[derive(Serialize, Deserialize, Type)]
pub struct Config {
    pub game_directory: Option<String>,
}

#[derive(Serialize, Deserialize, Type)]
pub struct CachedMod {
    pub id: i32,
    pub name: String,
    pub mod_version: String,
    pub game_version: String,
}

impl CachedMod {
    pub fn is_equal(&self, other: CachedMod) -> bool {
        self.id == other.id
            && self.game_version == other.game_version
            && self.mod_version == other.mod_version
    }
}

#[derive(Serialize, Deserialize, Type)]
pub struct InstallConfig {
    /// Primary key
    pub id: i32,
    pub mod_id: i32,
    pub name: String,
    pub mods_path: Option<String>,
    pub res_path: Option<String>,
    pub configs_path: Option<String>,
    pub game_directory: String,
}

#[derive(Serialize, Deserialize, Type)]
pub struct InstalledConfig {
    pub config_id: i32,
    pub game_directory: String,
}

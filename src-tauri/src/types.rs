use serde::{Deserialize, Serialize};
use specta::Type;

#[derive(Serialize, Type)]
pub struct Config {
    pub game_directory: Option<String>,
}

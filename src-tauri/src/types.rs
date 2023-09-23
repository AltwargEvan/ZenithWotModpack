use serde::{Deserialize, Serialize};
use specta::Type;

#[derive(Serialize, Deserialize, Type)]
pub struct Config {
    pub game_directory: Option<String>,
}

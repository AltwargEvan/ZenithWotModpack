// this uses the builder pattern. i love coding woooo
// https://doc.rust-lang.org/1.0.0/style/ownership/builders.html

use super::download_file::download_file;
use std::fs::File;

pub struct GameModification {
    name: Option<String>,
    wargaming_mod_id: Option<usize>,
    download_link: Option<String>,
    downloaded_mod_file_root: Option<String>,
    downloaded_mod: Option<File>,
}

impl GameModification {
    pub fn builder() -> GameModification {
        GameModification {
            name: None,
            wargaming_mod_id: None,
            download_link: None,
            downloaded_mod_file_root: None,
            downloaded_mod: None,
        }
    }

    pub fn name<'a>(&'a mut self, name: String) -> &'a mut GameModification {
        self.name = Some(name);
        self
    }

    pub fn wargaming_mod_id<'a>(&'a mut self, id: usize) -> &'a mut GameModification {
        self.wargaming_mod_id = Some(id);
        self.download_link = Some(format!("https://wgmods.net/api/mods/download/mod/{}/", id));
        self
    }

    pub fn download_link<'a>(&'a mut self, download_link: String) -> &'a mut GameModification {
        self.download_link = Some(download_link);
        self
    }

    pub fn downloaded_mod_file_root<'a>(
        &'a mut self,
        downloaded_mod_file_root: String,
    ) -> &'a mut GameModification {
        self.download_link = Some(downloaded_mod_file_root.to_string());
        self
    }

    pub async fn download<'a>(&'a mut self) -> &'a mut GameModification {
        // let target = format!("https://www.rust-lang.org/logos/rust-logo-512x512.png");
        let target = self.download_link.clone();
        let res = download_file(target.expect("No Download Link Generated")).await;
        self
    }

    pub fn install<'a>(&'a mut self, game_dir: String) {}
}

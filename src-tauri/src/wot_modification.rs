// this uses the builder pattern. i love coding woooo
// https://doc.rust-lang.org/1.0.0/style/ownership/builders.html

pub struct WotModification {
    name: Option<String>,
    wargaming_mod_id: Option<usize>,
    download_link: Option<String>,
    downloaded_mod_file_root: Option<String>,
    downloaded_mod: Option<String>,
}

impl WotModification {
    pub fn new() -> WotModification {
        WotModification {
            name: None,
            wargaming_mod_id: None,
            download_link: None,
            downloaded_mod_file_root: None,
            downloaded_mod: None,
        }
    }

    pub fn name<'a>(&'a mut self, name: String) -> &'a mut WotModification {
        self.name = Some(name);
        self
    }

    pub fn wargaming_mod_id<'a>(&'a mut self, id: usize) -> &'a mut WotModification {
        self.wargaming_mod_id = Some(id);
        self
    }

    pub fn download_link<'a>(&'a mut self, download_link: String) -> &'a mut WotModification {
        self.download_link = Some(download_link);
        self
    }

    pub fn downloaded_mod_file_root<'a>(
        &'a mut self,
        downloaded_mod_file_root: &str,
    ) -> &'a mut WotModification {
        self.download_link = Some(downloaded_mod_file_root.to_string());
        self
    }

    pub fn download<'a>(&'a mut self) -> &'a mut WotModification {
        // fetch mod
        self
    }

    pub fn install<'a>(&'a mut self, game_dir: String) {}
}

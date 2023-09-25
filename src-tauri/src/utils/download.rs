use std::{
    fs,
    path::{Path, PathBuf},
};

use tauri::api::http::{ClientBuilder, HttpRequestBuilder, ResponseType};

pub async fn download_file(target: String, dest: PathBuf) -> Result<(), String> {
    // download to memory
    let client = ClientBuilder::new().max_redirections(3).build().unwrap();
    let request = HttpRequestBuilder::new("GET", &target)
        .map_err(|e| e.to_string())?
        .response_type(ResponseType::Binary);

    let response = client.send(request).await.map_err(|e| e.to_string())?;
    let content = response.bytes().await.map_err(|e| e.to_string())?.data;

    // write to destination
    let remote_target_path = Path::new(&target);
    let file_name = remote_target_path
        .file_name()
        .ok_or("Target URL doesn't provide a filename")?;
    let dest_file_path = dest.join(&file_name);
    fs::write(&dest_file_path, content).map_err(|e| e.to_string())?;
    // unzip if zip
    if remote_target_path.extension().unwrap() == "zip" {
        zip_extensions::zip_extract(&dest_file_path, &dest).map_err(|e| e.to_string())?;
        fs::remove_file(dest_file_path).map_err(|e| e.to_string())?;
    }
    Ok(())
}

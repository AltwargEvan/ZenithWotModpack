use std::fs;

use rusqlite::Connection;
use tauri::AppHandle;

use super::migrations;

const CURRENT_DB_VERSION: u32 = 1;

/// Initializes the database connection, creating the .sqlite file if needed, and upgrading the database
/// if it's out of date.
pub fn initialize_database(app_handle: &AppHandle) -> Result<Connection, rusqlite::Error> {
    let app_dir = app_handle
        .path_resolver()
        .app_data_dir()
        .expect("The app data directory should exist.");
    fs::create_dir_all(&app_dir).expect("The app data directory should be created.");
    let sqlite_path = app_dir.join("data.sqlite");

    let mut db = Connection::open(sqlite_path)?;

    let mut user_pragma = db.prepare("PRAGMA user_version")?;
    let mut existing_user_version: u32 = user_pragma.query_row([], |row| Ok(row.get(0)?))?;
    drop(user_pragma);
    // Upgrades the database to the current version.
    while existing_user_version < CURRENT_DB_VERSION {
        db.pragma_update(None, "journal_mode", "WAL")?;

        let tx = db.transaction()?;
        tx.pragma_update(None, "user_version", existing_user_version + 1)?;

        match existing_user_version {
            0 => migrations::v0::v0(&tx)?,
            _ => (),
        }
        tx.commit()?;

        existing_user_version += 1;
    }

    Ok(db)
}

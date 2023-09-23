// https://github.com/RandomEngy/tauri-sqlite/blob/main/src-tauri/src/state.rs this template
use rusqlite::{types::Null, Connection};
use std::fs;
use tauri::AppHandle;

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
    let existing_user_version: u32 = user_pragma.query_row([], |row| Ok(row.get(0)?))?;
    drop(user_pragma);

    upgrade_database_if_needed(&mut db, existing_user_version)?;

    Ok(db)
}

/// Upgrades the database to the current version.
pub fn upgrade_database_if_needed(
    db: &mut Connection,
    existing_version: u32,
) -> Result<(), rusqlite::Error> {
    let mut version = existing_version;
    while version < CURRENT_DB_VERSION {
        println!("Current DB Version: {}", version);
        match version {
            0 => v0(db)?,
            _ => (),
        }
        version += 1;
    }

    Ok(())
}

pub fn v0(db: &mut Connection) -> Result<(), rusqlite::Error> {
    db.pragma_update(None, "journal_mode", "WAL")?;

    let tx = db.transaction()?;

    tx.pragma_update(None, "user_version", 1)?;
    // create tables
    tx.execute_batch(
        "CREATE TABLE config (
            id INTEGER NOT NULL UNIQUE,
            game_directory TEXT
        );

        CREATE TABLE mods (
            id INTEGER NOT NULL UNIQUE,
            wg_mods_id INTEGER NOT NULL UNIQUE,
            name TEXT NOT NULL,
            mod_version TEXT NOT NULL,
            game_version TEXT NOT NULL,
            thumbnail_url TEXT NOT NULL,
            PRIMARY KEY(id)
        );

        CREATE TABLE install_configs (
            id INTEGER NOT NULL UNIQUE,
            mod_id INTEGER NOT NULL,
            mods_path TEXT,
            res_path TEXT,
            configs_path TEXT,
            PRIMARY KEY(id)
        );

        CREATE TABLE installed_mods (
            install_config_id INTEGER NOT NULL UNIQUE,
            mod_id INTEGER NOT NULL UNIQUE,
            installed_at TEXT NOT NULL,
            PRIMARY KEY(install_config_id, mod_id)
        )
        ",
    )?;

    // seed config table. config should be at id=1
    tx.execute(
        "INSERT INTO config (id, game_directory) VALUES (?1, ?2)",
        (1, Null),
    )?;

    tx.commit()?;
    Ok(())
}

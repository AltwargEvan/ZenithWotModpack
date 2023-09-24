use rusqlite::{types::Null, Transaction};

pub fn v0(tx: &Transaction) -> Result<(), rusqlite::Error> {
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

    Ok(())
}

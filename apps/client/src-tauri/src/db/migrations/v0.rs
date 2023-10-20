use rusqlite::{types::Null, Transaction};

pub fn v0(tx: &Transaction) -> Result<(), rusqlite::Error> {
    // create tables
    tx.execute_batch(
        "--sql
        CREATE TABLE config (
            id INTEGER NOT NULL UNIQUE,
            game_directory TEXT
        );

        CREATE TABLE mods_in_cache (
            id INTEGER NOT NULL UNIQUE,
            name TEXT NOT NULL,
            mod_version TEXT NOT NULL,
            game_version TEXT NOT NULL,
            PRIMARY KEY(id)
        );

        CREATE TABLE installed_configs (
            id INTEGER NOT NULL UNIQUE,
            mod_id INTEGER NOT NULL,
            name TEXT NOT NULL,
            mods_path TEXT,
            res_path TEXT,
            configs_path TEXT,
            game_directory TEXT NOT NULL,
            PRIMARY KEY(id)
        );
        ",
    )?;

    // seed config table. config should be at id=1
    tx.execute(
        "INSERT INTO config (id, game_directory) VALUES (?1, ?2)",
        (1, Null),
    )?;

    Ok(())
}

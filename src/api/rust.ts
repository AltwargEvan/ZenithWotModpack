/* eslint-disable */
// This file was generated by [tauri-specta](https://github.com/oscartbeaumont/tauri-specta). Do not edit this file manually.

declare global {
    interface Window {
        __TAURI_INVOKE__<T>(cmd: string, args?: Record<string, unknown>): Promise<T>;
    }
}

// Function avoids 'window not defined' in SSR
const invoke = () => window.__TAURI_INVOKE__;

export function getConfig() {
    return invoke()<Config>("get_config")
}

export function setGameDirectory(gameDirectory: string) {
    return invoke()<null>("set_game_directory", { gameDirectory })
}

export function detectGameDirectories() {
    return invoke()<string[]>("detect_game_directories")
}

export function detectGameVersion() {
    return invoke()<string>("detect_game_version")
}

export function getMod(modId: number) {
    return invoke()<Mod | null>("get_mod", { modId })
}

/**
 * Compares the version of cached mod and requested mod.
 * When the version differs, download the provided version and update the cache
 */
export function cacheMod(modData: Mod, installConfigs: InstallConfig[], downloadUrl: string) {
    return invoke()<null>("cache_mod", { modData,installConfigs,downloadUrl })
}

export type InstallConfig = { id: number; mod_id: number; mods_path: string | null; res_path: string | null; configs_path: string | null; name: string | null }
export type Mod = { id: number; wg_mods_id: number; name: string; mod_version: string; game_version: string; thumbnail_url: string }
export type Config = { game_directory: string | null }

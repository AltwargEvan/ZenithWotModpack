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

export function getGameVersion() {
    return invoke()<string>("get_game_version")
}

export function getInstallState(modId: number) {
    return invoke()<[string, CachedMod | null, InstallConfig[] | null]>("get_install_state", { modId })
}

/**
 * Compares the version of cached mod and requested mod.
 * When the version differs, download the provided version and update the cache
 */
export function cacheMod(modData: CachedMod, downloadUrl: string) {
    return invoke()<null>("cache_mod", { modData,downloadUrl })
}

export function installMod(modData: CachedMod, installConfig: InstallConfig) {
    return invoke()<null>("install_mod", { modData,installConfig })
}

export function uninstallMod(modId: number, installConfigName: string) {
    return invoke()<null>("uninstall_mod", { modId,installConfigName })
}

export function uncacheMod(modData: CachedMod) {
    return invoke()<null>("uncache_mod", { modData })
}

export function getCachedMods() {
    return invoke()<CachedMod[]>("get_cached_mods")
}

export function getInstalledMods() {
    return invoke()<InstallConfig[]>("get_installed_mods")
}

export type CachedMod = { id: number; name: string; mod_version: string; game_version: string }
export type Config = { game_directory: string | null }
export type InstallConfig = { id: number; mod_id: number; name: string; mods_path: string | null; res_path: string | null; configs_path: string | null; game_directory: string }

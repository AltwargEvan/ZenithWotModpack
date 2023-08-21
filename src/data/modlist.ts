import { Mod } from "../modInstaller/mod";
import { ModBuilder } from "../modInstaller/modbuilder";

const TomatoGG = new ModBuilder()
  .category("Tools")
  .name("Tomato.gg")
  .wgModsId(6391)
  .downloadUrl(
    "https://modp.wgcdn.co/media/mod_files/tomatogg-1.4.1_j4KLlAJ.zip"
  )
  .thumbnailUrl(
    "https://wgmods.net/media/mod_files/%D0%91%D0%B5%D0%B7%D1%8B%D0%BC%D1%8F%D0%BD%D0%BD%D1%8B%D0%B9_kz4p13R.png.302x170_q85_crop_detail_replace_alpha-white.jpg"
  )
  .downloadModsFolderPath("manual-install")
  .build();

const DispersionReticle = new ModBuilder()
  .name("Dispersion Reticle (+ Server reticles & Reticle size)")
  .downloadUrl(
    "https://modp.wgcdn.co/media/mod_files/DispersionReticle_miflLiv.wotmod"
  )
  .wgModsId(5251)
  .thumbnailUrl(
    "https://wgmods.net/media/mod_files/logo_pcaF2q7.png.302x170_q85_crop_detail_replace_alpha-white.jpg"
  )
  .category("Reticle")
  .build();

// const ReplayManager = {
//   name: "Replay Manager",
//   downloadUrl:
//     "https://modp.wgcdn.co/media/mod_files/1.21.1.1_ReplaysManager_3.7.6.zip",
//   wargamingId: 22,
//   type: "zipped",
//   thumbnailUrl:
//     "https://wgmods.net/media/%D0%91%D0%B5%D0%B7%D1%8B%D0%BC%D1%8F%D0%BD%D0%BD%D1%8B%D0%B9.png.302x170_q85_crop_detail_replace_alpha-white.jpg",
//   internalWotModsDirectoryLocation: `/mods/${GAME_VERSION}`,
//   category: "Tools",
// } satisfies Mod;

// const BattleHits = {
//   name: "Battle Hits",
//   downloadUrl:
//     "https://modp.wgcdn.co/media/mod_files/1.21.1.1_BattleHits_1.9.0.zip",
//   wargamingId: 5912,
//   type: "zipped",
//   thumbnailUrl:
//     "https://wgmods.net/media/mod_files/25_bPfRgjH.png.302x170_q85_crop_detail_replace_alpha-white.jpg",
//   internalWotModsDirectoryLocation: `/mods/${GAME_VERSION}`,
//   category: "Tools",
// } satisfies Mod;

// const MarkOfExcellenceLebwa = {
//   name: "Marks Of Excellence Calculator By Lebwa",
//   downloadUrl:
//     "https://modp.wgcdn.co/media/mod_files/3MoE_mod_Lebwa_cnqaiuh.zip",
//   wargamingId: 6273,
//   type: "zipped",
//   internalWotModsDirectoryLocation: "",
//   thumbnailUrl:
//     "https://wgmods.net/media/mod_files/pobrane.jpeg.302x170_q85_crop_detail_replace_alpha-white.jpg",
//   category: "Mark Of Excellence",
// } satisfies Mod;

// const ShowEquipInBattle = {
//   name: "Show Current Equipment In Battle",
//   downloadUrl:
//     "https://modp.wgcdn.co/media/mod_files/kurzdor.battleequipment_2.0.3.zip",
//   type: "zipped",
//   internalWotModsDirectoryLocation: `/mods/${GAME_VERSION}`,
//   internalConfigsDirectoryLocation: `/configs/${GAME_VERSION}`,
//   wargamingId: 5895,
//   category: "Tools",
//   thumbnailUrl:
//     "https://wgmods.net/media/mod_files/battleequipment.png.302x170_q85_crop_detail_replace_alpha-white.jpg",
// } satisfies Mod;

// CUSTOM MODS NEED MORE TOOLING TODO
// https://wgmods.net/4513/ sky remover. has multiple options for wotmod in seperate folders
// https://wotbaza.com/mods-wot/276-extended-zoom-mod-for-world-of-tanks from another site
// https://wgmods.net/50/ PMOD. install is simple. large config file that is mostly what matters for why you would install

export const ModList = [TomatoGG, DispersionReticle] as const;

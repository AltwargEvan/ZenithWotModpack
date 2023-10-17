import { InstallConfig, Mod, cacheMod, installMod, useMods } from "@/api";
import { useState } from "react";
// import { Menu, MenuItem } from "@mui/material";
// import { ThreeDotsVertical } from "@/assets/ThreeDotsVertical";
import { LoadingSpinner } from "@/assets/LoadingSpinner";
import { useConfig } from "@/stores/configStore";
import { useNavigate } from "react-router-dom";

export const InstallButton = ({ modIds }: { modIds: Array<number> }) => {
  const allModsResult = useMods();
  const [loading, setLoading] = useState(false);
  const [installed, setInstalled] = useState(false);
  const gameDirectory = useConfig((ctx) => ctx.game_directory);
  const navigate = useNavigate();

  async function handleCacheAndInstall() {
    try {
      if (loading) return;
      setLoading(true);

      let promises = new Array<Promise<unknown>>();
      allModsResult.forEach((res) => {
        if (res.data && modIds.includes(res.data.internal.id)) {
          const mod = res.data;
          const modData: Mod = {
            id: mod.internal.id,
            wg_mods_id: mod.internal.wgModsId,
            name: mod.internal.name,
            mod_version: mod.versions[0].version,
            game_version: mod.versions[0].game_version.version,
            thumbnail_url: mod.cover,
          };
          const installConfigs: Array<InstallConfig> =
            mod.internal.installConfig.map((cfg) => {
              const formattedCfg: InstallConfig = {
                name: cfg.name,
                mod_id: mod.internal.id,
                mods_path: cfg.modsPath || null,
                res_path: cfg.resPath || null,
                configs_path: cfg.configsPath || null,
                game_directory: gameDirectory,
              };
              return formattedCfg;
            });
          const promise = new Promise(async (resolve) => {
            await cacheMod(modData, mod.versions[0].download_url);
            await installMod(modData, installConfigs[0]);
            resolve(null);
          });
          promises.push(promise);
        }
      });
      await Promise.all(promises).catch(console.error);
      setInstalled(true);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  // const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  // const open = Boolean(anchorEl);

  // const handleOpenDropdown = (event: React.MouseEvent<HTMLElement>) => {
  //   if (!loading) setAnchorEl(event.currentTarget);
  // };

  // const handleCloseDropdown = () => {
  //   setAnchorEl(null);
  // };

  return (
    <div className="bg-neutral-500 flex h-8 rounded overflow-visible">
      <button
        className="flex justify-center items-center min-w-[8rem] max-w-[8rem] rounded bg-neutral-50 text-black hover:bg-neutral-200"
        onClick={() => {
          if (installed) navigate("/yourMods");
          else handleCacheAndInstall();
        }}
      >
        {(() => {
          if (loading) return <LoadingSpinner style={{ height: "20px" }} />;
          if (!installed) return "Install";
          return "Installed";
        })()}
      </button>
      {/* <button
        onClick={handleOpenDropdown}
        className=" bg-neutral-50 text-black hover:bg-neutral-200 flex flex-col items-center justify-center rounded-r"
        style={{
          width: "20px",
        }}
      >
        <ThreeDotsVertical />
      </button>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleCloseDropdown}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        sx={{
          "& .MuiMenu-paper": { backgroundColor: "#fafafa" },
          "& .MuiList-padding": { paddingY: "4px" },
        }}
      >
        <MenuItem
          onClick={() => {
            handleCloseDropdown();
          }}
          disableRipple
          className="hover:bg-neutral-500 h-6 text-black font-oswald font-base text-sm"
        >
          Clean Install
        </MenuItem>
      </Menu> */}
    </div>
  );
};

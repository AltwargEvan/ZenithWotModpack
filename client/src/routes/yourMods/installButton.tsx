import { useQuery } from "@tanstack/react-query";
import {
  InstallConfig,
  Mod,
  cacheMod,
  getInstallState,
  installMod,
  uncacheMod,
  uninstallMod,
} from "@/api";
import { useState } from "react";
import { fetchWGModResult } from "@/api/client/fetchWargamingMods";
import { Menu, MenuItem } from "@mui/material";
import { ThreeDotsVertical } from "@/assets/ThreeDotsVertical";
import { twMerge } from "tailwind-merge";
import { LoadingSpinner } from "@/assets/LoadingSpinner";
import { useConfig } from "@/stores/configStore";

export const InstallButton = ({
  mod,
  refetchCache,
}: {
  mod: fetchWGModResult;
  refetchCache: () => Promise<unknown>;
}) => {
  //dropdown
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleOpenDropdown = (event: React.MouseEvent<HTMLElement>) => {
    if (!loading && installState) setAnchorEl(event.currentTarget);
  };
  const handleCloseDropdown = () => {
    setAnchorEl(null);
  };

  // install state
  const { data: installStateData, refetch: refetchInstallState } = useQuery({
    queryKey: ["installData", mod.internal.id],
    queryFn: async () => getInstallState(mod.internal.id),
    retry: false,
  });
  const [loading, setLoading] = useState(false);
  const gameDirectory = useConfig((ctx) => ctx.game_directory);

  const installState = installStateData ? installStateData[0] : "Loading";

  if (
    installState !== "Cached" &&
    installState !== "Installed" &&
    installState !== "Loading"
  )
    return null;

  const modData: Mod = {
    id: mod.internal.id,
    wg_mods_id: mod.id,
    name: mod.internal.name,
    mod_version: mod.versions[0].version,
    game_version: mod.versions[0].game_version.version,
    thumbnail_url: mod.cover,
  };

  const installConfigs: Array<InstallConfig> = mod.internal.installConfig.map(
    (cfg) => {
      const formattedCfg: InstallConfig = {
        name: cfg.name,
        mod_id: mod.internal.id,
        mods_path: cfg.modsPath || null,
        res_path: cfg.resPath || null,
        configs_path: cfg.configsPath || null,
        game_directory: gameDirectory,
      };
      return formattedCfg;
    }
  );

  const style = (() => {
    const updateAvailable = (() => {
      if (!installStateData) return false;
      const mod = installStateData[1];
      if (!mod) return false;
      return (
        mod.game_version !== modData.game_version ||
        mod.mod_version !== mod.mod_version
      );
    })();

    switch (installState) {
      case "Cached": {
        if (updateAvailable) {
          return {
            color: "bg-yellow-300 text-black",
            hover: "hover:bg-yellow-400",
            content: "Update Available",
            action: handleCache,
          };
        } else
          return {
            color: "bg-yellow-300  text-black",
            hover: "hover:bg-yellow-400",
            content: "Install",
            action: handleInstall,
          };
      }

      case "Installed": {
        if (updateAvailable) {
          return {
            color: "bg-yellow-300 text-black ",
            hover: "hover:bg-yellow-400",
            content: "Update Available",
            action: handleCacheAndInstall,
          };
        } else
          return {
            color: "bg-green-500",
            hover: "hover:bg-green-600",
            content: "Uninstall",
            action: handleUninstall,
          };
      }
    }
  })();

  async function handleInstall() {
    try {
      if (loading) return;
      setLoading(true);
      await installMod(modData, installConfigs[0]);
      await refetchInstallState();
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  async function handleUninstall() {
    try {
      if (loading) return;
      setLoading(true);
      await uninstallMod(modData.id, installConfigs[0].name);
      await refetchInstallState();
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  async function handleCache() {
    try {
      if (loading) return;
      setLoading(true);
      await cacheMod(modData, mod.versions[0].download_url);
      await refetchInstallState();
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  async function handleCacheAndInstall() {
    try {
      if (loading) return;
      setLoading(true);
      await cacheMod(modData, mod.versions[0].download_url);
      await installMod(modData, installConfigs[0]);
      await refetchInstallState();
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  async function handleUncache() {
    try {
      if (loading) return;
      setLoading(true);
      await uncacheMod(modData);
      await refetchCache();
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  async function handleUncacheAndUninstall() {
    try {
      if (loading) return;
      setLoading(true);
      await uninstallMod(modData.id, installConfigs[0].name);
      await uncacheMod(modData);
      await refetchCache();
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  if (!style) return null;

  return (
    <div className="bg-neutral-500 flex h-8 rounded overflow-visible">
      <button
        className={twMerge(
          style.color,
          style.hover,
          "flex justify-center items-center min-w-[8rem] max-w-[8rem] rounded-l"
        )}
        onClick={style.action}
      >
        {loading ? (
          <LoadingSpinner style={{ height: "20px" }} />
        ) : (
          style.content
        )}
      </button>
      <button
        onClick={handleOpenDropdown}
        className={twMerge(
          style.color,
          style.hover,
          "flex flex-col items-center justify-center rounded-r"
        )}
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
          "& .MuiMenu-paper": { backgroundColor: "#525252" },
          "& .MuiList-padding": { paddingY: "4px" },
        }}
      >
        <MenuItem
          onClick={() => {
            handleCloseDropdown();
            if (installState === "Installed") {
              handleUncacheAndUninstall();
            } else {
              handleUncache();
            }
          }}
          disableRipple
          className="hover:bg-neutral-500 h-6 text-white font-oswald font-base text-sm"
        >
          Remove from your mods
        </MenuItem>
      </Menu>
    </div>
  );
};

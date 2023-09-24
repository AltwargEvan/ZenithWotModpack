import { useLayout } from "@/stores/rootLayoutStore";
import { Link } from "@tanstack/react-router";
import Carousel from "react-material-ui-carousel";
import { Paper } from "@mui/material";
import fetchWGMod from "@/api/client/fetchWargamingMods";
import { Category } from "../home";
import { ArrowLeft } from "@/assets/ArrowLeft";
import { useMutation, useQuery } from "@tanstack/react-query";
import { InstallConfig, Mod, cacheMod, getMod } from "@/api";
import { CheckLarge } from "@/assets/CheckLarge";

export function ModPageInner({
  mod,
}: {
  mod: NonNullable<Awaited<ReturnType<typeof fetchWGMod>>>;
}) {
  useLayout(mod.internal.name, mod.cover);

  const localization =
    mod.localizations.find((item) => item.lang.code === "en") ||
    mod.localizations[0];

  const { data: modFromDB, refetch: refetchModFromDB } = useQuery({
    queryKey: ["installData", mod.id],
    queryFn: async () => getMod(mod.id),
  });

  const modInUserMods = !!modFromDB;

  const { mutate, isLoading, isSuccess } = useMutation({
    mutationFn: async () => {
      if (isLoading || modFromDB || isSuccess) return;
      const modData: Mod = {
        id: mod.internal.id,
        wg_mods_id: mod.id,
        name: mod.internal.name,
        mod_version: mod.versions[0].version,
        game_version: mod.versions[0].game_version.version,
        thumbnail_url: mod.cover,
      };
      const installConfigs: Array<InstallConfig> =
        mod.internal.installConfig.map((cfg) => {
          const formattedCfg: InstallConfig = {
            id: 0,
            mod_id: mod.id,
            mods_path: cfg.modsPath || null,
            res_path: cfg.resPath || null,
            configs_path: cfg.configsPath || null,
            name: cfg.name,
          };
          return formattedCfg;
        });
      await cacheMod(modData, installConfigs, mod.versions[0].download_url);
      await refetchModFromDB();
    },
  });

  const handleAddMod: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault();
    mutate();
  };
  return (
    <div>
      <div className="h-24 flex flex-col space-y-2 px-3">
        <Link to="/">
          <div className="flex items-center text-gray-300 hover:text-white">
            <ArrowLeft />
            <span className="font-thin px-2 w-fit ">To Home Page</span>
          </div>
        </Link>
        <div className="flex justify-between items-center">
          <div className="flex space-x-2">
            <span>Categories:</span>
            <Link
              to="/"
              search={{
                category: mod.internal.category as Category,
              }}
            >
              <span className="font-thin bg-neutral-600 px-2 rounded w-fit hover:bg-neutral-500 select-none hover:cursor-pointer">
                {mod.internal.category}
              </span>
            </Link>
            <span className="pl-2">Uploaded by:</span>
            <span className="text-yellow-300">{mod.owner.spa_username}</span>
          </div>
          {!modInUserMods && (
            <button
              onClick={handleAddMod}
              className="p-1 px-2 rounded bg-yellow-300 hover:bg-yellow-400 text-black"
            >
              Add to Your Mods
            </button>
          )}
          {modInUserMods && (
            <Link to="/yourMods">
              <button className="p-1 px-2 rounded bg-green-400 hover:bg-green-500 text-black flex items-center">
                Added
                <CheckLarge />
              </button>
            </Link>
          )}
        </div>
      </div>

      <div
        className="px-3 overflow-y-auto"
        style={{
          maxHeight: "calc(100vh - 210px)",
        }}
      >
        <span className="text-xl">Mod Description</span>
        <div
          className="font-thin py-4 text-neutral-200"
          dangerouslySetInnerHTML={{
            __html: localization.description.replace(
              /href/g,
              "target='_blank' href"
            ),
          }}
        ></div>
        {mod.screenshots.length > 0 && (
          <Carousel
            autoPlay={false}
            indicators
            swipe
            cycleNavigation
            navButtonsAlwaysVisible
            fullHeightHover
            animation="slide"
            duration={400}
          >
            {mod.screenshots.map((ss) => (
              <Paper
                className="flex justify-center bg-neutral-900 w-full"
                key={ss.id}
              >
                <div className=" max-w-4xl lg:py-4">
                  <img src={ss.source} className="h-96" />
                </div>
              </Paper>
            ))}
          </Carousel>
        )}
      </div>
    </div>
  );
}

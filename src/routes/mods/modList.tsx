import { fetchMods } from "../../api/fetchMods";
import { DownloadIcon } from "../../assets/DownloadIcon";
import { CheckIcon } from "../../assets/CheckIcon";
import { RemoveIcon } from "../../assets/RemoveIcon";
import { useModRouteStore } from "./modRouteStore";
import { ModBuilder } from "../../modInstaller/modbuilder";

const ModItem = ({
  mod,
}: {
  mod: Awaited<ReturnType<typeof fetchMods>>[number];
}) => {
  const modClass = new ModBuilder()
    .category(mod.category)
    .downloadUrl(mod.downloadUrl)
    .name(mod.name)
    .thumbnailUrl(mod.thumbnailUrl)
    .version(mod.downloadVersion)
    .wgModsId(mod.wgModsId)
    .build();

  const gameDir =
    localStorage.getItem("gameDir") || "C:\\Games\\World_of_Tanks_NA";
  const handleInstall = async () => {
    await modClass.download();
    if (!gameDir) throw "No Game Dir Set";
    await modClass.install(gameDir);
  };

  const handleUninstall = async () => {
    await modClass.uninstallAndRemoveFromCache(gameDir);
  };

  return (
    <div className="relative bg-secondary-400 h-56  m-2 flex  items-center rounded-lg flex-col overflow-hidden border-white border hover:ring ring-primary-300 hover:border-primary-300">
      <div
        style={{
          backgroundImage: `url(${mod.thumbnailUrl})`,
        }}
        className="h-36 bg-blue-500 w-full bg-contain shadow-lg bg-center"
      />

      <div className="flex w-full px-2 pt-1 h-20 justify-start flex-col">
        <span className="h-6 overflow-hidden">{mod.name}</span>
        <span className="font-thin pr-1">Created By {mod.createdBy}</span>
        <span className="font-thin pr-1">for {mod.downloadVersion}</span>
      </div>
      <div className="absolute right-1 bottom-1 h-6 w-6 hover:cursor-pointer">
        {/* check if mod is installed */}
        {false ? (
          <div className="group" onClick={handleUninstall}>
            <CheckIcon />
            <RemoveIcon />
          </div>
        ) : (
          <div onClick={handleInstall}>
            <DownloadIcon />
          </div>
        )}
      </div>
    </div>
  );
};

const ModList = ({ mods }: { mods: Awaited<ReturnType<typeof fetchMods>> }) => {
  const category = useModRouteStore((ctx) => ctx.category);
  return (
    <div className="grid lg:grid-cols-5 grid-cols-3 mt-5 overflow-y-scroll">
      {mods
        .filter((mod) => category === "All Mods" || mod.category === category)
        .map((mod) => {
          return <ModItem mod={mod} />;
        })}
    </div>
  );
};

export default ModList;

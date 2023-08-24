import { DownloadIcon } from "../../assets/AddIcon";
import { CheckIcon } from "../../assets/CheckIcon";
import { RemoveIcon } from "../../assets/RemoveIcon";
import { useModRouteStore } from "./modRouteStore";
import { Mod, ModType } from "../../features/modInstaller/mod";
import { useModInstallState } from "../../features/data/installState";
import { useState } from "react";

const ModItem = ({ modData }: { modData: ModType }) => {
  const [hovered, setHovered] = useState(false);
  const [loading, setLoading] = useState(false);
  const mod = new Mod(modData);
  const showInstalled = useModRouteStore((ctx) => ctx.showInstalled);
  // determine install state
  const gameInstalls = useModInstallState((ctx) => ctx.gameInstalls);
  let modState: "Installed" | "NotInstalled" | "Update";
  const stateData = gameInstalls.get(mod.id);
  if (!stateData) modState = "NotInstalled";
  else if (
    stateData.gameversion !== modData.gameversion ||
    modData.modversion !== mod.modversion
  )
    modState = "Update";
  else modState = "Installed";

  if (!showInstalled && modState === "Installed") return null;

  const gameDir = "C:\\Games\\World_of_Tanks_NA";
  const handleInstall = async () => {
    setLoading(true);
    if (!gameDir) throw "No Game Dir Set";
    await mod.downloadToCache();
    await mod.install(gameDir);
    setLoading(false);
  };

  const handleUninstall = async () => {
    setLoading(true);
    await mod.uninstall(gameDir);
    setLoading(false);
  };

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative bg-secondary-400 h-56  m-2 flex  items-center rounded-lg flex-col overflow-hidden border-white border hover:ring ring-primary-300 hover:border-primary-300"
    >
      <div
        style={{
          backgroundImage: `url(${mod.thumbnailUrl})`,
        }}
        className="h-36 bg-blue-500 w-full bg-contain shadow-lg bg-center"
      />

      <div className="flex w-full px-2 pt-1 h-20 justify-start flex-col text-sm">
        <span className="overflow-hidden text-sm">{mod.name}</span>
        <span className="font-thin pr-1">Created By {mod.createdBy}</span>
        <span className="font-thin pr-1">
          Version {mod.modversion} for {mod.gameversion}
        </span>
      </div>
      {loading && (
        <div className="absolute right-0 bottom-0 h-8 w-8 hover:cursor-wait">
          <svg
            aria-hidden="true"
            className="w-6 h-6 text-primary-200 animate-spin  fill-primary-500 mr-0 mb-0"
            viewBox="0 0 100 101"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
              fill="currentColor"
            />
            <path
              d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
              fill="currentFill"
            />
          </svg>
        </div>
      )}
      {!loading && (
        <div className="absolute right-1 bottom-1 h-8 w-8 hover:cursor-pointer">
          {/* check if mod is installed */}
          {modState === "Installed" && (
            <div className="group" onClick={handleUninstall}>
              <CheckIcon />
              <RemoveIcon className="group-hover:flex hidden  hover:animate-pulse" />
            </div>
          )}
          {modState === "NotInstalled" && (
            <div
              onClick={handleInstall}
              className="transition-opacity duration-500"
              style={{
                opacity: hovered ? 1 : 0,
              }}
            >
              <DownloadIcon />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const ModList = ({ mods }: { mods: Array<ModType> }) => {
  const category = useModRouteStore((ctx) => ctx.category);
  console.log(
    mods.filter((mod) => {
      console.log(mod.category, mod.category === "Mark of Excellence");
    })
  );
  return (
    <div className="grid lg:grid-cols-5 grid-cols-3 mt-5 overflow-y-scroll">
      {mods
        .filter(
          (mod) =>
            category === "All Mods" ||
            mod.category.toLowerCase() === category.toLowerCase()
        )
        .map((mod) => {
          return <ModItem modData={mod} key={mod.id} />;
        })}
    </div>
  );
};

export default ModList;

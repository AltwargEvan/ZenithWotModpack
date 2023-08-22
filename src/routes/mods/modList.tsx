import { fetchMods } from "../../api/fetchMods";
import { DownloadIcon } from "../../assets/DownloadIcon";
import { CheckIcon } from "../../assets/CheckIcon";
import { RemoveIcon } from "../../assets/RemoveIcon";
import { useModRouteStore } from "./modRouteStore";

const ModList = ({ mods }: { mods: Awaited<ReturnType<typeof fetchMods>> }) => {
  const category = useModRouteStore((ctx) => ctx.category);
  const currentlyInstalled = new Array<number>();
  return (
    <div className="grid lg:grid-cols-5 grid-cols-3 mt-5 overflow-y-scroll">
      {mods
        .filter((mod) => category === "All Mods" || mod.category === category)
        .map((mod) => {
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
                <span className="font-thin pr-1">
                  Created By {mod.createdBy}
                </span>
                <span className="font-thin pr-1">
                  for {mod.downloadVersion}
                </span>
              </div>
              <div className="absolute right-1 bottom-1 h-6 w-6 hover:cursor-pointer">
                {!currentlyInstalled.includes(mod.id) ? (
                  <div className="group">
                    <CheckIcon />
                    <RemoveIcon />
                  </div>
                ) : (
                  <div>
                    <DownloadIcon />
                  </div>
                )}
              </div>
            </div>
          );
        })}
    </div>
  );
};

export default ModList;

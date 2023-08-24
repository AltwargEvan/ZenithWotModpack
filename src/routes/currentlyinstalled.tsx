import { useNavigate } from "@tanstack/react-router";
import { RemoveIcon } from "../assets/RemoveIcon";
import { useModInstallState } from "../features/data/installState";
import { Mod } from "../features/modInstaller/mod";

const CurrentlyInstalledPage = () => {
  const navigate = useNavigate();
  const installed = useModInstallState((ctx) => ctx.gameInstalls);
  const gameDir = localStorage.getItem("gameDir");

  return (
    <div className="flex p-4 flex-col w-full">
      <div className="w-full mb-4">
        <span className="text-3xl font-bold">Currently Installed</span>
      </div>
      <hr className="border-secondary-100 p-2"></hr>
      <div className="flex flex-col space-y-2 overflow-y-scroll">
        {Array.from(installed).map((item) => {
          const mod = new Mod(item[1]);
          const handleUninstall = async () => {
            if (!gameDir) return;
            await mod.uninstall(gameDir);
          };
          return (
            <div className="w-full p-3 bg-secondary-500 rounded grid-cols-2 justify-between grid align-middle">
              <div className="flex items-center">
                <img
                  src={mod.thumbnailUrl}
                  className="h-10 pt-1 mr-2 rounded"
                />
                <div className="inline-block align-middle">
                  <span className="inline-block  align-middle">{mod.name}</span>
                  <span className="font-thin text-xs flex">
                    Created By {mod.createdBy}. v{mod.modversion} for{" "}
                    {mod.gameversion}
                  </span>
                </div>
              </div>
              <div className="flex justify-end items-center">
                <div className="h-7 w-7" onClick={handleUninstall}>
                  <RemoveIcon className="hover:animate-pulse hover:cursor-pointer" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CurrentlyInstalledPage;

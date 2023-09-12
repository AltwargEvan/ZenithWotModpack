import { useState } from "react";

import { useSheetsDBMods } from "../api/fetchMods";
import { useRouteTitle } from "../stores/pageTitleStore";
import { TabButton } from "../components/TabButton";
import { BoxesIcon } from "../assets/BoxesIcon";
import { ModType } from "../features/mod";
import { Wrench } from "../assets/Wrench";
import { Crosshair } from "../assets/Crosshair";
import { Star } from "../assets/Star";
import { SDCard } from "../assets/SDCard";
import { useProfileStore } from "../stores/profileStore";
import { Download } from "../assets/Download";
import { CircularProgress } from "@mui/material";
import { useModInstallState } from "../stores/modInstallStateStore";

const CurrentlyInstalledTab = () => {
  return <div></div>;
};
const ModItem = ({ mod }: { mod: ModType }) => {
  const [installing, setInstalling] = useState(false);
  const install = useModInstallState((ctx) => ctx.install);
  async function handleInstall() {
    setInstalling(true);
    try {
      await install(mod);
    } catch (e) {
      console.error(e);
    }
    setInstalling(false);
  }
  return (
    <div className="relative rounded-xl overflow-hidden bg-neutral-700 hover:ring-1 ring-offset-2 ring-offset-transparent ring-neutral-400 hover:scale-105 transition-all group">
      <div
        style={{
          backgroundImage: `url(${mod.thumbnailUrl})`,
        }}
        className="h-36 bg-blue-500 w-full bg-contain shadow-lg bg-center"
      />
      <div className="p-1 px-2">
        <div className="h-6 overflow-hidden text-ellipsis font-bold break-all">
          {mod.name}
        </div>
        <div className="font-light text-xs h-4 overflow-hidden text-ellipsis break-all">
          Created By {mod.createdBy}
        </div>
        <div className="font-light text-xs h-4 overflow-hidden text-ellipsis break-all">
          Version {mod.modversion} for {mod.gameversion}
        </div>
      </div>
      {!installing && (
        <div
          className="group-hover:block absolute hidden z-10 right-2 bottom-2 hover:cursor-pointer"
          onClick={handleInstall}
        >
          <Download className="h-5 w-5" />
        </div>
      )}
      {installing && (
        <div className="absolute z-10 right-2 bottom-1">
          <CircularProgress size={20} />
        </div>
      )}
    </div>
  );
};

const HomePage = () => {
  useRouteTitle("Home");
  const [tab, setTab] = useState<
    | "All Mods"
    | "Tools"
    | "Reticle"
    | "Mark of Excellence"
    | "Currently Installed"
  >("All Mods");

  const { data: mods, error } = useSheetsDBMods();
  const activeProfile = useProfileStore((ctx) => ctx.activeProfile);
  const modsFiltered = () => {
    switch (tab) {
      case "All Mods":
        return mods;
      case "Tools":
      case "Reticle":
      case "Mark of Excellence":
        return mods?.filter(
          (mod) =>
            mod.category.toLowerCase().includes(tab.toLowerCase()) &&
            !activeProfile?.mods.find(
              (installedMod) => installedMod.id === mod.id
            )
        );
      case "Currently Installed":
        return activeProfile?.mods || [];
    }
  };
  return (
    <div>
      <div className="flex">
        <div className="flex space-x-2 select-none">
          <TabButton
            selected={tab === "All Mods"}
            onClick={() => setTab("All Mods")}
          >
            <BoxesIcon />
            <span className="font-medium text-sm">All Mods</span>
          </TabButton>
          <TabButton selected={tab === "Tools"} onClick={() => setTab("Tools")}>
            <Wrench />
            <span className="font-medium text-sm">Tools</span>
          </TabButton>
          <TabButton
            selected={tab === "Reticle"}
            onClick={() => setTab("Reticle")}
          >
            <Crosshair className="fill-white" />
            <span className="font-medium text-sm">Reticle</span>
          </TabButton>
          <TabButton
            selected={tab === "Mark of Excellence"}
            onClick={() => setTab("Mark of Excellence")}
          >
            <Star />
            <span className="font-medium text-sm">Mark of Excellence</span>
          </TabButton>
          <TabButton
            selected={tab === "Currently Installed"}
            onClick={() => setTab("Currently Installed")}
          >
            <SDCard />
            <span className="font-medium text-sm">Currently Installed</span>
          </TabButton>
        </div>
      </div>
      <div className="grid grid-cols-4 gap-4 pt-3 lg:grid-cols-5 xl:grid-cols-4 2xl:grid-cols-5">
        {Boolean(error) && <div>Failed To Fetch Mod List</div>}
        {tab !== "Currently Installed" &&
          modsFiltered()?.map((mod) => <ModItem mod={mod} key={mod.id} />)}
        {tab === "Currently Installed" && <CurrentlyInstalledTab />}
      </div>
    </div>
  );
};

export default HomePage;

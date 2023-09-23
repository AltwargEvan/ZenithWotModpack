import { useMemo, useState } from "react";
import { useMods } from "../api/useMods";
import { useRouteTitle } from "../stores/pageTitleStore";
import { TabButton } from "../components/TabButton";
import { BoxesIcon } from "../assets/BoxesIcon";
import { Wrench } from "../assets/Wrench";
import { Crosshair } from "../assets/Crosshair";
import { Star } from "../assets/Star";
import { SDCard } from "../assets/SDCard";
import { Download } from "../assets/Download";
import { CircularProgress } from "@mui/material";
import { useModInstallState } from "../stores/modInstallStateStore";
import { RemoveIcon } from "../assets/RemoveIcon";
import { InstallData, compareInstallData } from "../features/mod";
import { Link } from "@tanstack/react-router";

// const ModItem = ({
//   mod,
//   currentlyInstalled,
// }: {
//   mod: Awaited<ReturnType<typeof fetchMods>>[number];
//   currentlyInstalled: boolean;
// }) => {
//   const install = useModInstallState((ctx) => ctx.install);
//   const currentlyInstalling = useModInstallState(
//     (ctx) => ctx.currentlyInstalling
//   );
//   const [activeProfile, updateProfile] = useProfileStore((ctx) => [
//     ctx.activeProfile,
//     ctx.updateProfile,
//   ]);
//   const uninstall = useModInstallState((ctx) => ctx.uninstall);

//   const name =
//     mod.wgData.localizations.find((item) => item.lang.code === "en")?.title ||
//     mod.dbData.name;
//   const installData: InstallData = {
//     name: name,
//     wgModsId: mod.dbData.wgModsId,
//     id: mod.dbData.id,
//     installConfig: mod.dbData.installConfig,
//     installConfigIndices: [0],
//     version: mod.wgData.versions[0].version,
//     gameVersion: mod.wgData.versions[0].game_version.version,
//     downloadUrl: mod.wgData.versions[0].download_url,
//   };
//   const installing = Boolean(
//     currentlyInstalling.find((item) => compareInstallData(item, installData))
//   );
//   async function handleInstall() {
//     try {
//       if (!activeProfile)
//         throw new Error("Failed to install. No active profile set.");
//       await install(installData);
//       const newProfile = structuredClone(activeProfile);
//       newProfile.mods = newProfile.mods.concat(installData);
//       await updateProfile(newProfile);
//     } catch (e) {
//       console.error(e);
//     }
//   }

//   async function handleUninstall() {
//     try {
//       if (!activeProfile)
//         throw new Error("Failed to install. No active profile set.");
//       await uninstall(installData);
//       await updateProfile({
//         ...activeProfile,
//         mods: activeProfile.mods.filter((x) => x.id !== installData.id),
//       });
//     } catch (e) {
//       console.error(e);
//     }
//   }
//   return (
//     <Link to="/">
//     </Link>
//     <div  className="h-54 relative rounded-xl overflow-visible bg-neutral-700 hover:ring-1 ring-offset-2 ring-offset-transparent ring-neutral-400 hover:scale-105 transition-all group">
//       <div
//         style={{
//           backgroundImage: `url(${mod.wgData.cover})`,
//         }}
//         className="h-36 bg-blue-500 w-full bg-contain shadow-lg bg-center overflow-hidden rounded-t-xl"
//       />
//       <div className="p-1 px-2">
//         <div className="h-6 overflow-hidden text-ellipsis font-bold break-all">
//           {name}
//         </div>
//         <div
//           className="font-light text-xs h-4 overflow-hidden text-ellipsis break-all"
//           style={{
//             maxWidth: "85%",
//           }}
//         >
//           Created By {mod.wgData.owner.spa_username}
//         </div>
//         <div
//           className="font-light text-xs h-4 overflow-hidden text-ellipsis break-all"
//           style={{
//             maxWidth: "85%",
//           }}
//         >
//           Version {mod.wgData.versions[0].version} for{" "}
//           {mod.wgData.versions[0].game_version.version}
//         </div>
//       </div>
//       {!currentlyInstalled && (
//         <>
//           {!installing && (
//             <div
//               className="group-hover:block absolute hidden z-10 right-2 bottom-2 hover:cursor-pointer"
//               onClick={handleInstall}
//             >
//               <Download className="h-5 w-5" />
//             </div>
//           )}
//           {installing && (
//             <div className="absolute z-10 right-2 bottom-1">
//               <CircularProgress size={20} />
//             </div>
//           )}
//         </>
//       )}
//       {currentlyInstalled && (
//         <>
//           {!installing && (
//             <div
//               className="group-hover:block absolute hidden z-10 right-2 bottom-2 hover:cursor-pointer"
//               onClick={handleUninstall}
//             >
//               <RemoveIcon className="h-5 w-5 fill-red-500" />
//             </div>
//           )}
//           {installing && (
//             <div className="absolute z-10 right-2 bottom-1">
//               <CircularProgress size={20} />
//             </div>
//           )}
//         </>
//       )}
//     </div>
//   );
// };

const HomePage = () => {
  useRouteTitle("Home");
  const [tab, setTab] = useState<
    | "All Mods"
    | "Tools"
    | "Reticle"
    | "Mark of Excellence"
    | "Currently Installed"
  >("All Mods");
  const results = useMods();
  const mods = results.map((res) => res.data);

  // const activeProfile = useProfileStore((ctx) => ctx.activeProfile);
  const modsFiltered = useMemo(() => {
    return mods;
    switch (tab) {
      case "All Mods":
      // return mods?.filter(
      //   (mod) =>
      //     !activeProfile?.mods.find(
      //       (installedMod) => installedMod.id === mod?.db.id
      //     )
      // );
      case "Tools":
      case "Reticle":
      case "Mark of Excellence":
      // return mods?.filter(
      //   (mod) =>
      //     mod?.db.category.toLowerCase().includes(tab.toLowerCase()) &&
      //     !activeProfile?.mods.find(
      //       (installedMod) => installedMod.id === mod?.db.id
      //     )
      // );
      case "Currently Installed":
      // return mods?.filter((mod) =>
      //   activeProfile?.mods.find(
      //     (installedMod) => installedMod.id === mod?.db.id
      //   )
      // );
    }
  }, [tab]);

  return (
    <div>
      <div className="flex pb-3">
        <div className="flex space-x-2 select-none px-3">
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
      {mods.length === 0 && <div>Failed To Fetch Mod List</div>}
      <div
        style={{
          maxHeight: "calc(100vh - 138px)",
        }}
        className="grid grid-cols-4 gap-4 pt-2 px-3 pb-6 lg:grid-cols-5 xl:grid-cols-4 2xl:grid-cols-5 w-full overflow-y-auto"
      >
        {/* {modsFiltered?.map((mod) => (
          <ModItem
            mod={mod}
            key={mod.db.id}
            currentlyInstalled={tab === "Currently Installed"}
          />
        ))} */}
      </div>
    </div>
  );
};

export default HomePage;

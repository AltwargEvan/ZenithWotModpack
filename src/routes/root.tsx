import { Outlet } from "@tanstack/react-router";
import Navbar from "../layouts/Navbar";
import { useEffect, useState } from "react";
import TitleBar from "../layouts/Titlebar";
import { usePageTitleStore } from "../stores/pageTitleStore";

import { initProfileStore } from "../stores/profileStore";
import { initSettingsStore } from "../stores/settingsStore";
import { PhysicalSize, appWindow } from "@tauri-apps/api/window";
import { initializeModInstallState } from "../stores/modInstallStateStore";

const App = () => {
  const routeTitle = usePageTitleStore();

  return (
    <div className="border-neutral-600 border h-screen w-screen overflow-hidden font-oswald">
      <TitleBar />
      <Navbar />
      <div
        className="bg-gradient-to-bl from-neutral-900/90    to-neutral-950 border-t fixed  grow flex w-full text-white bprder-r-px border-neutral-600 "
        style={{
          height: "calc(100% - 2.25rem - 1px)",
          width: "calc(100% - 4rem - 1px)",
          left: "4rem",
          top: "2.25rem",
        }}
      >
        <div className="flex  xl:mx-32 p-4 w-full flex-col">
          <div className="h-12 pb-4">
            <span className="text-3xl font-bold">{routeTitle}</span>
          </div>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

const AppLoading = () => {
  return (
    <div className="border-neutral-600 border h-screen w-screen overflow-hidden">
      <TitleBar />
    </div>
  );
};

const Root = () => {
  const [loadState, setLoadState] = useState<"Idle" | "Loading" | "Loaded">(
    "Idle"
  );

  useEffect(() => {
    if (loadState === "Idle") {
      setLoadState("Loading");
      Promise.allSettled([
        initProfileStore(),
        initializeModInstallState(),
        initSettingsStore(),
        appWindow.setMinSize(new PhysicalSize(800, 600)),
      ])
        .catch(console.error)
        .finally(() => setLoadState("Loaded"));
    }
  }, []);

  if (loadState !== "Loaded") return <AppLoading />;
  return <App />;
};

export default Root;

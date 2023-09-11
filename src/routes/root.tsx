import { Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import Navbar from "../layouts/Navbar";
import { useEffect, useState } from "react";
import { useModInstallState } from "../features/data/installState";
import TitleBar from "../layouts/Titlebar";
import { usePageTitleStore } from "../stores/pageTitleStore";
import { useLocalKVStore } from "../stores/localKeyValueStore";

import Profile from "../features/profile";
import { initProfileStore } from "../stores/profileStore";

const App = () => {
  const routeTitle = usePageTitleStore();

  return (
    <div className="border-neutral-600 border h-screen w-screen overflow-hidden">
      <TitleBar />
      <Navbar />
      <div
        className="bg-gradient-to-b from-neutral-800   via-neutral-900 via-50%  to-neutral-950 border-t fixed  grow flex w-full text-white bprder-r-px border-neutral-600 "
        style={{
          height: "calc(100% - 2.25rem - 1px)",
          width: "calc(100% - 4rem - 1px)",
          left: "4rem",
          top: "2.25rem",
        }}
      >
        <div className="flex overflow-scroll xl:ml-32 xl:mr-32 p-4 w-full flex-col">
          <div className="h-12">
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
  const [loading, setLoading] = useState(true);
  const initializeInstallStateStore = useModInstallState(
    (ctx) => ctx.initialize
  );

  useEffect(() => {
    Promise.allSettled([initProfileStore(), initializeInstallStateStore()])
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <AppLoading />;
  return <App />;
};

export default Root;

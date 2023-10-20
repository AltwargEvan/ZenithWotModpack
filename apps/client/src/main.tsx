import React, { Suspense } from "react";
import ReactDOM from "react-dom/client";
import routes from "~react-pages";
import {
  Navigate,
  Outlet,
  RouterProvider,
  createBrowserRouter,
} from "react-router-dom";
import { QueryClientProvider, useQuery } from "@tanstack/react-query";
import TitleBar from "@/layouts/Titlebar";
import Navbar from "@/layouts/Navbar";
import useSupabaseAuth from "./lib/supabase/supabaseContext";
import { queryClient } from "./lib/utils/queryClient";
import "./styles/globals.css";
import { Settings } from "./lib/settingsManager/settingsManager";
import { InnerAppProviders } from "./lib/AppProviders";
import { Toaster } from "./components/ui/toaster";
import { getConfig, getInstalledConfigs } from "./api/rust";
localStorage.setItem("theme", "dark");

const AppOuter = () => {
  useSupabaseAuth();

  return (
    <QueryClientProvider client={queryClient}>
      <Toaster />
      <div className="border-neutral-600 border h-screen w-screen font-oswald bg-gradient-to-bl from-neutral-900/90 to-neutral-950 text-white">
        <TitleBar />
        <Outlet />
      </div>
    </QueryClientProvider>
  );
};
const InitialSetup = () => {
  return "TODO";
};

const AppInner = () => {
  const {
    data: config,
    error: configError,
    isLoading: configIsLoading,
  } = useQuery({
    queryFn: getConfig,
    queryKey: ["config"],
  });
  const {
    data: installedConfigs,
    error: installedConfigsError,
    isLoading: installedConfigsIsLoading,
  } = useQuery({
    queryFn: getInstalledConfigs,
    queryKey: ["installedConfigs"],
  });

  if (configIsLoading || installedConfigsIsLoading) return "Loading...";

  // TODO - implement initial bootstrap
  // const UserBootstrapComplete = !!config?.game_directory;
  // if (!UserBootstrapComplete) return <InitialSetup />;

  const userSettings: Settings = {
    gameDirectory: "C:\\Games\\World_of_Tanks_NA",
    automaticModUpdatesOnLaunchEnabled: false,
  };
  if (!installedConfigs) return <div>Failed to fetch user configs</div>;
  return (
    <InnerAppProviders
      userSettings={userSettings}
      installConfigs={installedConfigs}
    >
      <Navbar />

      <div
        className="border-t fixed grow flex w-full  bprder-r-px border-neutral-600 "
        style={{
          height: "calc(100% - 2.25rem - 1px)",
          width: "calc(100% - 4.5rem)",
          left: "4.5rem",
          top: "2.25rem",
        }}
      >
        <div className="flex xl:px-24 px-4 pb-4  w-full flex-col">
          <Suspense>
            <Outlet />
          </Suspense>
        </div>
      </div>
    </InnerAppProviders>
  );
};

const router = createBrowserRouter([
  {
    element: <AppOuter />,
    children: [
      {
        path: "/",
        element: <AppInner />,
        children: [
          ...routes,
          {
            element: <Navigate to="mods" replace={true} />,
            path: "/",
          },
          {
            // error handling route
            element: <div>This page doesn't exist!</div>,
            path: "*",
          },
        ],
        errorElement: "fuck",
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

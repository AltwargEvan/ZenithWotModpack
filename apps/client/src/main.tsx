import React, { Suspense } from "react";
import ReactDOM from "react-dom/client";
import routes from "~react-pages";
import {
  Navigate,
  Outlet,
  RouterProvider,
  createBrowserRouter,
} from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import TitleBar from "@/layouts/Titlebar";
import Navbar from "@/layouts/Navbar";
import useSupabaseAuth from "./lib/supabase/supabaseContext";
import { queryClient } from "./lib/utils/queryClient";
import "./styles/globals.css";
import { ModManagerContextProvider } from "./lib/modManager/modManagerContext";
import { SettingsManagerContextProvider } from "./lib/settingsManager/settingsManagerContext";
import { Settings } from "./lib/settingsManager/settingsManager";
import { InnerAppProviders } from "./lib/AppProviders";
import { Toaster } from "./components/ui/toaster";
localStorage.setItem("theme", "dark");

const AppOuter = () => {
  useSupabaseAuth();

  return (
    <QueryClientProvider client={queryClient}>
      <Toaster />
      <div className="border-neutral-600 border h-screen w-screen font-oswald bg-gradient-to-bl from-neutral-900/90 to-neutral-950 text-white">
        <TitleBar />
        <Navbar />
        <Outlet />
      </div>
    </QueryClientProvider>
  );
};
const InitialSetup = () => {
  return "TODO";
};

const AppInner = () => {
  const UserBootstrapComplete = true;

  if (!UserBootstrapComplete) return <InitialSetup />;

  // TODO - implement initial bootstrap
  const userSettings: Settings = {
    gameDirectory: "C:\\Games\\World_of_Tanks_NA",
    automaticModUpdatesOnLaunchEnabled: false,
  };

  return (
    <InnerAppProviders userSettings={userSettings}>
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

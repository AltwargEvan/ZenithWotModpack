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
import { queryClient } from "./api/queryClient";
import "./globals.css";
localStorage.setItem("theme", "dark");

const AppOuter = () => {
  useSupabaseAuth();

  return (
    <QueryClientProvider client={queryClient}>
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
  return (
    <div
      className="border-t fixed grow flex w-full  bprder-r-px border-neutral-600 "
      style={{
        height: "calc(100% - 2.25rem - 1px)",
        width: "calc(100% - 4.5rem - 1px)",
        left: "5rem",
        top: "2.25rem",
      }}
    >
      <div className="flex xl:px-24 p-3 w-full flex-col">
        <Suspense>
          <Outlet />
        </Suspense>
      </div>
    </div>
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

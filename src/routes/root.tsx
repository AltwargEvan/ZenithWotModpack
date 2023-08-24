import { Outlet } from "@tanstack/react-router";
import Navbar from "../layouts/Navbar";
import { useEffect } from "react";
import { useModInstallState } from "../features/data/installState";

const Root = () => {
  const initializeInstallStateStore = useModInstallState(
    (ctx) => ctx.initialize
  );
  useEffect(() => {
    initializeInstallStateStore().catch(console.error);
  });
  return (
    <div className="bg-secondary-600 font-oswald h-screen w-screen flex select-none text-white overflow-hidden">
      <Navbar />
      <Outlet />
    </div>
  );
};

export default Root;

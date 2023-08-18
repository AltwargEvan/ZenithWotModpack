import { Outlet } from "@tanstack/react-router";
import Navbar from "../layouts/Navbar";

const Root = () => {
  return (
    <div className="bg-secondary-600 font-oswald h-screen w-screen flex select-none text-white overflow-hidden">
      <Navbar />
      <Outlet />
    </div>
  );
};

export default Root;

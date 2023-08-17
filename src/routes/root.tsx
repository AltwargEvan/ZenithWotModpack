import { Outlet } from "react-router-dom";
import Navbar from "../layouts/Navbar";

const Root = () => {
  return (
    <div className="font-oswald h-screen w-screen flex select-none text-white overflow-hidden">
      <Navbar />
      <div className="bg-secondary-600">
        <Outlet />
      </div>
    </div>
  );
};

export default Root;

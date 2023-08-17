import { ReactNode } from "react";
import { Link } from "react-router-dom";

const NavLink = ({ to, children }: { to: string; children: ReactNode }) => {
  return (
    <div className="hover:cursor-pointer hover:bg-secondary-200 px-2 py-1 rounded">
      <Link to={to}>{children}</Link>
    </div>
  );
};

const Navbar = () => {
  return (
    <div className="bg-secondary-300 flex flex-col p-2 rounded-r-xl">
      <div className="px-2 py-1">
        <span className="font-cinzel text-3xl font-bold">ZenitH</span>
      </div>
      <hr className="py-1" />
      <NavLink to="/mods">Mods</NavLink>
      <NavLink to="/settings">Settings</NavLink>
      <NavLink to="/about">About</NavLink>
      <NavLink to="/contact">Contact</NavLink>
    </div>
  );
};

export default Navbar;

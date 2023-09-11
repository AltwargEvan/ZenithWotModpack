import { ReactNode } from "react";
import {
  ToPathOption,
  useNavigate,
  useRouter,
  useRouterState,
} from "@tanstack/react-router";
import { Logo } from "../assets/Logo";
import { HomeIcon, Profiles, Settings } from "../assets/PagesIcons";
import { twMerge } from "tailwind-merge";

const NavItem = ({
  text,
  Icon,
  to,
}: {
  to: ToPathOption;
  text: string;
  Icon: React.FC<React.SVGProps<SVGSVGElement>>;
}) => {
  const navigate = useNavigate();
  const {
    location: { pathname },
  } = useRouterState();
  function onClick(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    e.preventDefault();
    navigate({ to: to });
  }
  const active = to === "/" ? pathname === "/" : pathname.startsWith(to);
  return (
    <div
      onClick={onClick}
      className={twMerge(
        "grid py-2.5",
        active
          ? "text-neutral-50 fill-neutral-50"
          : "text-neutral-500 fill-neutral-500 hover:text-neutral-400 hover:fill-neutral-400"
      )}
      style={{
        gridTemplateColumns: "64px 112px",
      }}
    >
      <div className="flex justify-center  items-center hover:cursor-pointer">
        <Icon className="h-5 w-5 group" />
      </div>
      <span className="font-medium align-middle hover:cursor-pointer text-sm">
        {text}
      </span>
    </div>
  );
};

const Navbar = () => {
  return (
    <>
      <div
        className="bg-zinc-900  hover:w-40 transition-all ease-out duration-150 w-16 flex flex-col justify-between overflow-hidden fixed z-40 border-neutral-700 border-r select-none"
        style={{ height: "calc(100% - 2.25rem - 2px)" }}
      >
        <div>
          <div
            className="grid pt-5 pb-3"
            style={{
              gridTemplateColumns: "64px 112px",
            }}
          >
            <div className="flex justify-center  items-center">
              <Logo className="h-7 fill-red-500 w-7" />
            </div>
            <div className=" font-bold text-xl tracking-wider text-neutral-50">
              <span>Zenith</span>
            </div>
          </div>

          <NavItem to="/" Icon={HomeIcon} text="Home" />
          {/* <NavItem to="/profiles" Icon={Profiles} text="Profiles" /> */}

          {/* <NavLink to="/">All Mods</NavLink>
        <NavLink to="/currentlyinstalled">Currently Installed</NavLink>
        <NavLink to="/settings">Settings</NavLink> */}
        </div>
        <div className="pb-3">
          <NavItem to="/profiles" Icon={Profiles} text="Profiles" />
          <NavItem to="/settings" Icon={Settings} text="Settings" />

          {/* <NavItem to="/profiles" Icon={Profiles} text="Profiles" /> */}

          {/* <NavLink to="/">All Mods</NavLink>
        <NavLink to="/currentlyinstalled">Currently Installed</NavLink>
        <NavLink to="/settings">Settings</NavLink> */}
        </div>
      </div>
      {/* filler div */}
      <div className="w-16 invisible"></div>
    </>
  );
};

export default Navbar;

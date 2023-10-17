import { Logo } from "../assets/Logo";
import { HomeIcon, Profiles, Settings } from "../assets/PagesIcons";
import { twMerge } from "tailwind-merge";
import { TwitchIcon } from "@/assets/twitchIcon";
import { NavLink } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useUser } from "@/components/auth/supabaseContext";
// import { Avatar, AvatarFallback, AvatarImage } from "@zenith/ui";

const NavItem = ({
  text,
  Icon,
  to,
}: {
  to: string;
  text: string;
  Icon: React.FC<React.SVGProps<SVGSVGElement>>;
}) => {
  const location = useLocation();
  const active = to === location.pathname;
  return (
    <NavLink
      to={to}
      className={twMerge(
        "grid py-2.5",
        active
          ? "text-neutral-50 fill-neutral-50"
          : "text-neutral-500 fill-neutral-500 hover:text-neutral-400 hover:fill-neutral-400"
      )}
      style={{
        gridTemplateColumns: "4.5rem 35.5rem",
      }}
    >
      <div className="flex justify-center  items-center hover:cursor-pointer">
        <Icon className="h-5 w-5 group" />
      </div>
      <span className="font-medium align-middle hover:cursor-pointer text-sm">
        {text}
      </span>
    </NavLink>
  );
};

const ProfileNavItem = () => {
  const user = useUser();
  let name = user?.full_name || "Sign In";
  if (name.length > 9) name = name.slice(0, 9) + "...";
  return (
    <div
      className="grid py-2.5"
      style={{
        gridTemplateColumns: "4.5rem 35.5rem",
      }}
    >
      <div className="flex justify-center  items-center hover:cursor-pointer">
        {/* <Avatar>
          <AvatarImage src={user?.avatar_url} />
          <AvatarFallback>
            <Profiles className="h-5 w-5" />
          </AvatarFallback>
        </Avatar> */}
      </div>
      <span className="font-medium  hover:cursor-pointer text-sm justify-center flex flex-col pb-1">
        {name}
      </span>
    </div>
  );
};
const Navbar = () => {
  return (
    <div
      className="bg-zinc-900  hover:w-40 transition-all ease-out duration-150 w-[4.5rem] flex flex-col justify-between overflow-hidden fixed z-40 border-neutral-700 border-r select-none"
      style={{ height: "calc(100% - 2.25rem - 2px)" }}
    >
      <div>
        <div
          className="grid pt-5 pb-3"
          style={{
            gridTemplateColumns: "4.5rem 35.5rem",
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
        <NavItem to="/yourMods" Icon={Profiles} text="Your Mods" />
        <NavItem to="/streamers" Icon={TwitchIcon} text="Streamers" />
      </div>
      <div className="pb-3">
        <NavItem to="/settings" Icon={Settings} text="Settings" />
        <ProfileNavItem />
      </div>
    </div>
  );
};

export default Navbar;

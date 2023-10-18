import { Logo } from "../assets/Logo";
import { twMerge } from "tailwind-merge";
import { NavLink } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useUser } from "@/lib/supabase/supabaseContext";
import { LucideIcon, User, Settings, Twitch, Home, Boxes } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
const NavItem = ({
  text,
  Icon,
  to,
}: {
  to: string;
  text: string;
  Icon: LucideIcon;
}) => {
  const location = useLocation();
  const active = to === location.pathname;
  return (
    <NavLink
      to={to}
      className={twMerge(
        "grid py-2.5 items-center",
        active
          ? "text-neutral-50 fill-neutral-50"
          : "text-neutral-500 fill-neutral-500 hover:text-neutral-400 hover:fill-neutral-400"
      )}
      style={{
        gridTemplateColumns: "4.5rem 35.5rem",
      }}
    >
      <div className="flex justify-center  items-center hover:cursor-pointer">
        <Icon className="h-7 w-7 group" />
      </div>
      <span className="font-medium align-middle hover:cursor-pointer text-sm">
        {text}
      </span>
    </NavLink>
  );
};

const ProfileNavItem = () => {
  const user = useUser();
  if (!user) return <NavItem to="/signIn" Icon={User} text="Sign In" />;
  let name = user.full_name;
  if (name.length > 9) name = name.slice(0, 9) + "...";
  return (
    <div
      className="grid py-2.5"
      style={{
        gridTemplateColumns: "4.5rem 35.5rem",
      }}
    >
      <div className="flex justify-center  items-center hover:cursor-pointer">
        <Avatar>
          <AvatarImage
            src={user?.avatar_url}
            className="h-7 w-7 rounded-full overflow-hidden"
          />
          <AvatarFallback>
            <User className="h-7 w-7" />
          </AvatarFallback>
        </Avatar>
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
            <Logo className="h-8 fill-red-500 w-8" />
          </div>
          <div className=" font-bold text-xl tracking-wider text-neutral-50">
            <span>Zenith</span>
          </div>
        </div>

        <NavItem to="/" Icon={Home} text="Home" />
        <NavItem to="/yourMods" Icon={Boxes} text="Your Mods" />
        <NavItem to="/streamers" Icon={Twitch} text="Streamers" />
      </div>
      <div className="pb-3">
        <NavItem to="/settings" Icon={Settings} text="Settings" />
        <ProfileNavItem />
      </div>
    </div>
  );
};

export default Navbar;

import { Logo } from "../assets/Zenith";
import { twMerge } from "tailwind-merge";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useUser } from "@/lib/supabase/supabaseContext";
import {
  LucideIcon,
  User,
  Settings,
  Twitch,
  Package,
  Blocks,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { handleSignout } from "@/lib/supabase/supabaseClient";
import { Discord } from "@/assets/Discord";
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
  const active = to.startsWith(location.pathname);
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
        gridTemplateColumns: "4.5rem 5.5rem",
      }}
    >
      <div className="flex justify-center  items-center hover:cursor-pointer">
        <Icon className="h-6 w-6" />
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
  const name = user.full_name;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div
          className="py-2.5 grid text-neutral-500 fill-neutral-500 hover:cursor-pointer hover:text-neutral-400 hover:fill-neutral-400"
          style={{
            gridTemplateColumns: "4.5rem 5.5rem",
          }}
        >
          <div className="flex justify-center  items-center">
            <Avatar className="flex justify-center  items-center  h-7 w-7">
              <AvatarImage
                src={user?.avatar_url}
                className="h-7 w-7 rounded-full"
              />
              <AvatarFallback>
                <User className="h-7 w-7" />
              </AvatarFallback>
            </Avatar>
          </div>
          <span className="font-medium align-middle text-sm text-white pt-0.5">
            {name}
          </span>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="top" className="w-36 ml-14">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <Link to="/settings?tab=account">
          <DropdownMenuItem>Account Settings</DropdownMenuItem>
        </Link>
        <DropdownMenuItem onClick={handleSignout}>Sign Out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
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

        <NavItem to="/mods" Icon={Package} text="Mods" />
        <NavItem to="/yourMods" Icon={Blocks} text="Your Mods" />
        <NavItem to="/streamers" Icon={Twitch} text="Streamers" />
        <a
          href="https://discord.gg/UA4t9KXyBK"
          target="_blank"
          style={{
            gridTemplateColumns: "4.5rem 5.5rem",
          }}
          className="grid py-2 items-center text-neutral-500 fill-neutral-500 hover:text-neutral-400 hover:fill-neutral-400"
        >
          <div className="flex justify-center  items-center hover:cursor-pointer">
            <Discord className="h-6 w-6" />
          </div>
          <span className="font-medium align-middle hover:cursor-pointer text-sm">
            Join Our Discord
          </span>
        </a>
      </div>
      <div className="pb-3">
        <NavItem to="/settings?tab=general" Icon={Settings} text="Settings" />
        <ProfileNavItem />
      </div>
    </div>
  );
};

export default Navbar;

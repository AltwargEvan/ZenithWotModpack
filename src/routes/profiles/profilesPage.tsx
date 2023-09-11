import { useLocalKVStore } from "../../stores/localKeyValueStore";
import { useRouteTitle } from "../../stores/pageTitleStore";
import { useState } from "react";
import { twMerge } from "tailwind-merge";
import { TwitchIcon } from "../../assets/twitchIcon";
import { BoxesIcon } from "../../assets/BoxesIcon";
import Profile from "../../features/profile";
import { ThreeDotsVertical } from "../../assets/ThreeDotsVertical";
import Menu from "@mui/material/Menu";
import { MenuItem } from "@mui/material";
import { useProfileStore } from "../../stores/profileStore";

const StreamerProfilesTab = () => {
  //   <button className="flex justify-between rounded w-full bg-zinc-900/80 border-neutral-700 border shadow  hover:bg-zinc-600/50 py-3 text-left items-center px-3">
  //   <span className="font-semibold">Create New Profile</span>
  // </button>
  return <div>Work In Progress</div>;
};

const ProfileLineItem = ({
  profile,
  active,
}: {
  profile: Profile;
  active: boolean;
}) => {
  const profileStore = useProfileStore();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleDuplicate = async () => {
    handleClose();
    profileStore.createProfile({ ...profile, name: `${profile.name} Copy` });
  };
  const handleUseThisProfile = () => {
    handleClose();
    profileStore.setActiveProfile(profile);
  };
  const handleDelete = () => {
    handleClose();
    profileStore.deleteProfile(profile);
  };

  const handleEdit = () => {
    handleClose();
  };
  return (
    <div>
      <Menu anchorEl={anchorEl} open={open} onClose={handleClick}>
        <MenuItem onClick={handleUseThisProfile}>Use This Profile</MenuItem>
        <MenuItem onClick={handleEdit}>Edit</MenuItem>
        <MenuItem onClick={handleDuplicate}>Duplicate</MenuItem>
        <MenuItem onClick={handleDelete}>Delete</MenuItem>
      </Menu>
      <div
        className={twMerge(
          "rounded text-left text-neutral-300 group shadow",
          active && "border border-green-300 my-1 hover:border-green-400"
        )}
        style={{
          columnGap: "2px",
          display: "grid",
          gridTemplateColumns: "200px auto 70px 40px",
        }}
      >
        <span className="rounded-l bg-zinc-700/80 group-hover:bg-zinc-600  p-3">
          {profile.name}
        </span>
        <span className="bg-zinc-700/80 group-hover:bg-zinc-600  p-3">
          {/* {profile.gameDirectory} */}
        </span>
        <span className="bg-zinc-700/80 group-hover:bg-zinc-600  p-3">
          {profile.mods.length}
        </span>
        <button
          className="bg-zinc-700/80 group-hover:bg-zinc-600   p-3 rounded-r flex justify-center items-center hover:cursor-pointer"
          onClick={handleClick}
          aria-controls={open ? "basic-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
        >
          <ThreeDotsVertical className="scale-125" />
          {/* <div className="w-full flex justify-center items-center h-6 hover:cursor-pointer"></div> */}
        </button>
      </div>
    </div>

    // </div>
  );
};

const YourProfilesTab = () => {
  const get = useLocalKVStore((ctx) => ctx.get);
  const profiles = useProfileStore((ctx) => ctx.profiles);
  const activeProfile = useProfileStore((ctx) => ctx.activeProfile);

  return (
    <div className="mt-4 grid">
      <div
        className="text-left text-neutral-300 mb-0.5"
        style={{
          display: "grid",
          gridTemplateColumns: "200px auto 70px 40px",
        }}
      >
        <span className="font-light text-xs pl-1">Name</span>
        <span className="font-light text-xs pl-0.5">Mods</span>
        <span className="font-light text-xs invisible">_</span>
        <span className="font-light text-xs invisible">_</span>
      </div>
      {profiles?.map((profile) => (
        <ProfileLineItem
          profile={profile}
          key={profile.name}
          active={profile.name === activeProfile?.name}
        />
      ))}
    </div>
  );
};

const TabButton = (
  props: React.ButtonHTMLAttributes<HTMLButtonElement> & { active?: boolean }
) => {
  return (
    <button
      className={twMerge(
        "px-3 py-2  rounded flex space-x-2 items-center",
        props.active
          ? " bg-neutral-500/40"
          : "bg-transparent hover:bg-neutral-500/10"
      )}
      {...props}
    ></button>
  );
};

const ProfilesPage = () => {
  useRouteTitle("Profiles");
  const [tab, setTab] = useState<"Your" | "Streamer">("Your");
  return (
    <div>
      <div className="flex space-x-4">
        <TabButton active={tab === "Your"} onClick={() => setTab("Your")}>
          <BoxesIcon />
          <span className="font-medium text-sm">Your Profiles</span>
        </TabButton>
        <TabButton
          active={tab === "Streamer"}
          onClick={() => setTab("Streamer")}
        >
          <TwitchIcon />
          <span className="font-medium text-sm">Streamer Profiles</span>
        </TabButton>
      </div>
      {tab === "Your" && <YourProfilesTab />}
      {tab === "Streamer" && <StreamerProfilesTab />}
    </div>
  );
};

export default ProfilesPage;

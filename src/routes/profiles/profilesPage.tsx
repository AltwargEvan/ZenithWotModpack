import { useQuery } from "@tanstack/react-query";
import { useLocalKVStore } from "../../stores/localKeyValueStore";
import { useRouteTitle } from "../../stores/pageTitleStore";
import { useState } from "react";
import { exists, readDir } from "@tauri-apps/api/fs";
import { twMerge } from "tailwind-merge";
import { TwitchIcon } from "../../assets/twitchIcon";
import { BoxesIcon } from "../../assets/BoxesIcon";
import Profile from "../../features/profile";
import { PlusIcon } from "../../assets/PlusIcon";

const StreamerProfilesTab = () => {
  return <div></div>;
};

const ProfileLineItem = ({ profile }: { profile: Profile }) => {
  return (
    <div className="grid grid-cols-6 rounded w-full bg-zinc-900/80 border-neutral-700 border shadow  hover:bg-zinc-600/50 py-3 text-left items-center px-3">
      <div>{profile.name}</div>
    </div>
  );
};

const YourProfilesTab = () => {
  const get = useLocalKVStore((ctx) => ctx.get);
  const { data: profiles } = useQuery({
    queryFn: async () => {
      return await get("profiles");
    },
    queryKey: ["profiles"],
  });
  const { data: currentProfile } = useQuery({
    queryFn: async () => {
      return await get("currentProfile");
    },
    queryKey: ["currentProfile"],
  });

  return (
    <div className="mt-4 space-y-2 grid">
      {profiles?.map((profile) => (
        <ProfileLineItem profile={profile} key={profile.name} />
      ))}
      <button className="flex justify-between rounded w-full bg-zinc-900/80 border-neutral-700 border shadow  hover:bg-zinc-600/50 py-3 text-left items-center px-3">
        <span className="font-semibold"> Create New Profile</span>
        <PlusIcon className="scale-150" />
      </button>
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

// const [detectedGameDirectories, setDetectedGameDirectories] =
// useState<Array<string> | null>(null);

// async function findGameDirectories() {
//   try {
//     const entries = await readDir("C:\\games");

//     entries
//       .filter((entry) => entry.name?.toLowerCase().includes("world_of_tanks"))
//       // this async code we could promise all
//       .forEach(async (entry) => {
//         if (await exists(`${entry.path}\\WorldOfTanks.exe`))
//           setDetectedGameDirectories((prev) =>
//             prev ? [...prev, entry.path] : [entry.path]
//           );
//       });
//   } catch {
//     setDetectedGameDirectories([]);
//   }
// }

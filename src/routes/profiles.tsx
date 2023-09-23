import { useLayout } from "../stores/rootLayoutStore";
import { useState } from "react";
import { twMerge } from "tailwind-merge";
import { TwitchIcon } from "../assets/twitchIcon";
import { BoxesIcon } from "../assets/BoxesIcon";
import Profile from "../features/profile";
import { Dialog, TextField, Tooltip } from "@mui/material";
import { CheckLarge } from "../assets/CheckLarge";
import { Pen } from "../assets/Pen";
import { ClipboardIcon, ClipboardPlusIcon } from "../assets/Clipboard";
import { Trash } from "../assets/Trash";
import { Duplicate } from "../assets/Duplicate";
import { clipboard } from "@tauri-apps/api";
import { Download } from "../assets/Download";
import SuperJSON from "superjson";
import { TabButton } from "../components/TabButton";

const StreamerProfilesTab = () => {
  //   <button className="flex justify-between rounded w-full bg-zinc-900/80 border-neutral-700 border shadow  hover:bg-zinc-600/50 py-3 text-left items-center px-3">
  //   <span className="font-semibold">Create New Profile</span>
  // </button>
  return <div>Work In Progress</div>;
};

const ProfileLineItem = ({
  profile,
  selected,
}: {
  profile: Profile;
  selected: boolean;
}) => {
  const profileStore = useLayout("");
  const [dialog, setDialog] = useState<"None" | "Rename" | "Delete">();
  const handleCloseRenameDialog = () => setDialog("None");
  const handleDuplicate = () => profileStore.duplicateProfile(profile);
  const handleCopyToClipboard = () =>
    clipboard.writeText(SuperJSON.stringify(profile));
  const handleSwitchProfile = () => {
    if (!selected) profileStore.setActiveProfile(profile);
  };
  return (
    <>
      <Dialog
        open={dialog === "Rename"}
        onClose={handleCloseRenameDialog}
        PaperProps={{
          className: "px-6 py-3 flex flex-col",
        }}
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const value = (e.currentTarget[0] as any)["value"] as string;
            if (!value || value.length < 1) return;
            else
              profileStore.updateProfile({
                ...profile,
                name: value,
              });
          }}
        >
          <label className="text-2xl pb-1">Rename</label>
          <TextField
            defaultValue={profile.name}
            autoFocus
            margin="dense"
            id="name"
            fullWidth
            variant="outlined"
          />
          <div className="flex justify-end space-x-3 h-9 items-end">
            <button
              onClick={handleCloseRenameDialog}
              type="button"
              className=" hover:bg-neutral-200 w-16 font-medium rounded-full py-1 text-blue-500 hover:border border-neutral-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className=" bg-blue-500 text-white font-medium w-14 rounded-full py-1 hover:bg-blue-600 h-8"
            >
              Ok
            </button>
          </div>
        </form>
      </Dialog>
      <Dialog
        open={dialog === "Delete"}
        onClose={handleCloseRenameDialog}
        PaperProps={{
          className: "px-6 py-3 flex flex-col",
        }}
      >
        {profileStore?.activeProfile?.id === profile.id && (
          <span>
            You cannot delete the current active profile. Please switch to a
            different profile to delete this one.
          </span>
        )}
        {profileStore?.activeProfile?.id !== profile.id && (
          <>
            <label className="text-2xl pb-1">Delete Profile</label>
            <span>
              Are you sure you want to delete profile{" "}
              <span className="font-bold">{profile.name}</span>.
            </span>
            <span>This action is cannot be undone.</span>
            <div className="flex justify-end space-x-3 h-9 items-end">
              <button
                onClick={handleCloseRenameDialog}
                type="button"
                className=" hover:bg-neutral-200 w-16 font-medium rounded-full py-1 text-blue-500 hover:border border-neutral-300"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => profileStore.deleteProfile(profile)}
                className=" bg-red-500 text-white font-medium w-16 rounded-full py-1 hover:bg-red-600 h-8"
              >
                Delete
              </button>
            </div>
          </>
        )}
      </Dialog>
      <div className="flex p-4 h-18 bg-neutral-700 hover:bg-neutral-600 shadow justify-between group">
        <div className="flex items-center">
          <Tooltip title="Use This Profile" placement="top-start">
            <div
              className={twMerge(
                "h-11 w-11 rounded flex items-center justify-center hover:cursor-pointer",
                selected && "ring-2 ring-neutral-100 overflow-visible"
              )}
              onClick={handleSwitchProfile}
              style={{
                backgroundColor: profile.avatar.color,
              }}
            >
              <span className="font-bold">
                {profile.name
                  .split(" ")
                  .map((item) => item.charAt(0))
                  .join("")}
              </span>
            </div>
          </Tooltip>

          <div className="flex flex-col mx-3">
            <div className="flex">
              <span
                className={twMerge(
                  "font-medium text-lg",
                  selected ? "text-white" : "text-neutral-300"
                )}
              >
                {profile.name}
              </span>
            </div>
            <div className="flex">
              <span className="font-normal text-xs text-neutral-200 mr-2">
                Created {profile.createdAt}
              </span>
              <span className="font-normal text-xs text-neutral-200 mr-2">
                Mods {profile.mods.length}
              </span>
              {selected && (
                <>
                  <span className="font-normal text-xs text-neutral-200 mr-0.5">
                    Active
                  </span>
                  <CheckLarge className="fill-green-500" />
                </>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center">
          <div className="flex space-x-3 invisible group-hover:visible">
            <Tooltip title="Use this Profile">
              <div
                onClick={handleSwitchProfile}
                className="hover:cursor-pointer rounded-full hover:bg-neutral-500 h-8 w-8 flex items-center justify-center transition-all"
              >
                <Download className="fill-neutral-300 scale-110" />
              </div>
            </Tooltip>
            <Tooltip title="Rename">
              <div
                onClick={() => setDialog("Rename")}
                className="hover:cursor-pointer rounded-full hover:bg-neutral-500 h-8 w-8 flex items-center justify-center transition-all"
              >
                <Pen className="fill-neutral-300 scale-110" />
              </div>
            </Tooltip>
            <Tooltip title="Duplicate">
              <div
                onClick={handleDuplicate}
                className="hover:cursor-pointer rounded-full hover:bg-neutral-500 h-8 w-8 flex items-center justify-center transition-all"
              >
                <Duplicate className="fill-neutral-300 scale-110" />
              </div>
            </Tooltip>

            <Tooltip title="Copy To Clipboard">
              <div
                onClick={handleCopyToClipboard}
                className="hover:cursor-pointer rounded-full hover:bg-neutral-500 h-8 w-8 flex items-center justify-center transition-all"
              >
                <ClipboardIcon className="fill-neutral-300 scale-110" />
              </div>
            </Tooltip>
            {profileStore.profiles.length > 1 && (
              <Tooltip title="Delete">
                <div
                  onClick={() => setDialog("Delete")}
                  className="hover:cursor-pointer rounded-full hover:bg-neutral-500 h-8 w-8 flex items-center justify-center transition-all"
                >
                  <Trash className="fill-neutral-300 scale-110" />
                </div>
              </Tooltip>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

const YourProfilesTab = () => {
  const profiles = useProfileStore((ctx) => ctx.profiles);
  const activeProfile = useProfileStore((ctx) => ctx.activeProfile);
  return (
    <div className="mt-4 grid rounded  space-y-1">
      <div className="rounded grid space-y-1 overflow-hidden">
        {profiles?.map((profile) => (
          <ProfileLineItem
            profile={profile}
            key={profile.name}
            selected={profile.name === activeProfile?.name}
          />
        ))}
      </div>
    </div>
  );
};

const ProfilesPage = () => {
  useRouteTitle("Profiles");
  const [showDialog, setShowDialog] = useState(false);
  const duplicateProfile = useProfileStore((ctx) => ctx.duplicateProfile);

  const [tab, setTab] = useState<"Your" | "Streamer">("Your");
  const handleImport = async () => {
    const data = await clipboard.readText();
    console.log(data);

    if (!data) return;
    try {
      const res = SuperJSON.parse<Profile>(data);
      await duplicateProfile(res);
    } catch (e) {
      setShowDialog(true);
      console.error(e);
    }
  };
  return (
    <div className="px-3">
      <div className="flex justify-between">
        <div className="flex space-x-2">
          <TabButton selected={tab === "Your"} onClick={() => setTab("Your")}>
            <BoxesIcon />
            <span className="font-medium text-sm">Your Profiles</span>
          </TabButton>
          <TabButton
            selected={tab === "Streamer"}
            onClick={() => setTab("Streamer")}
          >
            <TwitchIcon />
            <span className="font-medium text-sm">Streamer Profiles</span>
          </TabButton>
        </div>
        <div>
          <button
            onClick={handleImport}
            className="px-3 py-2  rounded flex space-x-2 items-center bg-transparent hover:bg-neutral-500/10"
          >
            <ClipboardPlusIcon />
            <span className="font-medium text-sm">Import From Clipboard</span>
          </button>
        </div>
      </div>
      {tab === "Your" && <YourProfilesTab />}
      {tab === "Streamer" && <StreamerProfilesTab />}
      <Dialog
        open={showDialog}
        PaperProps={{
          className: "px-6 py-3 flex flex-col",
        }}
        onClose={() => setShowDialog(false)}
      >
        <div>Error: Failed to parse clipboard content</div>
      </Dialog>
    </div>
  );
};

export default ProfilesPage;

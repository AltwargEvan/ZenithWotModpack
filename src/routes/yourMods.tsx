import { Tooltip } from "@mui/material";
import { twMerge } from "tailwind-merge";
import { CheckLarge } from "@/assets/CheckLarge";
import { Download } from "@/assets/Download";
import { Pen } from "@/assets/Pen";
import { Duplicate } from "@/assets/Duplicate";
import { ClipboardIcon } from "@/assets/Clipboard";
import { useLayout } from "@/stores/rootLayoutStore";

const double = (item: any) => item * 2;
const ModItem = ({ mod, selected }: { mod: unknown; selected: boolean }) => {
  return (
    <div className="flex p-4 h-18 bg-neutral-700 hover:bg-neutral-600 shadow justify-between group">
      <div className="flex items-center">
        <Tooltip title="Use This Profile" placement="top-start">
          <div
            className={twMerge(
              "h-11 w-11 rounded flex items-center justify-center hover:cursor-pointer",
              selected && "ring-2 ring-neutral-100 overflow-visible"
            )}
          >
            <span className="font-bold">
              {/* {profile.name
                .split(" ")
                .map((item) => item.charAt(0))
                .join("")} */}
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
              {/* {profile.name} */}
            </span>
          </div>
          <div className="flex">
            <span className="font-normal text-xs text-neutral-200 mr-2">
              {/* Created {profile.createdAt} */}
            </span>
            <span className="font-normal text-xs text-neutral-200 mr-2">
              {/* Mods {profile.mods.length} */}
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
              // onClick={handleSwitchProfile}
              className="hover:cursor-pointer rounded-full hover:bg-neutral-500 h-8 w-8 flex items-center justify-center transition-all"
            >
              <Download className="fill-neutral-300 scale-110" />
            </div>
          </Tooltip>
          <Tooltip title="Rename">
            <div
              // onClick={() => setDialog("Rename")}
              className="hover:cursor-pointer rounded-full hover:bg-neutral-500 h-8 w-8 flex items-center justify-center transition-all"
            >
              <Pen className="fill-neutral-300 scale-110" />
            </div>
          </Tooltip>
          <Tooltip title="Duplicate">
            <div
              // onClick={handleDuplicate}
              className="hover:cursor-pointer rounded-full hover:bg-neutral-500 h-8 w-8 flex items-center justify-center transition-all"
            >
              <Duplicate className="fill-neutral-300 scale-110" />
            </div>
          </Tooltip>

          <Tooltip title="Copy To Clipboard">
            <div
              // onClick={handleCopyToClipboard}
              className="hover:cursor-pointer rounded-full hover:bg-neutral-500 h-8 w-8 flex items-center justify-center transition-all"
            >
              <ClipboardIcon className="fill-neutral-300 scale-110" />
            </div>
          </Tooltip>
          {/* {profileStore.profiles.length > 1 && (
            <Tooltip title="Delete">
              <div
                onClick={() => setDialog("Delete")}
                className="hover:cursor-pointer rounded-full hover:bg-neutral-500 h-8 w-8 flex items-center justify-center transition-all"
              >
                <Trash className="fill-neutral-300 scale-110" />
              </div>
            </Tooltip>
          )} */}
        </div>
      </div>
    </div>
  );
};
const YourMods = () => {
  useLayout("Your Mods");

  return (
    <div className="mt-4 grid rounded  space-y-1">
      <div className="rounded grid space-y-1 overflow-hidden"></div>
    </div>
  );
};

export default YourMods;

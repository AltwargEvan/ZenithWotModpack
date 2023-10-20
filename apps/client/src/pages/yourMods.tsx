import { MergedMod, toCachedMod } from "@zenith/utils/apitypes";
import PageHeader from "@/layouts/PageHeader";
import { useSession } from "@/lib/supabase/supabaseContext";
import { useMods } from "@/api/supabase/mods";
import { Link } from "react-router-dom";
import { useModManager } from "@/lib/modManager/modManagerContext";
import { LocalInstallConfig, openFileExplorer } from "@/api/rust";
import { Prettify } from "@zenith/utils/tsmagic";
import { ModManager } from "@/lib/modManager/modManager";
import { ScrollArea } from "@/components/ui/scroll-area";
import { observer } from "mobx-react-lite";
import { Button } from "@/components/ui/Button";
import { useSettings } from "@/lib/settingsManager/settingsManagerContext";
import { useToast } from "@/components/ui/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical } from "lucide-react";
import { open } from "@tauri-apps/api/dialog";
import { computed, set } from "mobx";

const Action = observer(({ mod }: { mod: UberMergedMod }) => {
  const manager = useModManager();
  const settings = useSettings();
  const { toast } = useToast();

  const handleModifyInstall = () => {};

  const handleUninstall = () => {
    if (mod.installedConfigs.length === 0)
      return toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description:
          "Failed to uninstall mod. No install configs provided. Please contact the developer.",
      });
    manager.removeInstallConfigs(
      toCachedMod(mod),
      mod.installedConfigs.map((x) => x.id)
    );
  };

  const handleOpenFileLocation = () => {
    mod.installedConfigs.forEach((cfg) => {
      if (cfg.mods_path) {
        openFileExplorer(
          `${settings.gameDirectory}/mods/${settings.gameVersion}/${mod.name}-${cfg.id}`
        );
      }
      // TODO - open res mods files
      // TODO - open config files
    });
  };

  return (
    <div className="flex">
      <Button
        variant="secondary"
        className="rounded-r-none rounded-l-sm w-20"
        onClick={handleUninstall}
      >
        Uninstall
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="secondary"
            className="rounded-l-none rounded-r-sm px-0 border-l border-neutral-900 w-5"
          >
            <MoreVertical size={20} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent side="bottom">
          <DropdownMenuLabel>Options</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            {mod.installConfigs.length > 1 && (
              <DropdownMenuItem onClick={handleModifyInstall}>
                Modify Install
              </DropdownMenuItem>
            )}
            <DropdownMenuItem onClick={handleOpenFileLocation}>
              Open File Location
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleUninstall}>
              Uninstall
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
});

const ModItem = ({ mod }: { mod: UberMergedMod }) => {
  return (
    <div
      className=" rounded bg-neutral-700  hover:bg-neutral-600 relative overflow-hidden my-3"
      style={{
        backgroundImage: `url(${mod.cover})`,
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
      }}
    >
      <div className="p-4 flex justify-between backdrop-blur">
        <div className="flex h-full">
          <div className="flex">
            <Link to={`/mod?id=${mod.id}`}>
              <span className="font-medium text-lg">{mod.name}</span>
            </Link>
          </div>
        </div>
        <div className="flex h-full items-center justify-center">
          <Action mod={mod} />
        </div>
      </div>
    </div>
  );
};

type UberMergedMod = Prettify<
  MergedMod & { installedConfigs: LocalInstallConfig[] }
>;
const getMergedModData = (
  mods: MergedMod[] | undefined,
  manager: ModManager
) => {
  let data = new Array<UberMergedMod>();

  if (mods)
    for (const config of manager.installConfigsLocal.values()) {
      const associatedMod = mods.find((x) => x.id === config.mod_id);
      if (!associatedMod) console.error("No associated mod found for ");
      else {
        const currentValue = data.find((mod) => mod.id === associatedMod.id);
        if (!currentValue)
          data.push({
            ...associatedMod,
            installedConfigs: [config],
          });
        else currentValue.installedConfigs.push(config);
      }
    }

  return data;
};

const YourMods = () => {
  const session = useSession();
  const { data: mods } = useMods();
  const manager = useModManager();
  const data = getMergedModData(mods, manager);

  // [modId, data]

  return (
    <>
      <PageHeader title="Your Mods" subtext="Manage your mods" />
      <ScrollArea className="grid w-full overflow-y-auto gap-4">
        {data.map((mod) => (
          <ModItem mod={mod} key={mod.id} />
        ))}
      </ScrollArea>
    </>
  );
};

export default YourMods;

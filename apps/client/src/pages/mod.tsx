import { CachedMod } from "@/api/rust";
import { useMods } from "@/api/supabase/mods";
import { Button } from "@/components/ui/Button";
import { CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import PageHeader from "@/layouts/PageHeader";
import { useModManager } from "@/lib/modManager/modManagerContext";
import { MergedMod } from "@zenith/utils/apitypes";
import { MoreVertical } from "lucide-react";

import Carousel from "react-material-ui-carousel";
import { Navigate, useNavigate, useSearchParams } from "react-router-dom";
import { observer } from "mobx-react-lite";
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
import { open } from "@tauri-apps/api/dialog";
import { useSettings } from "@/lib/settingsManager/settingsManagerContext";

function toCachedMod(mod: MergedMod): CachedMod {
  return {
    id: mod.id,
    name: mod.name,
    mod_version: mod.versions[0].version,
    game_version: mod.versions[0].game_version.version,
  };
}
const ActionInstalled = observer(({ mod }: { mod: MergedMod }) => {
  const manager = useModManager();
  const settings = useSettings();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleClick = () => navigate("/yourMods");
  const handleModifyInstall = () => {};
  const handleUninstall = () => {
    switch (mod.installConfigs.length) {
      case 0:
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description:
            "Failed to uninstall mod. No install configs provided. Please contact the developer.",
        });
        break;
      case 1:
        manager.removeMod(toCachedMod(mod), mod.installConfigs[0].id);
        break;
      default:
    }
  };

  // TODO
  const handleOpenFileLocation = () => {
    switch (mod.installConfigs.length) {
      case 0:
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description:
            "No install configs found for this mod. Please contact the developer.",
        });
        break;
      case 1:
        // open(`${settings.gameDirectory}/mods/`);

        break;
      default:
    }
  };
  return (
    <div className="flex">
      <Button
        variant="secondary"
        className="rounded-r-none rounded-l-sm w-20"
        onClick={handleClick}
      >
        Installed
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

const ActionNotInstalled = observer(({ mod }: { mod: MergedMod }) => {
  const manager = useModManager();
  const { toast } = useToast();

  const handleClick = () => {
    switch (mod.installConfigs.length) {
      case 0:
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description:
            "Failed to install mod. No install configs provided. Please contact the developer.",
        });
        break;
      case 1:
        manager.addMod(
          toCachedMod(mod),
          mod.installConfigs[0],
          mod.versions[0].download_url
        );
        break;
      default:
        // TODO - install config selector popup
        break;
    }
  };
  return (
    <div className="flex">
      <Button
        className="rounded-r-none rounded-l-sm w-20"
        onClick={handleClick}
      >
        Install
      </Button>
      <Button className="rounded-l-none rounded-r-sm px-0 border-l border-neutral-900 w-5">
        <MoreVertical size={20} />
      </Button>
    </div>
  );
});

const ActionLoading = () => {
  return (
    <Button className="rounded-r-none rounded-l-sm w-24" disabled>
      Loading...
    </Button>
  );
};
const Action = observer(({ mod }: { mod: MergedMod }) => {
  const manager = useModManager();
  const isInstalledLocally = mod.installConfigs.some((cfg) =>
    manager.installConfigsLocal.has(cfg.id)
  );
  const isAddedCloud = mod.installConfigs.some((cfg) =>
    manager.installConfigsCloud.has(cfg.id)
  );
  const operationInProgress = manager.lockedModIds.has(mod.id);

  if (operationInProgress) return <ActionLoading />;
  if (isInstalledLocally) return <ActionInstalled mod={mod} />;
  return <ActionNotInstalled mod={mod} />;
});

const ModPage = () => {
  const { data: mods } = useMods();
  const [searchParams] = useSearchParams();
  const id = parseInt(searchParams.get("id") || "-1");
  if (id === -1) return <Navigate to="/mods" />;

  const mod = mods?.find((mod) => mod.id === id);
  if (!mod) return "Mod Not Found";

  const localization =
    mod.localizations.find((item) => item.lang.code === "en") ||
    mod.localizations[0];

  return (
    <>
      <PageHeader
        title={mod.name}
        subtext={`Created by ${mod.owner.spa_username}`}
        action={<Action mod={mod} />}
      />
      <ScrollArea className=" pt-2 pb-2 h-full">
        <CardTitle className="text-xl pb-1">Description</CardTitle>
        <div
          className="text-sm font-thin text-neutral-200 grid w-full"
          dangerouslySetInnerHTML={{
            __html: localization.description.replace(
              /href/g,
              "target='_blank' href"
            ),
          }}
        ></div>

        {mod.screenshots.length > 0 && (
          <Carousel
            autoPlay={false}
            indicators
            swipe
            cycleNavigation
            navButtonsAlwaysVisible
            fullHeightHover
            animation="slide"
            duration={400}
            className="w-full pt-2 pr-2"
          >
            {mod.screenshots.map((ss) => (
              <div
                className="flex justify-center bg-neutral-900 w-full"
                key={ss.id}
              >
                <div className=" max-w-4xl lg:py-4">
                  <img src={ss.source} className="h-96" />
                </div>
              </div>
            ))}
          </Carousel>
        )}
      </ScrollArea>
    </>
  );
};

export default ModPage;

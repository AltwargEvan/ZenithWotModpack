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
import { Navigate, useSearchParams } from "react-router-dom";
import { observer } from "mobx-react-lite";
import { useToast } from "@/components/ui/use-toast";

const Action = observer(({ mod }: { mod: MergedMod }) => {
  const manager = useModManager();
  const { toast } = useToast();
  const isInstalledLocally = mod.installConfigs.some((cfg) =>
    manager.installConfigsLocal.has(cfg.id)
  );
  const isAddedCloud = mod.installConfigs.some((cfg) =>
    manager.installConfigsCloud.has(cfg.id)
  );
  const operationInProgress = manager.lockedModIds.has(mod.id);
  const buttonVariant = isInstalledLocally ? "secondary" : "default";
  const buttonText = (function () {
    if (operationInProgress) return "Loading...";
    if (isInstalledLocally) return "Installed";
    return "Install";
  })();

  const cachedMod: CachedMod = {
    id: mod.id,
    name: mod.name,
    mod_version: mod.versions[0].version,
    game_version: mod.versions[0].game_version.version,
  };

  const handleClick = () => {
    if (operationInProgress) return;
    if (!isInstalledLocally) {
      switch (mod.installConfigs.length) {
        case 0:
          toast({
            variant: "destructive",
            title: "Uh oh! Something went wrong.",
            description:
              "Failed to Install Mod. No install configs provided. Please contact the developer.",
          });
          break;
        case 1:
          manager.addMod(
            cachedMod,
            mod.installConfigs[0],
            mod.versions[0].download_url
          );
          break;
        default:
          // TODO - install config selector popup
          break;
      }
    }
  };

  return (
    <div className="flex">
      <Button
        variant={buttonVariant}
        className="rounded-r-none rounded-l-sm"
        onClick={handleClick}
      >
        {buttonText}
      </Button>
      <Button
        variant={buttonVariant}
        className="rounded-l-none rounded-r-sm px-0 w-min border-l border-neutral-900"
      >
        <MoreVertical size={20} />
      </Button>
    </div>
  );
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

import { CachedMod } from "@/api/rust";
import { useMods } from "@/api/supabase/mods";
import { Button, ButtonProps } from "@/components/ui/Button";
import { CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import PageHeader from "@/layouts/PageHeader";
import { useModManager } from "@/lib/modManager/modManagerContext";
import { MergedMod, toCachedMod } from "@zenith/utils/apitypes";
import { MoreVertical } from "lucide-react";

import Carousel from "react-material-ui-carousel";
import { Navigate, useNavigate, useSearchParams } from "react-router-dom";
import { observer } from "mobx-react-lite";
import { useToast } from "@/components/ui/use-toast";

const Action = observer(({ mod }: { mod: MergedMod }) => {
  const manager = useModManager();
  const navigate = useNavigate();
  const { toast } = useToast();

  const isInstalledLocally = mod.installConfigs.some((cfg) =>
    manager.installConfigsLocal.has(cfg.id)
  );
  const isAddedCloud = mod.installConfigs.some((cfg) =>
    manager.installConfigsCloud.has(cfg.id)
  );
  const operationInProgress = manager.lockedModIds.has(mod.id);

  function handleClick() {
    if (operationInProgress) return;
    if (isInstalledLocally) return navigate("/yourMods");
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
        manager.addInstallConfigs(
          toCachedMod(mod),
          mod.installConfigs,
          mod.versions[0].download_url
        );
        break;
      default:
        // TODO - install config selector popup
        break;
    }
  }
  const variant =
    !operationInProgress && !isInstalledLocally ? "default" : "secondary";

  return (
    <Button variant={variant} onClick={handleClick}>
      {operationInProgress && "Loading..."}
      {isInstalledLocally && "Installed"}
      {!isInstalledLocally && "Install"}
    </Button>
  );
});

const ModPage = () => {
  const { data: mods } = useMods();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

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
        subtext={
          <div className="flex space-x-2 items-center">
            <span>Created by ${mod.owner.spa_username}</span>
            {mod.categories?.map((category) => (
              <Button
                key={category}
                size={"sm"}
                className="h-6"
                variant="outline"
                onClick={() => navigate(`/mods?category=${category}`)}
              >
                {category}
              </Button>
            ))}
          </div>
        }
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

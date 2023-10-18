import { useMods } from "@/api/supabase/mods";
import { Button } from "@/components/ui/Button";
import { CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import PageHeader from "@/layouts/PageHeader";
import { observer } from "mobx-react-lite";
import { MoreVertical } from "lucide-react";
import Carousel from "react-material-ui-carousel";
import { Navigate, useSearchParams } from "react-router-dom";
import { useModManager } from "@/lib/modManager/modManagerContext";

const Action = observer(({ modId }: { modId: number }) => {
  const manager = useModManager();
  const buttonVariant = manager.modIsInstalled(modId) ? "secondary" : "default";
  const buttonText = manager.modIsInstalled(modId) ? "Installed" : "Install";
  return (
    <div className="flex">
      <Button
        variant={buttonVariant}
        className="rounded-r-none rounded-l-sm"
        onClick={() => manager.addMod(modId)}
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
  console.log(id);
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
        action={<Action modId={mod.id} />}
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

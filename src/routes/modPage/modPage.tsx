import { useMods } from "@/api";
import { useLayout } from "@/stores/rootLayoutStore";
import { Link, useParams } from "@tanstack/react-router";
import Carousel from "react-material-ui-carousel";
import { Paper } from "@mui/material";
import "./style.css";
import fetchWGMod from "@/api/client/fetchWargamingMods";
import { Category } from "../home";
import { ArrowLeft } from "@/assets/ArrowLeft";

export default function ModPage() {
  const mods = useMods();
  const { id } = useParams();
  const mod = mods.find((mod) => mod.data?.internal.id == id)?.data;
  if (mod) return <ModPageInner mod={mod} />;
  else return <div>Failed to find mod data.</div>;
}

function ModPageInner({
  mod,
}: {
  mod: NonNullable<Awaited<ReturnType<typeof fetchWGMod>>>;
}) {
  useLayout(mod.internal.name, mod.cover);

  const localization =
    mod.localizations.find((item) => item.lang.code === "en") ||
    mod.localizations[0];

  return (
    <div>
      <div className="h-20 flex flex-col space-y-2 px-3">
        <Link to="/">
          <div className="flex items-center text-gray-300 hover:text-white">
            <ArrowLeft />
            <span className="font-thin px-2 w-fit ">To Home Page</span>
          </div>
        </Link>
        <div className="flex space-x-2">
          <span>Categories:</span>
          <Link
            to="/"
            search={{
              category: mod.internal.category as Category,
            }}
          >
            <span className="font-thin bg-neutral-600 px-2 rounded w-fit hover:bg-neutral-500 select-none hover:cursor-pointer">
              {mod.internal.category}
            </span>
          </Link>
          <span className="pl-2">Uploaded by:</span>
          <span className="text-yellow-300">{mod.owner.spa_username}</span>
        </div>
      </div>

      <div
        className="px-3 overflow-y-auto"
        style={{
          maxHeight: "calc(100vh - 138px)",
        }}
      >
        <span className="text-xl">Mod Description</span>
        <div
          className="font-thin py-4 text-neutral-200"
          dangerouslySetInnerHTML={{ __html: localization?.description || "" }}
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
          >
            {mod.screenshots.map((ss) => (
              <Paper
                className="flex justify-center bg-neutral-900 w-full"
                key={ss.id}
              >
                <div className=" max-w-4xl lg:py-4">
                  <img src={ss.source} className="h-96" />
                </div>
              </Paper>
            ))}
          </Carousel>
        )}
      </div>
    </div>
  );
}

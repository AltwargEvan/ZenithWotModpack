import { useEffect, useState } from "react";
import { useMods } from "../api/client/useMods";
import { TabButton } from "../components/TabButton";
import { BoxesIcon } from "../assets/BoxesIcon";
import { Wrench } from "../assets/Wrench";
import { Crosshair } from "../assets/Crosshair";
import { Star } from "../assets/Star";
import { NavLink, useSearchParams } from "react-router-dom";
import PageHeader from "@/layouts/PageHeader";

export const Categories = [
  "All Mods",
  "Tools",
  "Reticle",
  "Mark of Excellence",
  "Currently Installed",
] as const;
export type Category = (typeof Categories)[number];
type Tab = Category;

const HomeTabs = ({
  activeTab,
  setActiveTab,
}: {
  activeTab: Tab;
  setActiveTab: React.Dispatch<Tab>;
}) => {
  return (
    <div className="flex space-x-2 select-none px-3">
      <TabButton
        selected={activeTab === "All Mods"}
        onClick={() => setActiveTab("All Mods")}
      >
        <BoxesIcon />
        <span className="font-medium text-sm">All Mods</span>
      </TabButton>
      <TabButton
        selected={activeTab === "Tools"}
        onClick={() => setActiveTab("Tools")}
      >
        <Wrench />
        <span className="font-medium text-sm">Tools</span>
      </TabButton>
      <TabButton
        selected={activeTab === "Reticle"}
        onClick={() => setActiveTab("Reticle")}
      >
        <Crosshair className="fill-white" />
        <span className="font-medium text-sm">Reticle</span>
      </TabButton>
      <TabButton
        selected={activeTab === "Mark of Excellence"}
        onClick={() => setActiveTab("Mark of Excellence")}
      >
        <Star />
        <span className="font-medium text-sm">Mark of Excellence</span>
      </TabButton>
      {/* <TabButton
          selected={activeTab === "Currently Installed"}
          onClick={() => setActiveTab("Currently Installed")}
        >
          <SDCard />
          <span className="font-medium text-sm">Currently Installed</span>
        </TabButton> */}
    </div>
  );
};

const ModItem = ({
  mod,
}: {
  mod: NonNullable<ReturnType<typeof useMods>[number]["data"]>;
}) => {
  return (
    <NavLink to={`/mod/${mod.id}`}>
      <div className="p-1 hover:cursor-pointer h-54 relative rounded-xl overflow-visible bg-neutral-700 hover:ring-1 ring-offset-2 ring-offset-transparent ring-neutral-400 hover:scale-105 transition-all group">
        <div
          style={{
            backgroundImage: `url(${mod.cover})`,
          }}
          className="h-36 bg-blue-500 w-full bg-contain shadow-lg bg-center overflow-hidden rounded-lg"
        />
        <div className="p-1">
          <div className="h-6 overflow-hidden text-ellipsis  break-all">
            {mod.internal.name}
          </div>
          <div
            className="font-light text-xs h-4 overflow-hidden text-ellipsis break-all"
            style={{
              maxWidth: "85%",
            }}
          >
            Created By {mod.owner.spa_username}
          </div>
          <div
            className="font-light text-xs h-4 overflow-hidden text-ellipsis break-all"
            style={{
              maxWidth: "85%",
            }}
          >
            Version {mod.versions[0].version} for{" "}
            {mod.versions[0].game_version.version}
          </div>
        </div>
      </div>
    </NavLink>
  );
};

const HomePage = () => {
  const [searchParams] = useSearchParams();
  const category = searchParams.get("category");
  searchParams;

  // set category on load
  useEffect(() => {
    if (Categories.includes(category as Category))
      setActiveTab(category as Category);
  }, []);

  const [activeTab, setActiveTab] = useState<Tab>("All Mods");
  const [search, setSearch] = useState<string>("");

  const results = useMods();
  const mods = results
    .map((res) => res.data)
    .filter(
      (item) =>
        activeTab === "All Mods" ||
        item?.internal.category.toLowerCase().includes(activeTab.toLowerCase())
    );

  return (
    <>
      <PageHeader title="Home" />
      <div>
        <div className="flex pb-3 justify-between items-center pr-3">
          <HomeTabs setActiveTab={setActiveTab} activeTab={activeTab} />
          <input
            type="text"
            className="px-4  py-1 rounded-2xl text-neutral-800 w-[15rem] text-sm"
            placeholder="Search Mods..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        {mods.length === 0 && <div>Failed To Fetch Mod List</div>}
        <div
          style={{
            maxHeight: "calc(100vh - 138px)",
          }}
          className="grid grid-cols-4 gap-4 pt-2 px-3 pb-6 xl:grid-cols-4 2xl:grid-cols-5 w-full overflow-y-auto"
        >
          {mods
            .filter(
              (item) =>
                item &&
                JSON.stringify(item)
                  .toLowerCase()
                  .includes(search.toLowerCase())
            )
            .map((mod) => mod && <ModItem mod={mod} key={mod.internal.id} />)}
        </div>
      </div>
    </>
  );
};

export default HomePage;

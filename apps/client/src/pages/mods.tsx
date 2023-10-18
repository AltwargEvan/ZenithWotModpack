import { useState } from "react";
import { NavLink, useSearchParams } from "react-router-dom";
import PageHeader from "@/layouts/PageHeader";
import { useMods } from "@/api";
import { MergedMod } from "@zenith/utils/apitypes";
import { Crosshair, Package2, Ruler, Wrench } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const ModCategories = [
  "Tools",
  "Reticle",
  "Mark of Excellence",
] as const;
export type ModCategory = (typeof ModCategories)[number];

const ModItem = ({ mod }: { mod: MergedMod }) => {
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
            {mod.name}
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

const ModsPage = () => {
  const [searchParams] = useSearchParams();
  const [tab, setTab] = useState(searchParams.get("category") || "All");
  const { data: mods } = useMods();

  return (
    <>
      <PageHeader title="Mods" subtext="Browse and install official mods." />
      <Tabs value={tab} onValueChange={(v) => setTab(v)} className="pt-2">
        <TabsList className="w-full grid-cols-4 grid h-12">
          <TabsTrigger value="All">
            <Package2 className="pr-2" size={28} />
            All Mods
          </TabsTrigger>
          <TabsTrigger value="Tools">
            <Wrench className="pr-2" size={28} />
            Tools
          </TabsTrigger>
          <TabsTrigger value="Reticle">
            <Crosshair className="pr-2" size={28} />
            Reticle
          </TabsTrigger>
          <TabsTrigger value="Mark of Excellence">
            <Ruler className="pr-2" size={28} />
            Mark of Excellence
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {/* <div
        style={{
          maxHeight: "calc(100vh - 138px)",
        }}
        className="grid grid-cols-4 gap-4 pt-2 px-3 pb-6 xl:grid-cols-4 2xl:grid-cols-5 w-full overflow-y-auto"
      >
        {mods &&
          mods
            .filter(
              (mod) => true
              // JSON.stringify(mod).toLowerCase().includes(search.toLowerCase())
            )
            .map((mod) => mod && <ModItem mod={mod} key={mod.id} />)}
      </div> */}
    </>
  );
};

export default ModsPage;

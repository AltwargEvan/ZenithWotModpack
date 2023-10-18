import { useState } from "react";
import { NavLink, useSearchParams } from "react-router-dom";
import PageHeader from "@/layouts/PageHeader";
import { MergedMod } from "@zenith/utils/apitypes";
import { Crosshair, Package2, Ruler, Wrench } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Label } from "@radix-ui/react-dropdown-menu";
import { useMods } from "@/api/supabase/mods";

export const ModCategories = [
  "Tools",
  "Reticle",
  "Mark of Excellence",
] as const;
export type ModCategory = (typeof ModCategories)[number];

const ModItem = ({ mod }: { mod: MergedMod }) => {
  return (
    <NavLink to={`/mod?id=${mod.id}`} className="group">
      <Card className="overflow-hidden h-54" color="blue">
        <CardHeader className="p-1 h-36 w-full">
          <div className="h-36 overflow-hidden rounded-sm  w-full">
            <img
              className="h-36  w-full object-cover object-center scale-105 group-hover:scale-[1.15] transition-all duration-100 cursor-pointer"
              src={mod.cover}
            />
          </div>
        </CardHeader>
        <CardFooter className="p-1 grid text-left">
          <Label className="flex h-6 overflow-hidden">{mod.name}</Label>

          <CardDescription className="flex h-6 overflow-hidden">
            Created By {mod.owner.spa_username}
          </CardDescription>
        </CardFooter>
      </Card>
    </NavLink>
  );
};

const ModsPage = () => {
  const [searchParams] = useSearchParams();
  const [tab, setTab] = useState(searchParams.get("category") || "All");
  const [search, setSearch] = useState("");
  const { data, isLoading } = useMods();

  const mods = data?.filter((mod) => {
    if (!JSON.stringify(mod).toLowerCase().includes(search.toLowerCase()))
      return false;
    if (tab === "All") return true;
    if (!mod.categories?.includes(tab as ModCategory)) return false;
    return true;
  });

  return (
    <>
      <PageHeader title="Mods" subtext="Browse and install official mods." />
      <Tabs value={tab} onValueChange={(v) => setTab(v)} className="pt-2">
        <TabsList className="w-full grid-cols-5 grid h-12">
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
          <div className="pl-2">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm   placeholder:text-muted-foreground"
              placeholder="Search..."
            />
          </div>
        </TabsList>
      </Tabs>
      {mods && (
        <ScrollArea className=" pt-2 pb-2 h-full">
          <div className="grid grid-cols-4 gap-4  xl:grid-cols-4 2xl:grid-cols-5 w-full">
            {mods.map((mod) => mod && <ModItem mod={mod} key={mod.id} />)}
          </div>
        </ScrollArea>
      )}
    </>
  );
};

export default ModsPage;

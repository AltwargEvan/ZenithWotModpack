import { useEffect } from "react";

import { useSheetsDBMods } from "../../features/data/fetchMods";
import { useModRouteStore } from "./modRouteStore";
import ModsNav from "./modsNav";
import ModList from "./modList";

const ModsPage = () => {
  const { data: mods, error, isLoading } = useSheetsDBMods();
  const setCategory = useModRouteStore((ctx) => ctx.setCategory);
  const setShowInstalled = useModRouteStore((ctx) => ctx.setShowInstalled);

  //  Set category to 'All' on route load
  useEffect(() => {
    setCategory("All Mods");
    setShowInstalled(true);
  }, []);

  return (
    <div className="flex p-4 flex-col w-full">
      <div className="w-full mb-4">
        <span className="text-3xl font-bold">Mods</span>
      </div>
      <hr className="border-secondary-100 p-2"></hr>
      <ModsNav />
      {!!error && <div>Something went wrong fetching mod list.</div>}
      {mods && <ModList mods={mods} />}
    </div>
  );
};

export default ModsPage;

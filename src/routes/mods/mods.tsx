import { useEffect } from "react";

import { useSheetsDBMods } from "../../features/data/fetchMods";
import { useModRouteStore } from "./modRouteStore";
import ModsNav from "./modsNav";
import ModList from "./modList";
import { useRouteTitle } from "../../stores/pageTitleStore";

const ModsPage = () => {
  useRouteTitle("");
  const { data: mods, error, isLoading } = useSheetsDBMods();
  const setCategory = useModRouteStore((ctx) => ctx.setCategory);
  const setShowInstalled = useModRouteStore((ctx) => ctx.setShowInstalled);
  //  Set category to 'All' on route load
  useEffect(() => {
    setCategory("All Mods");
    setShowInstalled(true);
  }, []);

  return (
    <div className="flex flex-col">
      <ModsNav />
      {!!error && <div>Something went wrong fetching mod list.</div>}
      {mods && <ModList mods={mods} />}
    </div>
  );
};

export default ModsPage;

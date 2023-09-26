import { useLayout } from "@/stores/rootLayoutStore";
import { useQuery } from "@tanstack/react-query";
import { fetchWGModResult, getCachedMods, useMods } from "@/api";
import { InstallButton } from "./installButton";
import { Link } from "@tanstack/react-router";

const ModItem = ({
  mod,
  refetchCache,
}: {
  mod: fetchWGModResult;
  refetchCache: () => Promise<unknown>;
}) => {
  return (
    <div
      className="h-16 rounded bg-neutral-700  hover:bg-neutral-600 relative overflow-hidden"
      style={{
        backgroundImage: `url(${mod.cover})`,
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
      }}
    >
      <div className="p-4 flex justify-between backdrop-blur">
        <div className="flex h-full">
          <div className="flex">
            <Link to="/mod/$id" params={{ id: mod.internal.id.toString() }}>
              <span className="font-medium text-lg">{mod.internal.name}</span>
            </Link>
          </div>
        </div>
        <div className="flex h-full items-center justify-center">
          <InstallButton mod={mod} refetchCache={refetchCache} />
        </div>
      </div>
    </div>
  );
};

const YourMods = () => {
  useLayout("Your Mods");
  const { data: cachedMods, refetch: refetchCache } = useQuery({
    queryFn: getCachedMods,
    queryKey: ["cachedMods"],
  });

  const res = useMods();
  const mods = res.map((res) => res.data);

  const modsAggregated = cachedMods?.map((mod) => {
    const data = mods.find((item) => item?.internal.id === mod?.id);
    if (data) return { ...data };
  });

  return (
    <div>
      <div
        style={{
          maxHeight: "calc(100vh - 138px)",
        }}
        className="grid w-full overflow-y-auto px-3 space-y-2"
      >
        {modsAggregated?.map(
          (mod) =>
            mod && (
              <ModItem
                key={mod.internal.id}
                mod={mod}
                refetchCache={refetchCache}
              />
            )
        )}
      </div>
    </div>
  );
};

export default YourMods;

import { MergedMod } from "@zenith/utils/apitypes";
import PageHeader from "@/layouts/PageHeader";
import { useSession } from "@/lib/supabase/supabaseContext";
import { useMods } from "@/api/supabase/mods";
import { useProfile } from "@/api/supabase/profile";
import { Link } from "react-router-dom";

const ModItem = ({ mod }: { mod: MergedMod }) => {
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
  const session = useSession();
  const { data: mods } = useMods();
  const { data: profile } = useProfile(session?.user.id);

  return (
    <>
      <PageHeader title="Your Mods" subtext="Manage your mods" />
      <div>
        <div className="grid w-full overflow-y-auto px-3 space-y-2"></div>
      </div>
    </>
  );
};

export default YourMods;

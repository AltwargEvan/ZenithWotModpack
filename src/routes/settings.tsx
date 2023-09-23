import { useState } from "react";
import { useRouteTitle } from "../stores/pageTitleStore";
import { useQuery } from "@tanstack/react-query";
import { detectGameDirectories } from "../utils/detectGameDirectories";
import { GameDirectoryInput } from "@/components/GameDirectoryInput";

const SettingsPage = () => {
  useRouteTitle("Settings");

  const [error, setError] = useState<string | undefined>();

  // if (!data) return <div>failed to fetch settings</div>;
  return (
    <div className="flex flex-col gap-0.5 justify-between h-full px-3">
      <div>
        <label>Game Directory</label>
        <GameDirectoryInput setError={setError} />
        {error && <span className="text-red-500">{error}</span>}
      </div>
    </div>
  );
};

export default SettingsPage;

import { useState } from "react";
import { useRouteTitle } from "../stores/pageTitleStore";
import { GameDirectoryInput } from "@/components/GameDirectoryInput";
import { useQuery } from "@tanstack/react-query";
import { detectGameVersion } from "@/api";

const SettingsPage = () => {
  useRouteTitle("Settings");

  const [gameDirectoryError, setGameDirectoryError] = useState<
    string | undefined
  >();

  const { data } = useQuery({
    queryFn: detectGameVersion,
    queryKey: ["detectGameVersion"],
  });
  console.log(data);
  return (
    <div className="flex flex-col gap-0.5 justify-between h-full px-3">
      <div>
        <label>Game Directory</label>
        <GameDirectoryInput setError={setGameDirectoryError} />
        {gameDirectoryError && (
          <span className="text-red-500">{gameDirectoryError}</span>
        )}
      </div>
    </div>
  );
};

export default SettingsPage;

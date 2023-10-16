import { useState } from "react";
import { GameDirectoryInput } from "@/components/GameDirectoryInput";
import PageHeader from "@/layouts/PageHeader";

const SettingsPage = () => {
  const [gameDirectoryError, setGameDirectoryError] = useState<
    string | undefined
  >();

  return (
    <>
      <PageHeader title="Settings" />
      <div className="flex flex-col gap-0.5 justify-between h-full px-3">
        <div>
          <label>Game Directory</label>
          <GameDirectoryInput setError={setGameDirectoryError} />
          {gameDirectoryError && (
            <span className="text-red-500">{gameDirectoryError}</span>
          )}
        </div>
      </div>
    </>
  );
};

export default SettingsPage;

import { useEffect, useState } from "react";
import FileDirInput from "../components/FileDirInput";
import Button from "../components/Button";
import { useModInstallState } from "../features/data/installState";

const SettingsPage = () => {
  const clearCache = useModInstallState((ctx) => ctx.clearCache);

  const [gameDir, setGameDir] = useState(localStorage.getItem("gameDir") || "");
  useEffect(() => {
    localStorage.setItem("gameDir", gameDir);
  }, [gameDir]);

  async function handleClearCache() {
    await clearCache();
  }

  return (
    <div className="flex p-4 flex-col w-full">
      <div className="w-full mb-4">
        <span className="text-3xl font-bold">Settings</span>
      </div>
      <hr className="border-secondary-100 p-2"></hr>
      <div className="flex flex-col gap-4">
        <label>Game Directory</label>
        <FileDirInput
          value={gameDir}
          setValue={setGameDir}
          className="text-black rounded overflow-hidden"
        />
        <Button onClick={handleClearCache} className="p-1 rounded">
          Clear App Cache
        </Button>
      </div>
    </div>
  );
};

export default SettingsPage;

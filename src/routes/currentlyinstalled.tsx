import Button from "../components/Button";
import FileDirInput from "../components/FileDirInput";
import React from "react";
import { ModList } from "../data/modlist";
const CurrentlyInstalledPage = () => {
  const onSubmit = () => {
    ModList[0].install(gameDir);
  };

  const [modCdnId, setModCdnId] = React.useState<string>(
    "tomatogg-1.4.1_j4KLlAJ.zip"
  );
  const [gameDir, setGameDir] = React.useState(`C:\\Games\\World_of_Tanks_NA`);

  return (
    <div className="flex p-4 flex-col w-full">
      <div className="w-full mb-4">
        <span className="text-3xl font-bold">Currently Installed</span>
      </div>
      <hr className="border-secondary-100 p-2"></hr>
      <form className="w-full space-y-1">
        <label>Game Directory</label>
        <FileDirInput
          value={gameDir}
          setValue={setGameDir}
          className="w-full text-black p-1"
        />
        <label>Mod Id</label>
        <input
          value={modCdnId}
          onChange={(e) => setModCdnId(e.currentTarget.value)}
          className="w-full text-black p-1"
        />
        <Button onClick={onSubmit}>Install</Button>
      </form>
    </div>
  );
};

export default CurrentlyInstalledPage;

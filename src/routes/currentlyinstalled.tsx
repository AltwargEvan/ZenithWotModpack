import { useMutation } from "@tanstack/react-query";
import Button from "../components/Button";
import FileDirInput from "../components/FileDirInput";
import React from "react";
import { downloadMod } from "../api/wargaming/downloadMod";
import { invoke } from "@tauri-apps/api";

const CurrentlyInstalledPage = () => {
  const { data, mutate } = useMutation({
    mutationKey: ["hello"],
    mutationFn: async () => {
      const modFileLocation = await downloadMod(modCdnId);
      // console.log("Downloaded mod", modCdnId, "to location", modFileLocation);
      if (modFileLocation.endsWith(".zip")) {
        console.log("File detected as zip file. Unzipping to game dir");
        const res = await invoke("unzip_file", {
          filePath: modFileLocation,
          targetDir: `${gameDir}\\mods`,
        });
        console.log(res);
      }
    },
  });

  const onSubmit = () => {
    mutate();
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
      <div>Data: {JSON.stringify(data)}</div>
    </div>
  );
};

export default CurrentlyInstalledPage;

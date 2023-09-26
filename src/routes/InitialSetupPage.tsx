import { useState } from "react";
import { GameDirectoryInput } from "@/components/GameDirectoryInput";

import { Config, detectGameDirectories, setGameDirectory } from "@/api";
import { useConfig } from "@/stores/configStore";
import { FormControl, MenuItem, Select } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { open } from "@tauri-apps/api/dialog";

const InitialSetupPage = ({
  setInitVals,
}: {
  setInitVals: React.Dispatch<Config | undefined>;
}) => {
  const [gameDirectory, setGameDir] = useState("");

  const [gameDirectoryError, setGameDirectoryError] = useState<
    string | undefined
  >();

  const { data: detectedGameDirectories } = useQuery({
    queryKey: ["detectGameDirectories"],
    queryFn: detectGameDirectories,
  });

  let options = new Array<string>();
  if (detectedGameDirectories)
    options = options.concat(detectedGameDirectories);
  if (gameDirectory && !options.includes(gameDirectory))
    options.push(gameDirectory);
  options.push("Browse...");

  return (
    <div className="flex flex-col gap-0.5  h-full  w-full space-y-4 p-4 px-8">
      <div className="flex flex-col">
        <span className="text-3xl font-bold">Setup</span>
      </div>
      <div>
        <label>Game Directory - </label>
        <span className="font-thin">
          Select your game directory to continue
        </span>

        <FormControl fullWidth className="bg-white rounded">
          <Select
            value={gameDirectory}
            onChange={async (event) => {
              event.preventDefault();
              let value: string | string[] | null = event.target.value;
              if (value === "Browse...")
                value = await open({
                  multiple: false,
                  title: "Select World Of Tanks Game Directory",
                  directory: true,
                });
              if (!value || typeof value !== "string") return;
              try {
                await setGameDirectory(value);
                setGameDir(value);
                setGameDirectoryError(undefined);
              } catch (e) {
                console.error("Failed to set game directory with error:", e);
                setGameDirectoryError(e as string);
              }
            }}
          >
            {options.map((item) => (
              <MenuItem value={item} key={item}>
                {item}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        {gameDirectoryError && (
          <span className="text-red-500">{gameDirectoryError}</span>
        )}
      </div>
      <div>
        <button
          className="w-full rounded bg-yellow-400 hover:bg-yellow-500 text-black p-2 text-lg"
          onClick={() => {
            if (gameDirectory) {
              setInitVals({ game_directory: gameDirectory });
            }
          }}
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default InitialSetupPage;

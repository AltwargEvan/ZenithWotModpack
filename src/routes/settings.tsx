import { useState } from "react";
import { useRouteTitle } from "../stores/pageTitleStore";
import { Autocomplete, Button, FormControl, TextField } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { detectGameDirectories } from "../utils/detectGameDirectories";
import { open } from "@tauri-apps/api/dialog";
import { useModInstallState } from "../stores/modInstallStateStore";
import { invoke } from "@tauri-apps/api/tauri";
import { Config, getConfig } from "@/api";
import React from "react";

const SettingsPage = () => {
  useRouteTitle("Settings");
  const [data, setData] = useState<Config | undefined>();
  console.log(data);

  React.useEffect(() => {
    getConfig()
      .then((data) => setData(data))
      .catch(console.error);
  }, []);

  const [error, setError] = useState<string | undefined>();
  const clearCache = useModInstallState((ctx) => ctx.clearCache);
  async function handleClearCache() {
    await clearCache();
  }

  const { data: detectedGameDirectories } = useQuery({
    queryKey: ["detectedGameDirectories"],
    queryFn: detectGameDirectories,
  });
  // if (!data) return <div>failed to fetch settings</div>;
  return (
    <div className="flex flex-col gap-0.5 justify-between h-full px-3">
      <div>
        <label>Game Directory</label>

        <FormControl fullWidth variant="filled" className="bg-white rounded">
          <Autocomplete
            options={
              detectedGameDirectories
                ? detectedGameDirectories.concat("Browse...")
                : ["Browse..."]
            }
            // value={data.gameDirectory}
            renderInput={(params) => <TextField {...params} />}
            onChange={async (event, values) => {
              event.preventDefault();
              // setError(undefined);
              // if (!values) return;
              // if (values === "Browse...") {
              //   try {
              //     const selectedPath = await open({
              //       multiple: false,
              //       title: "Select World Of Tanks Game Directory",
              //       directory: true,
              //     });
              //     await settings.setGameDirectory(selectedPath as string);
              //   } catch (e) {
              //     setError((e as Error).message);
              //   }
              // } else {
              //   await settings.setGameDirectory(values);
              // }
            }}
          />
        </FormControl>
        {error && <span className="text-red-500">{error}</span>}
      </div>
      <div>
        <div className="w-full">
          <Button
            onClick={handleClearCache}
            className="p-1 rounded bg-blue-500 text-black font-oswald w-full"
            variant="contained"
          >
            Clear Mod Downloads Cache
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;

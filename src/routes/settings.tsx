import { useState } from "react";
import { useRouteTitle } from "../stores/pageTitleStore";
import { Autocomplete, Button, FormControl, TextField } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { detectGameDirectories } from "../utils/detectGameDirectories";
import { useSettings } from "../stores/settingsStore";
import { open } from "@tauri-apps/api/dialog";
import { useModInstallState } from "../stores/modInstallStateStore";

const SettingsPage = () => {
  useRouteTitle("Settings");
  const [error, setError] = useState<string | undefined>();
  const clearCache = useModInstallState((ctx) => ctx.clearCache);
  async function handleClearCache() {
    await clearCache();
  }

  const { data: detectedGameDirectories } = useQuery({
    queryKey: ["detectedGameDirectories"],
    queryFn: detectGameDirectories,
  });

  const settings = useSettings();
  return (
    <div className="flex flex-col gap-0.5 justify-between h-full">
      <div>
        <label>Game Directory</label>

        <FormControl fullWidth variant="filled" className="bg-white rounded">
          <Autocomplete
            options={
              detectedGameDirectories
                ? detectedGameDirectories.concat("Browse...")
                : ["Browse..."]
            }
            value={settings.gameDirectory}
            renderInput={(params) => <TextField {...params} />}
            onChange={async (event, values) => {
              event.preventDefault();
              setError(undefined);
              if (!values) return;
              if (values === "Browse...") {
                try {
                  const selectedPath = await open({
                    multiple: false,
                    title: "Select World Of Tanks Game Directory",
                    directory: true,
                  });
                  await settings.setGameDirectory(selectedPath as string);
                } catch (e) {
                  setError((e as Error).message);
                }
              } else {
                await settings.setGameDirectory(values);
              }
            }}
          />
        </FormControl>
        {error && <span className="text-red-500">{error}</span>}
      </div>
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
  );
};

export default SettingsPage;

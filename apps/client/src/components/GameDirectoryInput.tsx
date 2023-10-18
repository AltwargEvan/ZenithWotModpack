import { detectGameDirectories } from "@/api";
import { useConfig } from "@/stores/configStore";
// import { FormControl, MenuItem, Select } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { open } from "@tauri-apps/api/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Label } from "@radix-ui/react-label";

export const GameDirectoryInput = () => {
  // const gameDirectory = useConfig((ctx) => ctx.game_directory);
  const gameDirectory = "game dir";

  return (
    <>
      <Select>
        <SelectTrigger className="">
          <SelectValue placeholder="Theme" defaultValue={gameDirectory} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="light">Detected Dir 1</SelectItem>
          <SelectItem value="dark">Detected Dir 2</SelectItem>
          <SelectItem value="system">Detected Dir 3</SelectItem>
          <SelectItem value="brosse">Browse...</SelectItem>
        </SelectContent>
      </Select>
    </>
  );
  // const setGameDirectory = useConfig((ctx) => ctx.setGameDirectory);

  // const { data: detectedGameDirectories } = useQuery({
  //   queryKey: ["detectGameDirectories"],
  //   queryFn: detectGameDirectories,
  // });

  // let options = new Array<string>();
  // if (detectedGameDirectories)
  //   options = options.concat(detectedGameDirectories);
  // if (gameDirectory && !options.includes(gameDirectory))
  //   options.push(gameDirectory);
  // options.push("Browse...");

  // return (
  //   <FormControl fullWidth className="bg-white rounded">
  //     <Select
  //       value={gameDirectory}
  //       onChange={async (event) => {
  //         event.preventDefault();
  //         let value: string | string[] | null = event.target.value;
  //         if (value === "Browse...")
  //           value = await open({
  //             multiple: false,
  //             title: "Select World Of Tanks Game Directory",
  //             directory: true,
  //           });
  //         if (!value || typeof value !== "string") return;
  //         try {
  //           await setGameDirectory(value);
  //           setError(undefined);
  //         } catch (e) {
  //           console.error("Failed to set game directory with error:", e);
  //           setError(e as string);
  //         }
  //       }}
  //     >
  //       {options.map((item) => (
  //         <MenuItem value={item} key={item}>
  //           {item}
  //         </MenuItem>
  //       ))}
  //     </Select>
  //   </FormControl>
  // );
};

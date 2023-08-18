import React from "react";
import { open } from "@tauri-apps/api/dialog";
import Button from "./Button";
const FileDirInput = ({
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) => {
  const [game_dir, set_game_dir] = React.useState(
    `C:\\Games\\World_of_Tanks_NA`
  );
  const handleClick = async () => {
    try {
      const selectedPath = await open({
        multiple: false,
        title: "Select World Of Tanks Game Directory",
        directory: true,
      });
      console.log(selectedPath);
      if (typeof selectedPath === "string") set_game_dir(selectedPath);
    } catch (err) {
      console.error(err);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    set_game_dir(e.currentTarget.value);
  };

  return (
    <div className="w-full">
      <input
        {...props}
        type="string"
        value={game_dir}
        onClick={handleClick}
        onChange={handleChange}
      />
      <Button onClick={handleClick}>Select File</Button>
    </div>
  );
};

export default FileDirInput;

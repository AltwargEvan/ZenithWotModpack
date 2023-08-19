import React from "react";
import { open } from "@tauri-apps/api/dialog";
import Button from "./Button";
const FileDirInput = ({
  value,
  setValue,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & {
  value: string;
  setValue: React.Dispatch<string>;
}) => {
  const handleClick = async () => {
    try {
      const selectedPath = await open({
        multiple: false,
        title: "Select World Of Tanks Game Directory",
        directory: true,
      });
      console.log(selectedPath);
      if (typeof selectedPath === "string") setValue(selectedPath);
    } catch (err) {
      console.error(err);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.currentTarget.value);
  };

  return (
    <div className="w-full">
      <input
        {...props}
        type="string"
        value={value}
        onClick={handleClick}
        onChange={handleChange}
      />
      <Button onClick={handleClick}>Select File</Button>
    </div>
  );
};

export default FileDirInput;

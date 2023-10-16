import React from "react";
import { open } from "@tauri-apps/api/dialog";
import Button from "./ui/Button";
import { twMerge } from "tailwind-merge";
const FileDirInput = ({
  value,
  setValue,
  className,
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

  const classMerge = twMerge(
    className,
    "w-full flex border border-white bg-white"
  );
  return (
    <div className={classMerge}>
      <input
        {...props}
        className="h-10 grow pl-2 ring-0 outline-0 border-0"
        type="string"
        value={value}
        onChange={handleChange}
      />
      <Button
        onClick={handleClick}
        className="p-2 h-10 text-white rounded-r min-w-[10rem]"
      >
        Select File
      </Button>
    </div>
  );
};

export default FileDirInput;

import { SubmitHandler, useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { invoke } from "@tauri-apps/api/tauri";
import Button from "../components/Button";
import FileDirInput from "../components/FileDirInput";
import React from "react";

type Inputs = {
  mod_id: string;
};

const CurrentlyInstalledPage = () => {
  const { data, mutate } = useMutation({
    mutationKey: ["hello"],
    mutationFn: async (data: { gameDir: string; modId: number }) => {
      console.log("invoke data", data);
      return await invoke("install_mod", data);
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    console.log("form data", data);
    mutate({ gameDir: game_dir, modId: parseInt(data.mod_id) });
  };
  const [game_dir, set_game_dir] = React.useState(
    `C:\\Games\\World_of_Tanks_NA`
  );

  return (
    <div className="flex p-4 flex-col w-full">
      <div className="w-full mb-4">
        <span className="text-3xl font-bold">Currently Installed</span>
      </div>
      <hr className="border-secondary-100 p-2"></hr>
      <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-1">
        <label>Game Directory</label>
        <FileDirInput
          value={game_dir}
          setValue={set_game_dir}
          className="w-full text-black p-1"
        />
        <label>Mod Id</label>
        <input
          defaultValue={6391}
          {...register("mod_id")}
          className="w-full text-black p-1"
        />
        <Button>Install</Button>
      </form>
      <div>Data: {JSON.stringify(data)}</div>
    </div>
  );
};

export default CurrentlyInstalledPage;

import { SubmitHandler, useForm } from "react-hook-form";
import { useMutation, useQuery } from "@tanstack/react-query";
import { invoke } from "@tauri-apps/api/tauri";

type Inputs = {
  modid: number;
  gamedir: string;
};

const CurrentlyInstalledPage = () => {
  const { data, mutate } = useMutation({
    mutationKey: ["hello"],
    mutationFn: async (data: { gamedir: string; modid: number }) => {
      return await invoke("installmod", data);
    },
  });

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    console.log(data);
    mutate(data);
  };

  return (
    <div className="flex p-4 flex-col w-full">
      <div className="w-full mb-4">
        <span className="text-3xl font-bold">Currently Installed</span>
      </div>
      <hr className="border-secondary-100 p-2"></hr>
      <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-1">
        <label>Game Directory</label>
        <input
          defaultValue="test"
          {...register("gamedir")}
          className="w-full text-black p-1"
        />
      </form>
      <div>Data: {JSON.stringify(data)}</div>
    </div>
  );
};

export default CurrentlyInstalledPage;

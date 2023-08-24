import Button from "../components/Button";
import FileDirInput from "../components/FileDirInput";
import React from "react";
import { useModInstallState } from "../features/data/installState";

const CurrentlyInstalledPage = () => {
  const installed = useModInstallState((ctx) => ctx.gameInstalls);

  return (
    <div className="flex p-4 flex-col w-full">
      <div className="w-full mb-4">
        <span className="text-3xl font-bold">Currently Installed</span>
      </div>
      <hr className="border-secondary-100 p-2"></hr>
    </div>
  );
};

export default CurrentlyInstalledPage;

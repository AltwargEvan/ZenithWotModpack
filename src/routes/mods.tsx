import { useState } from "react";
import { ModList } from "../data/modlist";
import { twMerge } from "tailwind-merge";
import { ModCategories, ModCategory } from "../modInstaller/mod";

const ModsPage = () => {
  const [category, setCategory] = useState<ModCategory | "All">("All");
  const ModFilterPill = ({ value }: { value: ModCategory | "All" }) => {
    const baseClass = "m-1 h-9 flex justify-center items-center  rounded-lg  ";
    const className = twMerge(
      baseClass,
      value === category
        ? "bg-primary-300 hover:bg-primary-200"
        : "bg-secondary-300 hover:bg-secondary-200"
    );
    return (
      <div
        onClick={() => {
          setCategory(value);
        }}
        className={className}
      >
        {value}
      </div>
    );
  };
  return (
    <div className="flex p-4 flex-col w-full">
      <div className="w-full mb-4">
        <span className="text-3xl font-bold">Mods</span>
      </div>
      <hr className="border-secondary-100 p-2"></hr>
      <div>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <svg
              className="w-4 h-4 text-secondary-200"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 20"
            >
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
              />
            </svg>
          </div>
          <input
            type="search"
            className="block w-full py-2 pr-4 pl-10 text-sm rounded-2xl bg-secondary-500 focus:ring-blue-500 focus:border-blue-500 "
            placeholder="Search Mods..."
          />
        </div>
      </div>
      <div className="grid lg:grid-cols-5 mt-3 grid-cols-3">
        <ModFilterPill value="All" />

        {ModCategories.map((key) => (
          <ModFilterPill value={key} key={key} />
        ))}
        {/* the intent is that this button will open up a modal that shows the current 
        user profiles and when selected it will show the mods that are part of it */}
        {/* we also want a option to download streamer configs */}
      </div>
      <div className="grid lg:grid-cols-5 grid-cols-3 mt-5 overflow-y-scroll">
        {ModList.filter(
          (mod) => category === "All" || mod.category === category
        ).map((mod) => {
          return (
            <div className="bg-secondary-400 h-48 m-1  flex justify-center items-center rounded-lg">
              <div className="grid text-center">
                <span>Name: {mod.name}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ModsPage;

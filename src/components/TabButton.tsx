import { twMerge } from "tailwind-merge";

export const TabButton = (
  props: React.ButtonHTMLAttributes<HTMLButtonElement> & { selected?: boolean }
) => {
  return (
    <button
      className={twMerge(
        "px-3 py-2  rounded flex space-x-2 items-center",
        props.selected
          ? " bg-neutral-500/40"
          : "bg-transparent hover:bg-neutral-500/10"
      )}
      {...props}
    ></button>
  );
};

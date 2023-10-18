import { appWindow } from "@tauri-apps/api/window";
import { X, Square, Minus } from "lucide-react";
const TitleBar = () => {
  return (
    <>
      <div
        data-tauri-drag-region
        className="h-9 bg-neutral-950 select-none flex justify-end fixed top-px left-px right-px  z-50 border-neutral-700 border-b"
      >
        <div
          className="inline-flex justify-center align-middle w-9 h-9 hover:bg-neutral-800"
          id="titlebar-minimize"
          onClick={() => appWindow.minimize()}
        >
          <Minus className="h-9" strokeWidth={1} />
        </div>
        <div
          className="inline-flex justify-center align-middle w-9 h-9 hover:bg-neutral-800"
          id="titlebar-minimize"
          onClick={() => appWindow.toggleMaximize()}
        >
          <Square className=" h-9 scale-75" strokeWidth={1} />
        </div>
        <div
          className="inline-flex justify-center align-middle w-9 h-9 hover:bg-neutral-800"
          id="titlebar-minimize"
          onClick={() => appWindow.close()}
        >
          <X className="h-9" strokeWidth={1} />
        </div>
      </div>
      {/* Filler div to make sure rest of content goes under nav */}
      <div className="h-9 invisible"></div>
    </>
  );
};

export default TitleBar;

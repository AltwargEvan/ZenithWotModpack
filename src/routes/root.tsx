import { Outlet } from "@tanstack/react-router";
import Navbar from "../layouts/Navbar";
import TitleBar from "../layouts/Titlebar";
import { usePageTitleStore } from "../stores/pageTitleStore";
import { ConfigContextProvider } from "@/stores/configStore";
import { useQuery } from "@tanstack/react-query";
import { getConfig } from "@/api";

const Root = () => {
  const routeTitle = usePageTitleStore();

  // FETCH ALL INITIAL DATA TO PROVIDE TO CHILDREN
  const { data: config } = useQuery({
    queryKey: ["config"],
    queryFn: getConfig,
  });

  // need to fetch this from game files
  const gameVersion = "12";
  // return loading state here

  if (!config)
    return (
      <div className="border-neutral-600 border h-screen w-screen font-oswald">
        <TitleBar />
      </div>
    );

  return (
    <ConfigContextProvider value={{ ...config, gameVersion }}>
      <div className="border-neutral-600 border h-screen w-screen font-oswald">
        <TitleBar />
        <Navbar />
        <div
          className="bg-gradient-to-bl from-neutral-900/90    to-neutral-950 border-t fixed  grow flex w-full text-white bprder-r-px border-neutral-600 "
          style={{
            height: "calc(100% - 2.25rem - 1px)",
            width: "calc(100% - 4rem - 1px)",
            left: "4rem",
            top: "2.25rem",
          }}
        >
          <div className="flex xl:px-24 p-4 w-full flex-col">
            <div className="h-12 pb-4 px-3">
              <span className="text-3xl font-bold">{routeTitle}</span>
            </div>
            <Outlet />
          </div>
        </div>
      </div>
    </ConfigContextProvider>
  );
};

export default Root;

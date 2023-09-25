import { Outlet } from "@tanstack/react-router";
import Navbar from "../layouts/Navbar";
import TitleBar from "../layouts/Titlebar";
import { useRootLayoutStore } from "../stores/rootLayoutStore";
import { ConfigContextProvider } from "@/stores/configStore";
import { useQueries } from "@tanstack/react-query";
import { getGameVersion, getConfig } from "@/api";

const Root = () => {
  const { title, backgroundUrl } = useRootLayoutStore();

  // FETCH ALL INITIAL DATA TO PROVIDE TO CHILDREN
  const results = useQueries({
    queries: [
      {
        queryKey: ["config"],
        queryFn: getConfig,
        retry: false,
      },
      {
        queryKey: ["gameVersion"],
        queryFn: getGameVersion,
        retry: false,
      },
    ],
  });

  const {
    data: config,
    isLoading: configLoading,
    error: configError,
  } = results[0];
  const { data: gameVersion, isLoading: gameVersionLoading } = results[1];

  // error
  if (configError)
    return (
      <div className="border-neutral-600 border h-screen w-screen font-oswald">
        <TitleBar />
        Error Doing Initial Fetch
      </div>
    );

  // loading
  if (configLoading || gameVersionLoading)
    return (
      <div className="border-neutral-600 border h-screen w-screen font-oswald">
        <TitleBar />
        Loading
      </div>
    );

  // success
  if (config)
    return (
      <ConfigContextProvider
        value={{ ...config, gameVersion: gameVersion || null }}
      >
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
                <span className="text-3xl font-bold">{title}</span>
              </div>

              <Outlet />
            </div>
            {backgroundUrl && (
              <div
                className="fixed h-32 w-full -z-20 bg-center bg-no-repeat bg-cover blur opacity-50"
                style={{
                  top: "2.25rem",
                  backgroundImage: `url(${backgroundUrl})`,
                }}
              />
            )}
          </div>
        </div>
      </ConfigContextProvider>
    );
};

export default Root;

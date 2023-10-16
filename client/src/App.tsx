import routes from "~react-pages";
import { BrowserRouter, useRoutes } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { StyledEngineProvider } from "@mui/material";
import { queryClient } from "./utils/QueryClient";
import { ReactNode } from "react";
import TitleBar from "./layouts/Titlebar";
import Navbar from "./layouts/Navbar";
import { useRootLayoutStore } from "./stores/rootLayoutStore";

const RootLayout = ({ children }: { children: ReactNode }) => {
  const InitialSetupComplete = true;
  const { title, backgroundUrl } = useRootLayoutStore();

  // if (InitialSetupComplete) return children;

  return (
    <div className="border-neutral-600 border h-screen w-screen font-oswald">
      <TitleBar />
      <Navbar />
      <div
        className=" border-t fixed  grow flex w-full  bprder-r-px border-neutral-600 "
        style={{
          height: "calc(100% - 2.25rem - 1px)",
          width: "calc(100% - 4rem - 1px)",
          left: "4rem",
          top: "2.25rem",
        }}
      >
        <div>
          <div className="h-12 pb-4 px-3">
            <span className="text-3xl font-bold">{title}</span>
          </div>

          {children}
        </div>
      </div>
    </div>
  );
};

const AppOuterLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="border-neutral-600 border h-screen w-screen font-oswald bg-gradient-to-bl from-neutral-900/90 to-neutral-950 text-white">
      <TitleBar />
      {children}
    </div>
  );
};

const AppInnerLayout = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <Navbar />
      <div
        className="border-t fixed grow flex w-full  bprder-r-px border-neutral-600 "
        style={{
          height: "calc(100% - 2.25rem - 1px)",
          width: "calc(100% - 4.5rem - 1px)",
          left: "5rem",
          top: "2.25rem",
        }}
      >
        <div className="flex xl:px-24 p-3 w-full flex-col">{children}</div>
      </div>
    </>
  );
};

const InitialSetup = () => {
  return <div>TODO</div>;
};

const AppProviders = ({ children }: { children: ReactNode }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <StyledEngineProvider injectFirst>{children}</StyledEngineProvider>
    </QueryClientProvider>
  );
};

const App = () => {
  const Routes = () => useRoutes(routes);

  const UserBootstrapComplete = true;

  if (!UserBootstrapComplete)
    return (
      <AppOuterLayout>
        <InitialSetup />
      </AppOuterLayout>
    );

  return (
    <AppOuterLayout>
      <AppProviders>
        <BrowserRouter>
          <AppInnerLayout>
            <Routes />
          </AppInnerLayout>
        </BrowserRouter>
      </AppProviders>
    </AppOuterLayout>
  );
};

export default App;

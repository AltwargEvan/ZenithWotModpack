import routes from "~react-pages";
import { BrowserRouter, useRoutes } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/utils/QueryClient";
import { ReactNode } from "react";
import TitleBar from "@/layouts/Titlebar";
import Navbar from "@/layouts/Navbar";

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

const AppInner = () => {
  const Routes = () => useRoutes(routes);

  return (
    <BrowserRouter>
      <AppInnerLayout>
        <Routes />
      </AppInnerLayout>
    </BrowserRouter>
  );
};

const App = () => {
  const UserBootstrapComplete = true;

  return (
    <QueryClientProvider client={queryClient}>
      <AppOuterLayout>
        {!UserBootstrapComplete && <InitialSetup />}
        {UserBootstrapComplete && <AppInner />}
      </AppOuterLayout>
    </QueryClientProvider>
  );
};

export default App;

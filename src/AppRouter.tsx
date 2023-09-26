import {
  RouterProvider,
  Router,
  Route,
  RootRoute,
  createHashHistory,
} from "@tanstack/react-router";
import Root from "./routes/root";
import HomePage, { Category } from "./routes/home";
import SettingsPage from "./routes/settings";
import ModPage from "./routes/modPage/modPage";
import YourMods from "./routes/yourMods/yourMods";
import StreamersPage from "./routes/streamers/streamers";
const rootRoute = new RootRoute({
  component: Root,
});

const homeRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "/",
  component: HomePage,
});

const settingsRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "/settings",
  component: SettingsPage,
});

const streamersRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "/streamers",
  component: StreamersPage,
});
const mod = new Route({
  getParentRoute: () => rootRoute,
  path: "/mod/$id",
  component: ModPage,
});

const yourMods = new Route({
  getParentRoute: () => rootRoute,
  path: "/yourMods",
  component: YourMods,
});

const routeTree = rootRoute.addChildren([
  homeRoute,
  settingsRoute,
  yourMods,
  mod,
  streamersRoute,
]);

const hashHistory = createHashHistory();
const router = new Router({ routeTree, history: hashHistory });

// Register your router for maximum type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

const AppRouter = () => {
  return <RouterProvider router={router} />;
};

export default AppRouter;

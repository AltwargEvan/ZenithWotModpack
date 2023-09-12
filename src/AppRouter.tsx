import {
  RouterProvider,
  Router,
  Route,
  RootRoute,
  createHashHistory,
} from "@tanstack/react-router";
import Root from "./routes/root";
import HomePage from "./routes/home";
import SettingsPage from "./routes/settings";
import ProfilesPage from "./routes/profiles";

const rootRoute = new RootRoute({
  component: Root,
});

const profilesRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "/profiles",
  component: ProfilesPage,
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

const routeTree = rootRoute.addChildren([
  homeRoute,
  profilesRoute,
  settingsRoute,
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

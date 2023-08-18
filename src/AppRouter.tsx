import {
  RouterProvider,
  Router,
  Route,
  RootRoute,
  createHashHistory,
} from "@tanstack/react-router";
import Root from "./routes/root";
import AboutPage from "./routes/about";
import ContactPage from "./routes/contact";
import ModsPage from "./routes/mods";
import SettingsPage from "./routes/settings";

const rootRoute = new RootRoute({
  component: Root,
});

const aboutRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "/about",
  component: AboutPage,
});
const contactRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "/contact",
  component: ContactPage,
});
const modsRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "/mods",
  component: ModsPage,
});
const settingsRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "/settings",
  component: SettingsPage,
});

const routeTree = rootRoute.addChildren([
  aboutRoute,
  contactRoute,
  modsRoute,
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

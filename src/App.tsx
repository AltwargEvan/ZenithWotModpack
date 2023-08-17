import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Root from "./routes/root";
import ErrorPage from "./routes/error";
import AboutPage from "./routes/about";
import ContactPage from "./routes/contact";
import ModsPage from "./routes/mods";
import SettingsPage from "./routes/settings";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/about",
        element: <AboutPage />,
      },
      {
        path: "/contact",
        element: <ContactPage />,
      },
      {
        path: "/mods",
        element: <ModsPage />,
      },

      {
        path: "/settings",
        element: <SettingsPage />,
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;

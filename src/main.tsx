import React from "react";
import ReactDOM from "react-dom/client";
import AppRouter from "./AppRouter";
import "./index.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const CACHE_AND_STALE_TIME = 15 * 60 * 1000; // 15 MINUTES
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: CACHE_AND_STALE_TIME, // defaults to 0. we want to not send wargaming to many API requests so noone cries
      cacheTime: CACHE_AND_STALE_TIME, // defaults to 5
      refetchOnWindowFocus: false,
    },
  },
});

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <AppRouter />
    </QueryClientProvider>
  </React.StrictMode>
);

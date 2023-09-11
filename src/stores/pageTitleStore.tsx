import { useEffect } from "react";
import { create } from "zustand";

export const usePageTitleStore = create<string>()(() => "");

export const useRouteTitle = (title: string) => {
  return useEffect(() => {
    usePageTitleStore.setState(title);
  }, []);
};

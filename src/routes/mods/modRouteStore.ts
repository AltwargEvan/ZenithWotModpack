import { create } from "zustand";

type ModRouteState = {
  category: string;
  setCategory: (category: string) => void;
  showInstalled: boolean;
  setShowInstalled: (value: boolean) => void;
};
export const useModRouteStore = create<ModRouteState>((set) => ({
  category: "All Mods",
  setCategory: (category) => set((state) => ({ ...state, category })),
  showInstalled: true,
  setShowInstalled: (showInstalled) =>
    set((state) => ({ ...state, showInstalled })),
}));

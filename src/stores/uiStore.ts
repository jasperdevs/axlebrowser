import { create } from "zustand";

interface UIStore {
  sidebarCollapsed: boolean;
  omniboxOpen: boolean;
  commandPaletteOpen: boolean;

  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  setOmniboxOpen: (open: boolean) => void;
  setCommandPaletteOpen: (open: boolean) => void;
}

export const useUIStore = create<UIStore>((set) => ({
  sidebarCollapsed: false,
  omniboxOpen: false,
  commandPaletteOpen: false,

  toggleSidebar: () =>
    set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
  setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
  setOmniboxOpen: (open) =>
    set({ omniboxOpen: open, commandPaletteOpen: false }),
  setCommandPaletteOpen: (open) =>
    set({ commandPaletteOpen: open, omniboxOpen: false }),
}));

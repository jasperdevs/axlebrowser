import { create } from "zustand";
import type { TabState, NavigationState } from "@shared/types/tabs";
import type { TabStateSnapshot } from "@shared/types/ipc";

interface TabStore {
  tabs: TabState[];
  pinnedTabs: TabState[];
  activeTabId: string | null;
  splitTabIds: string[];
  activeNavigation: NavigationState | null;

  // Actions
  setSnapshot: (snapshot: TabStateSnapshot) => void;
  setNavigation: (tabId: string, nav: NavigationState) => void;
  updateThumbnail: (tabId: string, dataUrl: string) => void;
}

export const useTabStore = create<TabStore>((set, get) => ({
  tabs: [],
  pinnedTabs: [],
  activeTabId: null,
  splitTabIds: [],
  activeNavigation: null,

  setSnapshot: (snapshot) => {
    set({
      tabs: snapshot.tabs,
      pinnedTabs: snapshot.pinnedTabs,
      activeTabId: snapshot.activeTabId,
      splitTabIds: snapshot.splitTabIds,
    });
  },

  setNavigation: (tabId, nav) => {
    const state = get();
    if (tabId === state.activeTabId) {
      set({ activeNavigation: nav });
    }
  },

  updateThumbnail: (tabId, dataUrl) => {
    set((state) => ({
      tabs: state.tabs.map((t) =>
        t.id === tabId ? { ...t, thumbnailDataUrl: dataUrl } : t,
      ),
      pinnedTabs: state.pinnedTabs.map((t) =>
        t.id === tabId ? { ...t, thumbnailDataUrl: dataUrl } : t,
      ),
    }));
  },
}));

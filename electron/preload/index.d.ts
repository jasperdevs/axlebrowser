import type { TabStateSnapshot } from "@shared/types/ipc";
import type { NavigationState } from "@shared/types/tabs";

export interface AxleAPI {
  createTab: (url?: string) => Promise<{ tabId: string }>;
  closeTab: (tabId: string) => Promise<void>;
  switchTab: (tabId: string) => Promise<void>;
  navigate: (tabId: string, url: string) => Promise<void>;
  goBack: (tabId: string) => Promise<void>;
  goForward: (tabId: string) => Promise<void>;
  reload: (tabId: string) => Promise<void>;
  pinTab: (tabId: string) => Promise<void>;
  unpinTab: (tabId: string) => Promise<void>;
  reorderTab: (tabId: string, toIndex: number) => Promise<void>;
  createWindow: () => Promise<void>;
  getSidebarState: () => Promise<{ collapsed: boolean; width: number }>;

  onTabsStateUpdate: (callback: (data: TabStateSnapshot) => void) => () => void;
  onNavigationStateUpdate: (
    callback: (data: { tabId: string; navigation: NavigationState }) => void,
  ) => () => void;
  onTabLoadingUpdate: (
    callback: (data: { tabId: string; isLoading: boolean }) => void,
  ) => () => void;
  onTabThumbnailUpdate: (
    callback: (data: { tabId: string; dataUrl: string }) => void,
  ) => () => void;
}

declare global {
  interface Window {
    axle: AxleAPI;
  }
}

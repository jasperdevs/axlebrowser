import type { TabState, NavigationState } from "./tabs";

/** Request/response IPC channels (renderer -> main -> renderer) */
export interface IpcInvokeChannelMap {
  "tabs:create": { request: { url?: string }; response: { tabId: string } };
  "tabs:close": { request: { tabId: string }; response: void };
  "tabs:switch": { request: { tabId: string }; response: void };
  "tabs:navigate": { request: { tabId: string; url: string }; response: void };
  "tabs:go-back": { request: { tabId: string }; response: void };
  "tabs:go-forward": { request: { tabId: string }; response: void };
  "tabs:reload": { request: { tabId: string }; response: void };
  "tabs:pin": { request: { tabId: string }; response: void };
  "tabs:unpin": { request: { tabId: string }; response: void };
  "tabs:reorder": {
    request: { tabId: string; toIndex: number };
    response: void;
  };
  "window:create": { request: Record<string, never>; response: void };
  "sidebar:get-state": {
    request: Record<string, never>;
    response: SidebarState;
  };
}

/** Push channels (main -> renderer) */
export interface IpcPushChannelMap {
  "tabs:state-update": TabStateSnapshot;
  "navigation:state-update": { tabId: string; navigation: NavigationState };
  "tab:loading-update": { tabId: string; isLoading: boolean };
  "tab:thumbnail-update": { tabId: string; dataUrl: string };
}

export interface TabStateSnapshot {
  tabs: TabState[];
  pinnedTabs: TabState[];
  activeTabId: string | null;
  splitTabIds: string[];
}

export interface SidebarState {
  collapsed: boolean;
  width: number;
}

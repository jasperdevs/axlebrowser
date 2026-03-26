import { contextBridge, ipcRenderer } from "electron";

const api = {
  // Tab operations
  createTab: (url?: string) => ipcRenderer.invoke("tabs:create", { url }),
  closeTab: (tabId: string) => ipcRenderer.invoke("tabs:close", { tabId }),
  switchTab: (tabId: string) => ipcRenderer.invoke("tabs:switch", { tabId }),
  navigate: (tabId: string, url: string) =>
    ipcRenderer.invoke("tabs:navigate", { tabId, url }),
  goBack: (tabId: string) => ipcRenderer.invoke("tabs:go-back", { tabId }),
  goForward: (tabId: string) =>
    ipcRenderer.invoke("tabs:go-forward", { tabId }),
  reload: (tabId: string) => ipcRenderer.invoke("tabs:reload", { tabId }),
  pinTab: (tabId: string) => ipcRenderer.invoke("tabs:pin", { tabId }),
  unpinTab: (tabId: string) => ipcRenderer.invoke("tabs:unpin", { tabId }),
  reorderTab: (tabId: string, toIndex: number) =>
    ipcRenderer.invoke("tabs:reorder", { tabId, toIndex }),

  // Window operations
  createWindow: () => ipcRenderer.invoke("window:create", {}),

  // Sidebar
  getSidebarState: () => ipcRenderer.invoke("sidebar:get-state", {}),

  // Event listeners (main -> renderer push)
  onTabsStateUpdate: (callback: (data: unknown) => void) => {
    const handler = (
      _event: Electron.IpcRendererEvent,
      data: unknown,
    ): void => {
      callback(data);
    };
    ipcRenderer.on("tabs:state-update", handler);
    return () => ipcRenderer.removeListener("tabs:state-update", handler);
  },

  onNavigationStateUpdate: (callback: (data: unknown) => void) => {
    const handler = (
      _event: Electron.IpcRendererEvent,
      data: unknown,
    ): void => {
      callback(data);
    };
    ipcRenderer.on("navigation:state-update", handler);
    return () => ipcRenderer.removeListener("navigation:state-update", handler);
  },

  onTabLoadingUpdate: (callback: (data: unknown) => void) => {
    const handler = (
      _event: Electron.IpcRendererEvent,
      data: unknown,
    ): void => {
      callback(data);
    };
    ipcRenderer.on("tab:loading-update", handler);
    return () => ipcRenderer.removeListener("tab:loading-update", handler);
  },

  onTabThumbnailUpdate: (callback: (data: unknown) => void) => {
    const handler = (
      _event: Electron.IpcRendererEvent,
      data: unknown,
    ): void => {
      callback(data);
    };
    ipcRenderer.on("tab:thumbnail-update", handler);
    return () => ipcRenderer.removeListener("tab:thumbnail-update", handler);
  },
};

contextBridge.exposeInMainWorld("axle", api);

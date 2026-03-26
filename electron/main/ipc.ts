import { ipcMain } from "electron";
import type { TabManager } from "./managers/TabManager";

export function registerIpcHandlers(tabManager: TabManager): void {
  ipcMain.handle("tabs:create", (_event, data: { url?: string }) => {
    const tabId = tabManager.createTab(data.url);
    return { tabId };
  });

  ipcMain.handle("tabs:close", (_event, data: { tabId: string }) => {
    tabManager.closeTab(data.tabId);
  });

  ipcMain.handle("tabs:switch", (_event, data: { tabId: string }) => {
    tabManager.switchTab(data.tabId);
  });

  ipcMain.handle(
    "tabs:navigate",
    (_event, data: { tabId: string; url: string }) => {
      tabManager.navigate(data.tabId, data.url);
    },
  );

  ipcMain.handle("tabs:go-back", (_event, data: { tabId: string }) => {
    tabManager.goBack(data.tabId);
  });

  ipcMain.handle("tabs:go-forward", (_event, data: { tabId: string }) => {
    tabManager.goForward(data.tabId);
  });

  ipcMain.handle("tabs:reload", (_event, data: { tabId: string }) => {
    tabManager.reload(data.tabId);
  });

  ipcMain.handle("tabs:pin", (_event, data: { tabId: string }) => {
    tabManager.pinTab(data.tabId);
  });

  ipcMain.handle("tabs:unpin", (_event, data: { tabId: string }) => {
    tabManager.unpinTab(data.tabId);
  });

  ipcMain.handle(
    "tabs:reorder",
    (_event, data: { tabId: string; toIndex: number }) => {
      tabManager.reorderTab(data.tabId, data.toIndex);
    },
  );

  ipcMain.handle("sidebar:get-state", () => {
    return {
      collapsed: false,
      width: tabManager.getSidebarWidth(),
    };
  });
}

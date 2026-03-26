import { BaseWindow, WebContentsView } from 'electron'
import { randomUUID } from 'crypto'
import { join } from 'path'
import type { TabState, NavigationState } from '@shared/types/tabs'
import type { TabStateSnapshot } from '@shared/types/ipc'

const DEFAULT_SIDEBAR_WIDTH = 200
const COLLAPSED_SIDEBAR_WIDTH = 48

interface ManagedTab {
  id: string
  view: WebContentsView | null
  state: TabState
  navigationState: NavigationState
}

export class TabManager {
  private tabs: Map<string, ManagedTab> = new Map()
  private pinnedTabIds: Set<string> = new Set()
  private tabOrder: string[] = []
  private activeTabId: string | null = null
  private splitTabIds: string[] = []
  private sidebarCollapsed = false
  private window: BaseWindow
  private chromeView: WebContentsView

  constructor(window: BaseWindow, chromeView: WebContentsView) {
    this.window = window
    this.chromeView = chromeView
  }

  private closedTabStack: { url: string; title: string }[] = []

  getActiveTabId(): string | null {
    return this.activeTabId
  }

  getSidebarWidth(): number {
    return this.sidebarCollapsed ? COLLAPSED_SIDEBAR_WIDTH : DEFAULT_SIDEBAR_WIDTH
  }

  setSidebarCollapsed(collapsed: boolean): void {
    this.sidebarCollapsed = collapsed
  }

  reopenClosedTab(): void {
    const last = this.closedTabStack.pop()
    if (last) {
      this.createTab(last.url)
    }
  }

  private getNewTabPath(): string {
    // In dev, load from resources in the project root. In prod, from the app resources.
    return join(__dirname, '../../resources/newtab.html')
  }

  createTab(url?: string): string {
    const tabId = randomUUID()
    const isNewTab = !url
    const targetUrl = url || 'axle://newtab'

    const view = new WebContentsView({
      webPreferences: {
        sandbox: true,
        contextIsolation: true,
        nodeIntegration: false,
        // NO preload for tab content -- security boundary
        webSecurity: true,
        allowRunningInsecureContent: false
      }
    })

    view.setBackgroundColor('#0a0a0a')
    view.setBorderRadius(12)

    const tab: ManagedTab = {
      id: tabId,
      view,
      state: {
        id: tabId,
        url: targetUrl,
        title: 'New Tab',
        faviconUrl: null,
        isPinned: false,
        isLoading: true,
        lastAccessedAt: Date.now(),
        thumbnailDataUrl: null
      },
      navigationState: {
        url: targetUrl,
        title: 'New Tab',
        canGoBack: false,
        canGoForward: false,
        isLoading: true
      }
    }

    this.tabs.set(tabId, tab)
    this.tabOrder.push(tabId)

    // Add the view to the window but keep it hidden until active
    this.window.contentView.addChildView(view)
    view.setVisible(false)

    // Wire up webContents events
    this.wireTabEvents(tab)

    // Load the URL
    if (isNewTab) {
      view.webContents.loadFile(this.getNewTabPath())
    } else {
      view.webContents.loadURL(targetUrl)
    }

    // Switch to this tab
    this.switchTab(tabId)

    return tabId
  }

  private wireTabEvents(tab: ManagedTab): void {
    const wc = tab.view?.webContents
    if (!wc) return

    wc.on('did-start-navigation', (_event, url) => {
      tab.state.url = url
      tab.state.isLoading = true
      tab.navigationState.url = url
      tab.navigationState.isLoading = true
      this.pushNavigationUpdate(tab)
      this.pushStateUpdate()
    })

    wc.on('did-navigate', (_event, url) => {
      tab.state.url = url
      tab.navigationState.url = url
      tab.navigationState.canGoBack = wc.navigationHistory.canGoBack()
      tab.navigationState.canGoForward = wc.navigationHistory.canGoForward()
      this.pushNavigationUpdate(tab)
    })

    wc.on('did-navigate-in-page', (_event, url) => {
      tab.state.url = url
      tab.navigationState.url = url
      tab.navigationState.canGoBack = wc.navigationHistory.canGoBack()
      tab.navigationState.canGoForward = wc.navigationHistory.canGoForward()
      this.pushNavigationUpdate(tab)
    })

    wc.on('did-stop-loading', () => {
      tab.state.isLoading = false
      tab.navigationState.isLoading = false
      this.pushNavigationUpdate(tab)
      this.pushStateUpdate()
      // Capture thumbnail
      this.captureThumbnail(tab)
    })

    wc.on('page-title-updated', (_event, title) => {
      tab.state.title = title
      tab.navigationState.title = title
      this.pushStateUpdate()
    })

    wc.on('page-favicon-updated', (_event, favicons) => {
      tab.state.faviconUrl = favicons[0] || null
      this.pushStateUpdate()
    })

    // Block new windows -- open as new tab
    wc.setWindowOpenHandler(({ url }) => {
      this.createTab(url)
      return { action: 'deny' }
    })

    // Handle crashes
    wc.on('render-process-gone', (_event, details) => {
      if (details.reason === 'crashed' || details.reason === 'oom') {
        tab.state.title = 'Tab Crashed'
        tab.state.isLoading = false
        this.pushStateUpdate()
      }
    })
  }

  switchTab(tabId: string): void {
    const tab = this.tabs.get(tabId)
    if (!tab) return

    // Hide current active tab
    if (this.activeTabId && this.activeTabId !== tabId) {
      const currentTab = this.tabs.get(this.activeTabId)
      if (currentTab?.view) {
        currentTab.view.setVisible(false)
      }
    }

    // Show new active tab
    if (tab.view) {
      tab.view.setVisible(true)
    }

    tab.state.lastAccessedAt = Date.now()
    this.activeTabId = tabId

    // Update bounds
    const bounds = this.window.getBounds()
    const sw = this.getSidebarWidth()
    this.updateTabBounds(sw, bounds.width - sw, bounds.height)

    this.pushStateUpdate()
    this.pushNavigationUpdate(tab)
  }

  closeTab(tabId: string): void {
    const tab = this.tabs.get(tabId)
    if (!tab) return

    // Save for reopen
    this.closedTabStack.push({ url: tab.state.url, title: tab.state.title })

    // If closing the active tab, switch to the most recently used tab
    if (this.activeTabId === tabId) {
      const otherTabs = this.tabOrder
        .filter((id) => id !== tabId)
        .map((id) => this.tabs.get(id)!)
        .sort((a, b) => b.state.lastAccessedAt - a.state.lastAccessedAt)

      if (otherTabs.length > 0) {
        this.switchTab(otherTabs[0].id)
      } else {
        this.activeTabId = null
      }
    }

    // Clean up
    if (tab.view) {
      this.window.contentView.removeChildView(tab.view)
      tab.view.webContents.close()
    }

    this.tabs.delete(tabId)
    this.tabOrder = this.tabOrder.filter((id) => id !== tabId)
    this.pinnedTabIds.delete(tabId)
    this.splitTabIds = this.splitTabIds.filter((id) => id !== tabId)

    // If no tabs left, create a new one
    if (this.tabs.size === 0) {
      this.createTab()
    }

    this.pushStateUpdate()
  }

  navigate(tabId: string, url: string): void {
    const tab = this.tabs.get(tabId)
    if (!tab?.view) return

    // Add protocol if missing
    let targetUrl = url
    if (!/^https?:\/\//i.test(url) && !/^about:/i.test(url)) {
      if (url.includes('.') && !url.includes(' ')) {
        targetUrl = 'https://' + url
      } else {
        targetUrl = `https://www.google.com/search?q=${encodeURIComponent(url)}`
      }
    }

    tab.view.webContents.loadURL(targetUrl)
  }

  goBack(tabId: string): void {
    const tab = this.tabs.get(tabId)
    if (tab?.view?.webContents.navigationHistory.canGoBack()) {
      tab.view.webContents.navigationHistory.goBack()
    }
  }

  goForward(tabId: string): void {
    const tab = this.tabs.get(tabId)
    if (tab?.view?.webContents.navigationHistory.canGoForward()) {
      tab.view.webContents.navigationHistory.goForward()
    }
  }

  reload(tabId: string): void {
    const tab = this.tabs.get(tabId)
    tab?.view?.webContents.reload()
  }

  pinTab(tabId: string): void {
    const tab = this.tabs.get(tabId)
    if (!tab) return
    tab.state.isPinned = true
    this.pinnedTabIds.add(tabId)
    this.pushStateUpdate()
  }

  unpinTab(tabId: string): void {
    const tab = this.tabs.get(tabId)
    if (!tab) return
    tab.state.isPinned = false
    this.pinnedTabIds.delete(tabId)
    this.pushStateUpdate()
  }

  reorderTab(tabId: string, toIndex: number): void {
    const fromIndex = this.tabOrder.indexOf(tabId)
    if (fromIndex === -1) return
    this.tabOrder.splice(fromIndex, 1)
    this.tabOrder.splice(toIndex, 0, tabId)
    this.pushStateUpdate()
  }

  updateTabBounds(contentX: number, contentWidth: number, contentHeight: number): void {
    if (this.splitTabIds.length === 2) {
      // Split view: side by side
      const halfWidth = Math.floor(contentWidth / 2)
      const gap = 4

      for (let i = 0; i < 2; i++) {
        const tab = this.tabs.get(this.splitTabIds[i])
        if (tab?.view) {
          tab.view.setBounds({
            x: contentX + i * (halfWidth + gap),
            y: 0,
            width: halfWidth - gap,
            height: contentHeight
          })
          tab.view.setVisible(true)
        }
      }
    } else if (this.activeTabId) {
      // Single tab
      const tab = this.tabs.get(this.activeTabId)
      if (tab?.view) {
        tab.view.setBounds({
          x: contentX,
          y: 0,
          width: contentWidth,
          height: contentHeight
        })
      }
    }
  }

  private async captureThumbnail(tab: ManagedTab): Promise<void> {
    if (!tab.view) return
    try {
      const image = await tab.view.webContents.capturePage()
      const resized = image.resize({ width: 240 })
      const dataUrl = resized.toDataURL()
      tab.state.thumbnailDataUrl = dataUrl
      // Push thumbnail update to renderer
      this.chromeView.webContents.send('tab:thumbnail-update', {
        tabId: tab.id,
        dataUrl
      })
    } catch {
      // Ignore capture failures
    }
  }

  private pushStateUpdate(): void {
    const snapshot = this.getStateSnapshot()
    this.chromeView.webContents.send('tabs:state-update', snapshot)
  }

  private pushNavigationUpdate(tab: ManagedTab): void {
    this.chromeView.webContents.send('navigation:state-update', {
      tabId: tab.id,
      navigation: tab.navigationState
    })
  }

  getStateSnapshot(): TabStateSnapshot {
    const pinnedTabs: TabState[] = []
    const regularTabs: TabState[] = []

    for (const id of this.tabOrder) {
      const tab = this.tabs.get(id)
      if (!tab) continue
      if (tab.state.isPinned) {
        pinnedTabs.push({ ...tab.state })
      } else {
        regularTabs.push({ ...tab.state })
      }
    }

    return {
      tabs: regularTabs,
      pinnedTabs,
      activeTabId: this.activeTabId,
      splitTabIds: [...this.splitTabIds]
    }
  }

  destroy(): void {
    for (const [, tab] of this.tabs) {
      if (tab.view) {
        try {
          tab.view.webContents.close()
        } catch {
          // ignore
        }
      }
    }
    this.tabs.clear()
  }
}

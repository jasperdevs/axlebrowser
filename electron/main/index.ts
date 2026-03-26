import { app, BaseWindow, WebContentsView, Menu, session } from 'electron'
import { join } from 'path'
import { is } from '@electron-toolkit/utils'
import { TabManager } from './managers/TabManager'
import { registerIpcHandlers } from './ipc'

let mainWindow: BaseWindow | null = null
let chromeView: WebContentsView | null = null
let tabManager: TabManager | null = null

function createWindow(): void {
  mainWindow = new BaseWindow({
    width: 1280,
    height: 800,
    minWidth: 600,
    minHeight: 400,
    frame: false,
    backgroundColor: '#09090b',
    titleBarStyle: 'hidden',
    titleBarOverlay: false,
    icon: join(__dirname, '../../resources/axleXonly.svg')
  })

  // Chrome UI view -- covers FULL window so overlays (omnibox, settings, window controls) work
  chromeView = new WebContentsView({
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: true,
      contextIsolation: true,
      nodeIntegration: false,
      transparent: true
    }
  })

  mainWindow.contentView.addChildView(chromeView)

  // Load the chrome UI
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    chromeView.webContents.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    chromeView.webContents.loadFile(join(__dirname, '../renderer/index.html'))
  }

  // Initialize tab manager
  tabManager = new TabManager(mainWindow, chromeView)

  // Register IPC handlers
  registerIpcHandlers(tabManager, mainWindow)

  // Set up security + shortcuts
  setupSecurity()
  setupGlobalShortcuts()

  // Layout
  updateLayout()
  mainWindow.on('resize', () => updateLayout())

  mainWindow.on('closed', () => {
    tabManager?.destroy()
    mainWindow = null
    chromeView = null
    tabManager = null
  })

  // Start maximized
  mainWindow.maximize()
  mainWindow.show()

  // First tab
  tabManager.createTab()
}

function updateLayout(): void {
  if (!mainWindow || !chromeView || !tabManager) return

  const [width, height] = mainWindow.getContentSize()
  const sidebarWidth = tabManager.getSidebarWidth()

  // Tab content: left of sidebar, below a small top padding
  tabManager.updateTabBounds(sidebarWidth, width - sidebarWidth, height)

  // Chrome view: FULL window, on top of tab content
  // The React app uses pointer-events:none on the transparent content area
  // so clicks pass through to tab views underneath
  chromeView.setBounds({ x: 0, y: 0, width, height })

  // Ensure chrome view is on top
  mainWindow.contentView.removeChildView(chromeView)
  mainWindow.contentView.addChildView(chromeView)
}

export function requestLayoutUpdate(): void {
  updateLayout()
}

function setupGlobalShortcuts(): void {
  if (!tabManager || !chromeView) return
  const tm = tabManager
  const cv = chromeView

  const template: Electron.MenuItemConstructorOptions[] = [
    {
      label: 'Edit',
      submenu: [
        { role: 'undo' },
        { role: 'redo' },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' },
        { role: 'selectAll' }
      ]
    },
    {
      label: 'Browser',
      submenu: [
        { label: 'New Tab', accelerator: 'CmdOrCtrl+T', click: () => tm.createTab() },
        {
          label: 'Close Tab',
          accelerator: 'CmdOrCtrl+W',
          click: () => {
            const id = tm.getActiveTabId()
            if (id) tm.closeTab(id)
          }
        },
        {
          label: 'Reopen Closed Tab',
          accelerator: 'CmdOrCtrl+Shift+T',
          click: () => tm.reopenClosedTab()
        },
        { type: 'separator' },
        {
          label: 'Reload',
          accelerator: 'CmdOrCtrl+R',
          click: () => {
            const id = tm.getActiveTabId()
            if (id) tm.reload(id)
          }
        },
        {
          label: 'Back',
          accelerator: 'Alt+Left',
          click: () => {
            const id = tm.getActiveTabId()
            if (id) tm.goBack(id)
          }
        },
        {
          label: 'Forward',
          accelerator: 'Alt+Right',
          click: () => {
            const id = tm.getActiveTabId()
            if (id) tm.goForward(id)
          }
        },
        { type: 'separator' },
        {
          label: 'Omnibox',
          accelerator: 'CmdOrCtrl+L',
          click: () => cv.webContents.send('shortcut:omnibox')
        },
        {
          label: 'Search',
          accelerator: 'CmdOrCtrl+K',
          click: () => cv.webContents.send('shortcut:omnibox')
        },
        {
          label: 'Toggle Sidebar',
          accelerator: 'CmdOrCtrl+B',
          click: () => cv.webContents.send('shortcut:toggle-sidebar')
        },
        {
          label: 'Command Palette',
          accelerator: 'CmdOrCtrl+Shift+P',
          click: () => cv.webContents.send('shortcut:command-palette')
        },
        { type: 'separator' },
        {
          label: 'Fullscreen',
          accelerator: 'F11',
          click: () => mainWindow?.setFullScreen(!mainWindow.isFullScreen())
        }
      ]
    },
    {
      label: 'Dev',
      submenu: [
        {
          label: 'Chrome DevTools',
          accelerator: 'CmdOrCtrl+Shift+I',
          click: () => cv.webContents.openDevTools()
        }
      ]
    }
  ]
  Menu.setApplicationMenu(Menu.buildFromTemplate(template))
}

function setupSecurity(): void {
  session.defaultSession.setPermissionRequestHandler((_wc, _perm, cb) => cb(false))

  session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
    if (details.url.startsWith('http://localhost:') || details.url.startsWith('file://')) {
      callback({
        responseHeaders: {
          ...details.responseHeaders,
          'Content-Security-Policy': [
            "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; connect-src 'self' ws://localhost:* http://localhost:*; font-src 'self' data:;"
          ]
        }
      })
    } else {
      callback({ responseHeaders: details.responseHeaders })
    }
  })
}

app.whenReady().then(createWindow)
app.on('window-all-closed', () => app.quit())

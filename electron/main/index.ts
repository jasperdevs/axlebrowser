import { app, BaseWindow, WebContentsView, Menu, ipcMain, session } from 'electron'
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
    backgroundColor: '#0a0a0a',
    titleBarStyle: 'hidden',
    titleBarOverlay: false
  })

  // Chrome UI view (sidebar, omnibox, overlays)
  chromeView = new WebContentsView({
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: true,
      contextIsolation: true,
      nodeIntegration: false
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

  // Set up security
  setupSecurity()

  // Layout the views
  updateLayout()

  mainWindow.on('resize', () => {
    updateLayout()
  })

  mainWindow.on('closed', () => {
    tabManager?.destroy()
    mainWindow = null
    chromeView = null
    tabManager = null
  })

  // Start maximized and show
  mainWindow.maximize()
  mainWindow.show()

  // Create the first tab
  tabManager.createTab('https://www.google.com')
}

function updateLayout(): void {
  if (!mainWindow || !chromeView || !tabManager) return

  const bounds = mainWindow.getBounds()
  const sidebarWidth = tabManager.getSidebarWidth()

  // Chrome view covers the sidebar area
  chromeView.setBounds({
    x: 0,
    y: 0,
    width: sidebarWidth,
    height: bounds.height
  })

  // Update tab view bounds
  tabManager.updateTabBounds(sidebarWidth, bounds.width, bounds.height)
}

function setupSecurity(): void {
  // Set permission handler -- default deny
  session.defaultSession.setPermissionRequestHandler((_webContents, _permission, callback) => {
    callback(false)
  })

  // CSP for the chrome UI
  session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
    if (details.url.startsWith('http://localhost:') || details.url.startsWith('file://')) {
      callback({
        responseHeaders: {
          ...details.responseHeaders,
          'Content-Security-Policy': [
            "default-src 'self'; " +
              "script-src 'self' 'unsafe-inline'; " +
              "style-src 'self' 'unsafe-inline'; " +
              "img-src 'self' data: https:; " +
              "connect-src 'self' ws://localhost:* http://localhost:*; " +
              "font-src 'self' data:;"
          ]
        }
      })
    } else {
      callback({ responseHeaders: details.responseHeaders })
    }
  })

  // Create hidden Edit menu for copy/paste on Windows
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
    }
  ]
  Menu.setApplicationMenu(Menu.buildFromTemplate(template))
}

// Expose updateLayout so TabManager can call it
export function requestLayoutUpdate(): void {
  updateLayout()
}

app.whenReady().then(() => {
  createWindow()
})

app.on('window-all-closed', () => {
  app.quit()
})

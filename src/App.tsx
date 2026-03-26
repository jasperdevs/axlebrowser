import { useIpcSubscriptions } from '@/hooks/useIpc'
import { Sidebar } from '@/components/sidebar/Sidebar'
import { Omnibox } from '@/components/omnibox/Omnibox'
import { CommandPalette } from '@/components/command-palette/CommandPalette'
import { SettingsPanel } from '@/components/settings/SettingsPanel'
import { useUIStore } from '@/stores/uiStore'
import { useTabStore } from '@/stores/tabStore'
import { useEffect } from 'react'

export default function App(): JSX.Element {
  useIpcSubscriptions()

  const omniboxOpen = useUIStore((s) => s.omniboxOpen)
  const commandPaletteOpen = useUIStore((s) => s.commandPaletteOpen)
  const settingsOpen = useUIStore((s) => s.settingsOpen)
  const setOmniboxOpen = useUIStore((s) => s.setOmniboxOpen)
  const toggleSidebar = useUIStore((s) => s.toggleSidebar)
  const setCommandPaletteOpen = useUIStore((s) => s.setCommandPaletteOpen)
  const setSettingsOpen = useUIStore((s) => s.setSettingsOpen)
  const activeTabId = useTabStore((s) => s.activeTabId)

  // Global keyboard shortcuts
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent): void {
      // Ctrl+L or Ctrl+K -> Omnibox
      if ((e.ctrlKey && e.key === 'l') || (e.ctrlKey && e.key === 'k')) {
        e.preventDefault()
        setOmniboxOpen(true)
      }
      // Ctrl+B -> Toggle sidebar
      if (e.ctrlKey && e.key === 'b') {
        e.preventDefault()
        toggleSidebar()
      }
      // Ctrl+Shift+P -> Command palette
      if (e.ctrlKey && e.shiftKey && e.key === 'P') {
        e.preventDefault()
        setCommandPaletteOpen(true)
      }
      // Ctrl+T -> New tab
      if (e.ctrlKey && e.key === 't') {
        e.preventDefault()
        window.axle.createTab()
      }
      // Ctrl+W -> Close active tab
      if (e.ctrlKey && e.key === 'w') {
        e.preventDefault()
        if (activeTabId) {
          window.axle.closeTab(activeTabId)
        }
      }
      // Ctrl+R -> Reload
      if (e.ctrlKey && e.key === 'r') {
        e.preventDefault()
        if (activeTabId) {
          window.axle.reload(activeTabId)
        }
      }
      // Alt+Left -> Back
      if (e.altKey && e.key === 'ArrowLeft') {
        e.preventDefault()
        if (activeTabId) {
          window.axle.goBack(activeTabId)
        }
      }
      // Alt+Right -> Forward
      if (e.altKey && e.key === 'ArrowRight') {
        e.preventDefault()
        if (activeTabId) {
          window.axle.goForward(activeTabId)
        }
      }
      // Escape -> Close overlays
      if (e.key === 'Escape') {
        setOmniboxOpen(false)
        setCommandPaletteOpen(false)
        setSettingsOpen(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [setOmniboxOpen, toggleSidebar, setCommandPaletteOpen, setSettingsOpen, activeTabId])

  return (
    <div className="flex h-full w-full bg-bg-base">
      <Sidebar />
      {omniboxOpen && <Omnibox />}
      {commandPaletteOpen && <CommandPalette />}
      {settingsOpen && <SettingsPanel onClose={() => setSettingsOpen(false)} />}
    </div>
  )
}

import { useIpcSubscriptions } from '@/hooks/useIpc'
import { Sidebar } from '@/components/sidebar/Sidebar'
import { Omnibox } from '@/components/omnibox/Omnibox'
import { CommandPalette } from '@/components/command-palette/CommandPalette'
import { SettingsPanel } from '@/components/settings/SettingsPanel'
import { WindowControls } from '@/components/sidebar/WindowControls'
import { useUIStore } from '@/stores/uiStore'
import { useTabStore } from '@/stores/tabStore'
import { useEffect } from 'react'

export default function App(): JSX.Element {
  useIpcSubscriptions()

  const omniboxOpen = useUIStore((s) => s.omniboxOpen)
  const commandPaletteOpen = useUIStore((s) => s.commandPaletteOpen)
  const settingsOpen = useUIStore((s) => s.settingsOpen)
  const setOmniboxOpen = useUIStore((s) => s.setOmniboxOpen)
  const setCommandPaletteOpen = useUIStore((s) => s.setCommandPaletteOpen)
  const setSettingsOpen = useUIStore((s) => s.setSettingsOpen)
  const activeTabId = useTabStore((s) => s.activeTabId)

  // Escape to close overlays (renderer-level, backup for menu accelerators)
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent): void {
      if (e.key === 'Escape') {
        setOmniboxOpen(false)
        setCommandPaletteOpen(false)
        setSettingsOpen(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [setOmniboxOpen, setCommandPaletteOpen, setSettingsOpen])

  return (
    <div className="flex h-screen w-screen">
      {/* Sidebar -- has pointer events, solid background */}
      <Sidebar />

      {/* Content area overlay -- transparent, clicks pass through to Electron tab views */}
      <div className="pointer-events-none relative flex-1">
        {/* Window controls: top-right, needs pointer events */}
        <div className="pointer-events-auto drag-region absolute right-0 top-0 z-10 flex items-center gap-2 px-3 py-2">
          <WindowControls />
        </div>
      </div>

      {/* Overlays -- full screen, above everything */}
      {omniboxOpen && <Omnibox />}
      {commandPaletteOpen && <CommandPalette />}
      {settingsOpen && <SettingsPanel onClose={() => setSettingsOpen(false)} />}
    </div>
  )
}

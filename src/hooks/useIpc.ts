import { useEffect } from 'react'
import { useTabStore } from '@/stores/tabStore'
import { useUIStore } from '@/stores/uiStore'
import type { TabStateSnapshot } from '@shared/types/ipc'
import type { NavigationState } from '@shared/types/tabs'

/**
 * Hook that subscribes to all IPC push events from main process
 * and updates the Zustand stores accordingly.
 */
export function useIpcSubscriptions(): void {
  const setSnapshot = useTabStore((s) => s.setSnapshot)
  const setNavigation = useTabStore((s) => s.setNavigation)
  const updateThumbnail = useTabStore((s) => s.updateThumbnail)
  const setOmniboxOpen = useUIStore((s) => s.setOmniboxOpen)
  const toggleSidebar = useUIStore((s) => s.toggleSidebar)
  const setCommandPaletteOpen = useUIStore((s) => s.setCommandPaletteOpen)

  useEffect(() => {
    const unsubs: (() => void)[] = []

    unsubs.push(
      window.axle.onTabsStateUpdate((data) => {
        setSnapshot(data as TabStateSnapshot)
      })
    )

    unsubs.push(
      window.axle.onNavigationStateUpdate((data) => {
        const d = data as { tabId: string; navigation: NavigationState }
        setNavigation(d.tabId, d.navigation)
      })
    )

    unsubs.push(
      window.axle.onTabThumbnailUpdate((data) => {
        const d = data as { tabId: string; dataUrl: string }
        updateThumbnail(d.tabId, d.dataUrl)
      })
    )

    // Global shortcuts from main process menu accelerators
    unsubs.push(window.axle.onShortcut('omnibox', () => setOmniboxOpen(true)))
    unsubs.push(window.axle.onShortcut('toggle-sidebar', () => toggleSidebar()))
    unsubs.push(window.axle.onShortcut('command-palette', () => setCommandPaletteOpen(true)))

    return () => {
      for (const unsub of unsubs) unsub()
    }
  }, [
    setSnapshot,
    setNavigation,
    updateThumbnail,
    setOmniboxOpen,
    toggleSidebar,
    setCommandPaletteOpen
  ])
}

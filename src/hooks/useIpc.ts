import { useEffect } from 'react'
import { useTabStore } from '@/stores/tabStore'
import { useUIStore } from '@/stores/uiStore'
import type { TabStateSnapshot } from '@shared/types/ipc'
import type { NavigationState } from '@shared/types/tabs'

export function useIpcSubscriptions(): void {
  const setSnapshot = useTabStore((s) => s.setSnapshot)
  const setNavigation = useTabStore((s) => s.setNavigation)
  const updateThumbnail = useTabStore((s) => s.updateThumbnail)
  const openUrlbar = useUIStore((s) => s.openUrlbar)
  const toggleSidebar = useUIStore((s) => s.toggleSidebar)

  useEffect(() => {
    const unsubs: (() => void)[] = []

    unsubs.push(window.axle.onTabsStateUpdate((data) => setSnapshot(data as TabStateSnapshot)))
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

    // Global shortcuts from main process
    unsubs.push(window.axle.onShortcut('omnibox', () => openUrlbar()))
    unsubs.push(window.axle.onShortcut('toggle-sidebar', () => toggleSidebar()))
    unsubs.push(window.axle.onShortcut('command-palette', () => openUrlbar()))

    return () => unsubs.forEach((u) => u())
  }, [setSnapshot, setNavigation, updateThumbnail, openUrlbar, toggleSidebar])
}

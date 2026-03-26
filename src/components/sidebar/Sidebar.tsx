import { useUIStore } from '@/stores/uiStore'
import { SidebarNav } from './SidebarNav'
import { DomainDisplay } from './DomainDisplay'
import { TabList } from './TabList'
import { PinnedSites } from './PinnedSites'
import { SidebarFooter } from './SidebarFooter'
import { IconStrip } from './IconStrip'
import { WindowControls } from './WindowControls'

export function Sidebar(): JSX.Element {
  const collapsed = useUIStore((s) => s.sidebarCollapsed)

  if (collapsed) {
    return <IconStrip />
  }

  return (
    <div className="flex h-full w-[200px] flex-col bg-bg-surface border-r border-border-default">
      {/* Title bar drag region + window controls */}
      <div className="drag-region flex items-center justify-between px-2 pt-1.5 pb-0">
        <div className="w-2" />
        <WindowControls />
      </div>

      {/* Domain display for current page */}
      <DomainDisplay />

      {/* Navigation controls */}
      <SidebarNav />

      {/* Pinned sites */}
      <PinnedSites />

      {/* Divider */}
      <div className="mx-3 border-t border-border-default" />

      {/* Tab list */}
      <TabList />

      {/* New tab button */}
      <NewTabButton />

      {/* Footer */}
      <SidebarFooter />
    </div>
  )
}

function NewTabButton(): JSX.Element {
  return (
    <button
      onClick={() => window.axle.createTab()}
      className="mx-2 mb-1 flex items-center gap-2 rounded-lg px-3 py-1.5 text-fg-secondary hover:bg-bg-hover hover:text-fg-primary transition-colors text-xs no-drag"
    >
      <svg
        width="14"
        height="14"
        viewBox="0 0 14 14"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <line x1="7" y1="2" x2="7" y2="12" />
        <line x1="2" y1="7" x2="12" y2="7" />
      </svg>
      New Tab
    </button>
  )
}

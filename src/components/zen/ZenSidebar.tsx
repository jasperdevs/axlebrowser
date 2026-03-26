import { useUIStore } from '@/stores/uiStore'
import { useTabStore } from '@/stores/tabStore'
import { ZenTopButtons } from './ZenTopButtons'
import { ZenEssentials } from './ZenEssentials'
import { ZenTabList } from './ZenTabList'
import { ZenFooter } from './ZenFooter'

export function ZenSidebar(): JSX.Element {
  const collapsed = useUIStore((s) => s.sidebarCollapsed)

  return (
    <div
      className="pointer-events-auto flex h-full flex-col bg-[var(--zen-sidebar-bg)]"
      style={{ width: collapsed ? 60 : 250, padding: 'var(--zen-sidebar-padding)' }}
    >
      {/* Top buttons: nav controls + window drag area */}
      <ZenTopButtons />

      {/* Pinned tabs (essentials) as icon grid */}
      <ZenEssentials />

      {/* Separator */}
      <Separator />

      {/* Regular tab list */}
      <ZenTabList />

      {/* New tab button */}
      <NewTabBtn />

      {/* Footer */}
      <ZenFooter />
    </div>
  )
}

function Separator(): JSX.Element {
  return (
    <div
      className="mx-2 my-1 flex items-center justify-center"
      style={{ height: 'var(--zen-separator-height)' }}
    >
      <div className="h-px w-full bg-[var(--zen-separator)]" />
    </div>
  )
}

function NewTabBtn(): JSX.Element {
  const collapsed = useUIStore((s) => s.sidebarCollapsed)

  return (
    <button
      onClick={() => window.axle.createTab()}
      className="no-drag mx-1 mb-1 flex items-center gap-2 rounded-[var(--zen-radius-tab)] px-2 py-1.5 text-[var(--zen-text-secondary)] hover:bg-[var(--zen-element-bg-hover)] transition-colors"
      title="New Tab"
    >
      <svg
        width="14"
        height="14"
        viewBox="0 0 14 14"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      >
        <line x1="7" y1="2" x2="7" y2="12" />
        <line x1="2" y1="7" x2="12" y2="7" />
      </svg>
      {!collapsed && <span className="text-[13px]">New Tab</span>}
    </button>
  )
}

import { useTabStore } from '@/stores/tabStore'
import { useSpaceStore } from '@/stores/spaceStore'
import { useUIStore } from '@/stores/uiStore'
import { TabItem } from './TabItem'
import { PinnedSites } from './PinnedSites'

export function TabPanel(): JSX.Element {
  const tabs = useTabStore((s) => s.tabs)
  const pinnedTabs = useTabStore((s) => s.pinnedTabs)
  const activeTabId = useTabStore((s) => s.activeTabId)
  const nav = useTabStore((s) => s.activeNavigation)
  const activeSpace = useSpaceStore((s) => s.spaces.find((sp) => sp.id === s.activeSpaceId))
  const setOmniboxOpen = useUIStore((s) => s.setOmniboxOpen)

  const canGoBack = nav?.canGoBack ?? false
  const canGoForward = nav?.canGoForward ?? false

  // Domain display
  let domain = ''
  if (nav?.url) {
    try {
      domain = new URL(nav.url).hostname.replace(/^www\./, '')
    } catch {
      /* empty */
    }
  }

  return (
    <div className="flex h-full w-[240px] flex-col border-r border-border-default bg-bg-surface">
      {/* Space name + drag region */}
      <div className="drag-region flex items-center px-4 pt-4 pb-2">
        <span className="no-drag text-sm font-semibold text-fg-primary">
          {activeSpace?.name || 'Home'}
        </span>
      </div>

      {/* Nav bar */}
      <div className="no-drag flex items-center gap-1 px-3 pb-2">
        <NavBtn
          disabled={!canGoBack}
          onClick={() => activeTabId && window.axle.goBack(activeTabId)}
          title="Back (Alt+Left)"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="10,3 5,8 10,13" />
          </svg>
        </NavBtn>
        <NavBtn
          disabled={!canGoForward}
          onClick={() => activeTabId && window.axle.goForward(activeTabId)}
          title="Forward (Alt+Right)"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="6,3 11,8 6,13" />
          </svg>
        </NavBtn>
        <NavBtn
          onClick={() => activeTabId && window.axle.reload(activeTabId)}
          title="Reload (Ctrl+R)"
        >
          <svg
            width="15"
            height="15"
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M2.5 8a5.5 5.5 0 0 1 9.3-4" />
            <polyline points="12,2 12,5 9,5" />
          </svg>
        </NavBtn>

        {/* Domain */}
        {domain && (
          <button
            onClick={() => setOmniboxOpen(true)}
            className="ml-1 flex-1 truncate rounded-md px-2 py-1 text-xs text-fg-muted hover:text-fg-secondary hover:bg-bg-hover transition-colors text-left"
            title={nav?.url}
          >
            {domain}
          </button>
        )}
      </div>

      {/* Pinned tabs */}
      {pinnedTabs.length > 0 && (
        <>
          <PinnedSites />
          <div className="mx-4 my-1 border-t border-border-default" />
        </>
      )}

      {/* Tab list */}
      <div className="flex flex-1 flex-col overflow-y-auto px-2 py-1">
        {tabs.map((tab) => (
          <TabItem key={tab.id} tab={tab} />
        ))}
      </div>

      {/* New tab button */}
      <div className="no-drag px-2 pb-3">
        <button
          onClick={() => window.axle.createTab()}
          className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-fg-muted hover:text-fg-secondary hover:bg-bg-hover transition-colors text-sm"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          >
            <line x1="7" y1="2" x2="7" y2="12" />
            <line x1="2" y1="7" x2="12" y2="7" />
          </svg>
          New Tab
        </button>
      </div>
    </div>
  )
}

function NavBtn({
  children,
  disabled,
  onClick,
  title
}: {
  children: React.ReactNode
  disabled?: boolean
  onClick?: () => void
  title?: string
}): JSX.Element {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`flex h-8 w-8 items-center justify-center rounded-lg transition-colors ${
        disabled ? 'text-fg-muted/25' : 'text-fg-secondary hover:bg-bg-hover hover:text-fg-primary'
      }`}
    >
      {children}
    </button>
  )
}

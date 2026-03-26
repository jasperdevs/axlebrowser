import { useTabStore } from '@/stores/tabStore'
import { useSpaceStore } from '@/stores/spaceStore'
import { WindowControls } from './WindowControls'
import { TabItem } from './TabItem'
import { PinnedSites } from './PinnedSites'
import { DomainDisplay } from './DomainDisplay'

export function TabPanel(): JSX.Element {
  const tabs = useTabStore((s) => s.tabs)
  const pinnedTabs = useTabStore((s) => s.pinnedTabs)
  const activeTabId = useTabStore((s) => s.activeTabId)
  const nav = useTabStore((s) => s.activeNavigation)
  const activeSpace = useSpaceStore((s) => s.spaces.find((sp) => sp.id === s.activeSpaceId))

  const canGoBack = nav?.canGoBack ?? false
  const canGoForward = nav?.canGoForward ?? false

  return (
    <div className="flex h-full w-[220px] flex-col border-r border-border-default bg-bg-surface">
      {/* Header: window controls + space name */}
      <div className="drag-region flex items-center justify-between px-3 pt-2 pb-0">
        <span className="no-drag text-[11px] font-medium text-fg-secondary truncate">
          {activeSpace?.name || 'Home'}
        </span>
        <WindowControls />
      </div>

      {/* Nav controls + domain */}
      <div className="flex items-center gap-1 px-2 pt-1.5 pb-1 no-drag">
        <NavBtn
          disabled={!canGoBack}
          onClick={() => activeTabId && window.axle.goBack(activeTabId)}
          title="Back"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          >
            <polyline points="10,3 5,8 10,13" />
          </svg>
        </NavBtn>
        <NavBtn
          disabled={!canGoForward}
          onClick={() => activeTabId && window.axle.goForward(activeTabId)}
          title="Forward"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          >
            <polyline points="6,3 11,8 6,13" />
          </svg>
        </NavBtn>
        <NavBtn onClick={() => activeTabId && window.axle.reload(activeTabId)} title="Reload">
          <svg
            width="14"
            height="14"
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          >
            <path d="M2.5 8a5.5 5.5 0 0 1 9.3-4" />
            <polyline points="12,2 12,5 9,5" />
          </svg>
        </NavBtn>

        {/* Domain display inline */}
        <DomainDisplay />
      </div>

      {/* Pinned tabs */}
      {pinnedTabs.length > 0 && (
        <>
          <PinnedSites />
          <div className="mx-3 my-0.5 border-t border-border-default" />
        </>
      )}

      {/* Tab list */}
      <div className="flex flex-1 flex-col overflow-y-auto px-1.5 py-1">
        {tabs.map((tab) => (
          <TabItem key={tab.id} tab={tab} />
        ))}
      </div>

      {/* New tab button */}
      <div className="px-1.5 pb-2 no-drag">
        <button
          onClick={() => window.axle.createTab()}
          className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-fg-muted hover:bg-bg-hover hover:text-fg-secondary transition-colors text-[11px]"
        >
          <svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          >
            <line x1="6" y1="2" x2="6" y2="10" />
            <line x1="2" y1="6" x2="10" y2="6" />
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
      className={`flex h-6 w-6 items-center justify-center rounded-md transition-colors ${
        disabled
          ? 'text-fg-muted/30 cursor-default'
          : 'text-fg-muted hover:bg-bg-hover hover:text-fg-secondary cursor-default'
      }`}
    >
      {children}
    </button>
  )
}

import { useTabStore } from '@/stores/tabStore'
import { useUIStore } from '@/stores/uiStore'
import { useState } from 'react'
import type { TabState } from '@shared/types/tabs'

export function IconStrip(): JSX.Element {
  const pinnedTabs = useTabStore((s) => s.pinnedTabs)
  const tabs = useTabStore((s) => s.tabs)
  const activeTabId = useTabStore((s) => s.activeTabId)
  const nav = useTabStore((s) => s.activeNavigation)

  return (
    <div className="flex h-full w-[48px] flex-col items-center bg-bg-surface border-r border-border-default">
      {/* Drag region + close button */}
      <div className="drag-region flex w-full flex-col items-center pt-1 pb-0.5">
        <button
          onClick={() => window.axle.closeWindow()}
          className="no-drag flex h-5 w-5 items-center justify-center rounded-md text-fg-muted hover:bg-[#e81123] hover:text-white transition-colors"
          title="Close"
        >
          <svg
            width="8"
            height="8"
            viewBox="0 0 10 10"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          >
            <line x1="2" y1="2" x2="8" y2="8" />
            <line x1="8" y1="2" x2="2" y2="8" />
          </svg>
        </button>
      </div>

      {/* Nav controls */}
      <div className="flex flex-col items-center gap-0.5 pt-0.5 pb-1 no-drag">
        <StripNavButton
          onClick={() => activeTabId && window.axle.goBack(activeTabId)}
          disabled={!nav?.canGoBack}
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
        </StripNavButton>
        <StripNavButton
          onClick={() => activeTabId && window.axle.goForward(activeTabId)}
          disabled={!nav?.canGoForward}
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
        </StripNavButton>
        <StripNavButton
          onClick={() => activeTabId && window.axle.reload(activeTabId)}
          title="Reload"
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
            <path d="M2.5 8a5.5 5.5 0 0 1 9.3-4" />
            <polyline points="12,2 12,5 9,5" />
          </svg>
        </StripNavButton>
      </div>

      {/* Pinned tabs */}
      {pinnedTabs.length > 0 && (
        <>
          {pinnedTabs.map((tab) => (
            <StripTab key={tab.id} tab={tab} />
          ))}
          <div className="mx-2 my-1 w-5 border-t border-border-default" />
        </>
      )}

      {/* Regular tabs */}
      <div className="flex flex-1 flex-col items-center gap-0.5 overflow-y-auto py-0.5">
        {tabs.map((tab) => (
          <StripTab key={tab.id} tab={tab} />
        ))}
      </div>

      {/* New tab */}
      <button
        onClick={() => window.axle.createTab()}
        className="mb-1 flex h-8 w-8 items-center justify-center rounded-lg text-fg-muted hover:bg-bg-hover hover:text-fg-primary transition-colors no-drag"
        title="New Tab (Ctrl+T)"
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
      </button>

      {/* Footer */}
      <div className="flex flex-col items-center gap-1 pb-2">
        <button
          className="flex h-7 w-7 items-center justify-center rounded-md text-fg-muted hover:bg-bg-hover hover:text-fg-secondary transition-colors no-drag"
          title="Settings"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.2"
          >
            <circle cx="7" cy="7" r="2.5" />
            <path d="M7 1v1.5M7 11.5V13M1 7h1.5M11.5 7H13M2.75 2.75l1.06 1.06M10.19 10.19l1.06 1.06M2.75 11.25l1.06-1.06M10.19 3.81l1.06-1.06" />
          </svg>
        </button>
      </div>
    </div>
  )
}

function StripTab({ tab }: { tab: TabState }): JSX.Element {
  const activeTabId = useTabStore((s) => s.activeTabId)
  const isActive = tab.id === activeTabId
  const [hovered, setHovered] = useState(false)

  return (
    <div
      className="relative no-drag"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <button
        onClick={() => window.axle.switchTab(tab.id)}
        className={`flex h-8 w-8 items-center justify-center rounded-lg transition-colors ${
          isActive ? 'bg-bg-active' : 'hover:bg-bg-hover'
        }`}
        title={tab.title}
      >
        {tab.faviconUrl ? (
          <img src={tab.faviconUrl} alt="" className="h-4 w-4 rounded-sm" />
        ) : (
          <div
            className={`h-2.5 w-2.5 rounded-full ${isActive ? 'bg-accent' : 'bg-fg-muted/40'}`}
          />
        )}
        {tab.isLoading && (
          <div className="absolute bottom-0.5 right-0.5 h-1.5 w-1.5 animate-pulse rounded-full bg-accent" />
        )}
      </button>

      {/* Tooltip + thumbnail on hover */}
      {hovered && (
        <div className="absolute left-full top-1/2 -translate-y-1/2 z-50 ml-2 min-w-[160px] max-w-[260px] overflow-hidden rounded-xl border border-border-default bg-bg-elevated shadow-xl">
          {tab.thumbnailDataUrl && <img src={tab.thumbnailDataUrl} alt="" className="w-full" />}
          <div className="px-2.5 py-1.5 text-[11px] text-fg-primary truncate">
            {tab.title || 'New Tab'}
          </div>
          <div className="px-2.5 pb-1.5 text-[10px] text-fg-muted truncate">{tab.url}</div>
        </div>
      )}
    </div>
  )
}

function StripNavButton({
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
      className={`flex h-7 w-7 items-center justify-center rounded-md transition-colors no-drag ${
        disabled
          ? 'text-fg-muted/30 cursor-default'
          : 'text-fg-secondary hover:bg-bg-hover hover:text-fg-primary cursor-default'
      }`}
    >
      {children}
    </button>
  )
}

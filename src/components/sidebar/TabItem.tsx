import { useState } from 'react'
import { useTabStore } from '@/stores/tabStore'
import type { TabState } from '@shared/types/tabs'

interface TabItemProps {
  tab: TabState
}

export function TabItem({ tab }: TabItemProps): JSX.Element {
  const activeTabId = useTabStore((s) => s.activeTabId)
  const isActive = tab.id === activeTabId
  const [hovered, setHovered] = useState(false)

  // Subtle fade for old tabs
  const mins = (Date.now() - tab.lastAccessedAt) / 60000
  let fade = ''
  if (!isActive && mins > 60) fade = 'opacity-40'
  else if (!isActive && mins > 30) fade = 'opacity-60'

  return (
    <div
      className="no-drag relative"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <button
        onClick={() => window.axle.switchTab(tab.id)}
        className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-[7px] text-left transition-all ${fade} ${
          isActive
            ? 'bg-bg-active text-fg-primary'
            : 'text-fg-secondary hover:bg-bg-hover hover:text-fg-primary'
        }`}
      >
        {/* Favicon */}
        <div className="flex h-4 w-4 shrink-0 items-center justify-center">
          {tab.faviconUrl ? (
            <img
              src={tab.faviconUrl}
              alt=""
              className="h-4 w-4 rounded"
              onError={(e) => {
                ;(e.target as HTMLImageElement).style.display = 'none'
              }}
            />
          ) : (
            <div
              className={`h-2.5 w-2.5 rounded-full ${isActive ? 'bg-accent/50' : 'bg-fg-muted/20'}`}
            />
          )}
        </div>

        {/* Title */}
        <span className="flex-1 truncate text-[13px]">{tab.title || 'New Tab'}</span>

        {/* Loading indicator */}
        {tab.isLoading && (
          <div className="h-1.5 w-1.5 shrink-0 animate-pulse rounded-full bg-accent" />
        )}

        {/* Close */}
        {hovered && !tab.isLoading && (
          <button
            onClick={(e) => {
              e.stopPropagation()
              window.axle.closeTab(tab.id)
            }}
            className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md text-fg-muted hover:text-fg-primary hover:bg-bg-active transition-colors"
          >
            <svg
              width="10"
              height="10"
              viewBox="0 0 10 10"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            >
              <line x1="2.5" y1="2.5" x2="7.5" y2="7.5" />
              <line x1="7.5" y1="2.5" x2="2.5" y2="7.5" />
            </svg>
          </button>
        )}
      </button>
    </div>
  )
}

import { useState } from 'react'
import { useTabStore } from '@/stores/tabStore'
import type { TabState } from '@shared/types/tabs'

interface TabItemProps {
  tab: TabState
}

export function TabItem({ tab }: TabItemProps): JSX.Element {
  const activeTabId = useTabStore((s) => s.activeTabId)
  const isActive = tab.id === activeTabId
  const [isHovered, setIsHovered] = useState(false)

  // Fade old tabs
  const age = Date.now() - tab.lastAccessedAt
  const mins = age / 60000
  let opacity = ''
  if (!isActive && mins > 60) opacity = 'opacity-35'
  else if (!isActive && mins > 30) opacity = 'opacity-55'
  else if (!isActive && mins > 10) opacity = 'opacity-75'

  return (
    <div
      className="group relative no-drag"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <button
        onClick={() => window.axle.switchTab(tab.id)}
        className={`flex w-full items-center gap-2 rounded-lg px-2.5 py-[5px] text-left transition-all duration-150 ${opacity} ${
          isActive
            ? 'bg-bg-active/80 text-fg-primary'
            : 'text-fg-secondary hover:bg-bg-hover/60 hover:text-fg-primary'
        }`}
      >
        {/* Favicon */}
        <div className="flex h-[14px] w-[14px] shrink-0 items-center justify-center">
          {tab.faviconUrl ? (
            <img
              src={tab.faviconUrl}
              alt=""
              className="h-[14px] w-[14px] rounded-[3px]"
              onError={(e) => {
                ;(e.target as HTMLImageElement).style.display = 'none'
              }}
            />
          ) : (
            <div
              className={`h-2 w-2 rounded-full ${isActive ? 'bg-accent/60' : 'bg-fg-muted/25'}`}
            />
          )}
        </div>

        {/* Title */}
        <span className="flex-1 truncate text-[11.5px] leading-tight">
          {tab.title || 'New Tab'}
        </span>

        {/* Loading pulse */}
        {tab.isLoading && (
          <div className="ml-auto h-1 w-1 shrink-0 animate-pulse rounded-full bg-accent" />
        )}

        {/* Close on hover */}
        {isHovered && !tab.isLoading && (
          <button
            onClick={(e) => {
              e.stopPropagation()
              window.axle.closeTab(tab.id)
            }}
            className="ml-auto flex h-4 w-4 shrink-0 items-center justify-center rounded text-fg-muted/40 hover:text-fg-primary hover:bg-bg-active transition-colors"
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
              <line x1="2.5" y1="2.5" x2="7.5" y2="7.5" />
              <line x1="7.5" y1="2.5" x2="2.5" y2="7.5" />
            </svg>
          </button>
        )}
      </button>
    </div>
  )
}

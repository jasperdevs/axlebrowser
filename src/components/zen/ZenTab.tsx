import { useState } from 'react'
import { useTabStore } from '@/stores/tabStore'
import type { TabState } from '@shared/types/tabs'

interface ZenTabProps {
  tab: TabState
  collapsed: boolean
}

export function ZenTab({ tab, collapsed }: ZenTabProps): JSX.Element {
  const activeTabId = useTabStore((s) => s.activeTabId)
  const isActive = tab.id === activeTabId
  const [hovered, setHovered] = useState(false)

  if (collapsed) {
    // Collapsed: icon only, centered
    return (
      <button
        onClick={() => window.axle.switchTab(tab.id)}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className={`tab-pressable relative flex items-center justify-center rounded-[var(--zen-radius-tab)] transition-all ${
          isActive
            ? 'bg-[var(--zen-tab-selected)] shadow-[var(--zen-tab-shadow)]'
            : 'hover:bg-[var(--zen-tab-hover)]'
        }`}
        style={{ height: 'var(--zen-tab-height)', width: '100%' }}
        title={tab.title}
      >
        <Favicon url={tab.faviconUrl} loading={tab.isLoading} />

        {/* Tooltip on hover */}
        {hovered && (
          <div className="absolute left-full z-50 ml-2 whitespace-nowrap rounded-md bg-[var(--zen-panel-bg)] px-2.5 py-1.5 text-[12px] text-white shadow-lg border border-[var(--zen-border)]">
            {tab.title || 'New Tab'}
          </div>
        )}
      </button>
    )
  }

  // Expanded: favicon + title
  return (
    <div onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
      <button
        onClick={() => window.axle.switchTab(tab.id)}
        className={`tab-pressable flex w-full items-center rounded-[var(--zen-radius-tab)] transition-all ${
          isActive
            ? 'bg-[var(--zen-tab-selected)] shadow-[var(--zen-tab-shadow)]'
            : 'hover:bg-[var(--zen-tab-hover)]'
        }`}
        style={{
          height: 'var(--zen-tab-height)',
          padding: `0 var(--zen-tab-padding-x)`
        }}
      >
        <Favicon url={tab.faviconUrl} loading={tab.isLoading} />

        <span
          className="flex-1 truncate text-[13px]"
          style={{
            marginLeft: 'var(--zen-tab-icon-gap)',
            color: isActive ? 'var(--zen-text)' : 'var(--zen-text-secondary)'
          }}
        >
          {tab.title || 'New Tab'}
        </span>

        {/* Close button */}
        {hovered && (
          <button
            onClick={(e) => {
              e.stopPropagation()
              window.axle.closeTab(tab.id)
            }}
            className="flex h-5 w-5 shrink-0 items-center justify-center rounded-[var(--zen-radius-tab)] text-[var(--zen-text-muted)] hover:bg-[rgba(255,255,255,0.1)] hover:text-[var(--zen-text)] transition-colors"
          >
            <svg
              width="9"
              height="9"
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
        )}
      </button>
    </div>
  )
}

function Favicon({ url, loading }: { url: string | null; loading: boolean }): JSX.Element {
  return (
    <div className="relative flex h-4 w-4 shrink-0 items-center justify-center">
      {url ? (
        <img src={url} alt="" className="h-4 w-4 rounded" />
      ) : (
        <div className="h-3.5 w-3.5 rounded bg-[rgba(255,255,255,0.12)]" />
      )}
      {loading && (
        <div className="absolute -bottom-0.5 -right-0.5 h-1.5 w-1.5 animate-pulse rounded-full bg-white/50" />
      )}
    </div>
  )
}

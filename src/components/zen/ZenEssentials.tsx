import { useTabStore } from '@/stores/tabStore'
import { useUIStore } from '@/stores/uiStore'

export function ZenEssentials(): JSX.Element {
  const pinnedTabs = useTabStore((s) => s.pinnedTabs)
  const activeTabId = useTabStore((s) => s.activeTabId)
  const collapsed = useUIStore((s) => s.sidebarCollapsed)

  if (pinnedTabs.length === 0) return <></>

  return (
    <div
      className="no-drag px-1"
      style={{
        display: 'grid',
        gridTemplateColumns: collapsed ? '1fr' : `repeat(auto-fit, minmax(max(23.7%, 40px), 1fr))`,
        gap: '2px'
      }}
    >
      {pinnedTabs.map((tab) => {
        const isActive = tab.id === activeTabId
        return (
          <button
            key={tab.id}
            onClick={() => window.axle.switchTab(tab.id)}
            className={`tab-pressable flex items-center justify-center rounded-[var(--zen-radius-tab)] transition-all ${
              isActive
                ? 'bg-[var(--zen-tab-selected)] shadow-[var(--zen-tab-shadow)]'
                : 'bg-[var(--zen-element-bg)] hover:bg-[var(--zen-tab-hover)]'
            }`}
            style={{ height: collapsed ? 40 : 'var(--zen-essential-height)' }}
            title={tab.title}
          >
            {tab.faviconUrl ? (
              <img
                src={tab.faviconUrl}
                alt=""
                className="h-4 w-4 rounded"
                onError={(e) => {
                  const el = e.target as HTMLImageElement
                  el.style.display = 'none'
                  el.parentElement!.innerHTML = `<div class="h-4 w-4 rounded bg-[rgba(255,255,255,0.15)]"></div>`
                }}
              />
            ) : (
              <div className="h-4 w-4 rounded bg-[rgba(255,255,255,0.15)]" />
            )}
            {tab.isLoading && (
              <div className="absolute bottom-1 right-1 h-1 w-1 animate-pulse rounded-full bg-white/60" />
            )}
          </button>
        )
      })}
    </div>
  )
}

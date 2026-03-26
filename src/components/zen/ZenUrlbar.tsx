import { useRef, useEffect, useState } from 'react'
import { useUIStore } from '@/stores/uiStore'
import { useTabStore } from '@/stores/tabStore'

export function ZenUrlbar(): JSX.Element {
  const [query, setQuery] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const closeUrlbar = useUIStore((s) => s.closeUrlbar)
  const activeTabId = useTabStore((s) => s.activeTabId)
  const nav = useTabStore((s) => s.activeNavigation)
  const tabs = useTabStore((s) => s.tabs)
  const pinnedTabs = useTabStore((s) => s.pinnedTabs)

  useEffect(() => {
    inputRef.current?.focus()
    if (nav?.url && nav.url !== 'about:blank' && !nav.url.includes('newtab')) {
      setQuery(nav.url)
      setTimeout(() => inputRef.current?.select(), 10)
    }
  }, [nav?.url])

  // Match tabs
  const allTabs = [...pinnedTabs, ...tabs]
  const matches =
    query.length > 1
      ? allTabs
          .filter(
            (t) =>
              t.title.toLowerCase().includes(query.toLowerCase()) ||
              t.url.toLowerCase().includes(query.toLowerCase())
          )
          .slice(0, 6)
      : []

  function handleSubmit(e: React.FormEvent): void {
    e.preventDefault()
    if (!query.trim()) return
    if (activeTabId) {
      window.axle.navigate(activeTabId, query.trim())
    }
    closeUrlbar()
  }

  function switchToTab(tabId: string): void {
    window.axle.switchTab(tabId)
    closeUrlbar()
  }

  return (
    <div
      className="fixed inset-0 z-[1000] flex items-start justify-center"
      style={{ paddingTop: '18vh' }}
      onClick={closeUrlbar}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" />

      {/* URL bar */}
      <div
        className="relative z-10 w-full overflow-hidden"
        style={{
          maxWidth: 'min(90%, 62rem)',
          borderRadius: '12px',
          background: 'var(--zen-panel-bg)',
          border: '1px solid var(--zen-border)',
          boxShadow: 'var(--zen-urlbar-shadow)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <form
          onSubmit={handleSubmit}
          className="flex items-center gap-3 px-4"
          style={{ height: 'var(--zen-urlbar-height)' }}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            className="shrink-0 text-[var(--zen-text-muted)]"
          >
            <circle cx="6.5" cy="6.5" r="4.5" />
            <line x1="10" y1="10" x2="14" y2="14" />
          </svg>

          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search or enter address"
            className="flex-1 bg-transparent text-[14px] font-medium text-[var(--zen-text)] placeholder:text-[var(--zen-text-muted)] outline-none"
            spellCheck={false}
            autoComplete="off"
          />
        </form>

        {/* Results */}
        {matches.length > 0 && (
          <div
            className="border-t border-[var(--zen-border)] py-1"
            style={{ maxHeight: 260, overflowY: 'auto' }}
          >
            {matches.map((tab) => (
              <button
                key={tab.id}
                onClick={() => switchToTab(tab.id)}
                className="flex w-full items-center gap-3 px-4 py-2 text-left hover:bg-[var(--zen-element-bg-hover)] transition-colors"
              >
                {tab.faviconUrl ? (
                  <img src={tab.faviconUrl} alt="" className="h-4 w-4 shrink-0 rounded" />
                ) : (
                  <div className="h-4 w-4 shrink-0 rounded bg-[rgba(255,255,255,0.1)]" />
                )}
                <div className="flex flex-col overflow-hidden">
                  <span className="truncate text-[13px] font-medium text-[var(--zen-text)]">
                    {tab.title}
                  </span>
                  <span className="truncate text-[11px] text-[var(--zen-text-muted)]">
                    {tab.url}
                  </span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

import { useTabStore } from '@/stores/tabStore'
import { useUIStore } from '@/stores/uiStore'

export function ZenTopButtons(): JSX.Element {
  const collapsed = useUIStore((s) => s.sidebarCollapsed)
  const nav = useTabStore((s) => s.activeNavigation)
  const activeTabId = useTabStore((s) => s.activeTabId)

  const canBack = nav?.canGoBack ?? false
  const canFwd = nav?.canGoForward ?? false

  return (
    <div
      className={`drag-region flex items-center ${collapsed ? 'flex-col gap-1 py-2' : 'flex-row gap-0.5 px-1 py-2'}`}
      style={{ minHeight: 'var(--zen-toolbar-height)' }}
    >
      {/* Sidebar toggle */}
      <NavBtn onClick={() => useUIStore.getState().toggleSidebar()} title="Toggle Sidebar (Ctrl+B)">
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="2" y="2" width="12" height="12" rx="2" />
          <line x1="6" y1="2" x2="6" y2="14" />
        </svg>
      </NavBtn>

      {/* Back */}
      <NavBtn
        disabled={!canBack}
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

      {/* Forward */}
      <NavBtn
        disabled={!canFwd}
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

      {/* Reload */}
      {!collapsed && (
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
            <path d="M3 8a5 5 0 0 1 8.5-3.5" />
            <polyline points="12,2 12,5 9,5" />
            <path d="M13 8a5 5 0 0 1-8.5 3.5" />
            <polyline points="4,14 4,11 7,11" />
          </svg>
        </NavBtn>
      )}
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
      className={`no-drag flex items-center justify-center rounded-[var(--zen-radius-button)] transition-all active:hover:scale-95 ${
        disabled
          ? 'text-[var(--zen-text-muted)] cursor-default'
          : 'text-[var(--zen-text-secondary)] hover:bg-[var(--zen-element-bg-hover)]'
      }`}
      style={{
        width: 'calc(var(--zen-toolbar-button-size) + 6px * 2)',
        height: 'calc(var(--zen-toolbar-button-size) + 6px * 2)',
        padding: '6px'
      }}
    >
      {children}
    </button>
  )
}

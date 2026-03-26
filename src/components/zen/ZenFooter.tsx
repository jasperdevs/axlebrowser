import { useUIStore } from '@/stores/uiStore'

export function ZenFooter(): JSX.Element {
  const collapsed = useUIStore((s) => s.sidebarCollapsed)
  const openUrlbar = useUIStore((s) => s.openUrlbar)

  return (
    <div
      className={`no-drag flex items-center gap-1 px-1 py-1.5 ${
        collapsed ? 'flex-col' : 'flex-row'
      }`}
    >
      {/* URL bar trigger */}
      {!collapsed && (
        <button
          onClick={() => openUrlbar()}
          className="flex flex-1 items-center gap-2 rounded-[var(--zen-radius-button)] bg-[var(--zen-element-bg)] px-3 py-1.5 text-[12px] text-[var(--zen-text-muted)] hover:bg-[var(--zen-element-bg-hover)] transition-colors"
          title="Search or enter URL (Ctrl+L)"
        >
          <svg
            width="13"
            height="13"
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <circle cx="6.5" cy="6.5" r="4.5" />
            <line x1="10" y1="10" x2="14" y2="14" />
          </svg>
          Search or enter URL
        </button>
      )}

      {collapsed && (
        <button
          onClick={() => openUrlbar()}
          className="flex h-7 w-7 items-center justify-center rounded-[var(--zen-radius-button)] text-[var(--zen-text-muted)] hover:bg-[var(--zen-element-bg-hover)] transition-colors"
          title="Search (Ctrl+L)"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <circle cx="6.5" cy="6.5" r="4.5" />
            <line x1="10" y1="10" x2="14" y2="14" />
          </svg>
        </button>
      )}
    </div>
  )
}

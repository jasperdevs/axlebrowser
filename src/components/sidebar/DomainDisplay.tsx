import { useTabStore } from '@/stores/tabStore'
import { useUIStore } from '@/stores/uiStore'

export function DomainDisplay(): JSX.Element {
  const nav = useTabStore((s) => s.activeNavigation)
  const setOmniboxOpen = useUIStore((s) => s.setOmniboxOpen)

  let domain = ''
  let isSecure = false

  if (nav?.url) {
    try {
      const url = new URL(nav.url)
      domain = url.hostname.replace(/^www\./, '')
      isSecure = url.protocol === 'https:'
    } catch {
      domain = ''
    }
  }

  if (!domain) return <div className="flex-1" />

  return (
    <button
      onClick={() => setOmniboxOpen(true)}
      className="flex flex-1 items-center gap-1 overflow-hidden rounded-md px-1.5 py-0.5 text-[10px] text-fg-muted hover:text-fg-secondary hover:bg-bg-hover/50 transition-colors truncate"
      title={nav?.url}
    >
      {isSecure && (
        <svg
          width="8"
          height="8"
          viewBox="0 0 10 10"
          fill="currentColor"
          className="shrink-0 opacity-40"
        >
          <path d="M7.5 4.5V3.5C7.5 2.12 6.38 1 5 1S2.5 2.12 2.5 3.5V4.5H2C1.45 4.5 1 4.95 1 5.5V8.5C1 9.05 1.45 9.5 2 9.5H8C8.55 9.5 9 9.05 9 8.5V5.5C9 4.95 8.55 4.5 8 4.5H7.5ZM3.5 3.5C3.5 2.67 4.17 2 5 2S6.5 2.67 6.5 3.5V4.5H3.5V3.5Z" />
        </svg>
      )}
      <span className="truncate">{domain}</span>
    </button>
  )
}

import { useState } from 'react'
import axleLogo from '@/assets/axleXonly.svg'

export function NewTab(): JSX.Element {
  const [query, setQuery] = useState('')

  function handleSubmit(e: React.FormEvent): void {
    e.preventDefault()
    if (!query.trim()) return

    // Navigate in the current tab
    const url =
      query.includes('.') && !query.includes(' ')
        ? `https://${query.trim()}`
        : `https://www.google.com/search?q=${encodeURIComponent(query.trim())}`

    // This would need to communicate with the main process
    // For now, open via omnibox
    window.location.href = url
  }

  return (
    <div className="flex h-full w-full flex-col items-center justify-center bg-bg-base px-4">
      {/* Logo */}
      <img src={axleLogo} alt="Axle" className="mb-8 h-16 w-16 opacity-20" />

      {/* Search bar */}
      <form onSubmit={handleSubmit} className="w-full max-w-[480px]">
        <div className="flex items-center gap-3 rounded-2xl border border-border-default bg-bg-elevated px-4 py-3 focus-within:border-accent/30 transition-colors">
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            className="shrink-0 text-fg-muted"
          >
            <circle cx="6.5" cy="6.5" r="4.5" />
            <line x1="10" y1="10" x2="14" y2="14" />
          </svg>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search or enter URL..."
            className="flex-1 bg-transparent text-sm text-fg-primary placeholder:text-fg-muted outline-none"
            autoFocus
            spellCheck={false}
          />
        </div>
      </form>

      {/* Subtle hint */}
      <p className="mt-4 text-[11px] text-fg-muted/50">Ctrl+L to open the omnibox</p>
    </div>
  )
}

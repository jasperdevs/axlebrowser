import { useState, useRef, useEffect, useMemo } from 'react'
import { useUIStore } from '@/stores/uiStore'
import { useTabStore } from '@/stores/tabStore'
import { useThemeStore } from '@/stores/themeStore'
import { TINT_PRESETS } from '@shared/types/theme'

interface Command {
  id: string
  label: string
  description?: string
  shortcut?: string
  action: () => void
}

export function CommandPalette(): JSX.Element {
  const [query, setQuery] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const setCommandPaletteOpen = useUIStore((s) => s.setCommandPaletteOpen)
  const toggleSidebar = useUIStore((s) => s.toggleSidebar)
  const setOmniboxOpen = useUIStore((s) => s.setOmniboxOpen)
  const setMode = useThemeStore((s) => s.setMode)
  const setTint = useThemeStore((s) => s.setTint)
  const mode = useThemeStore((s) => s.mode)
  const tabs = useTabStore((s) => s.tabs)
  const pinnedTabs = useTabStore((s) => s.pinnedTabs)
  const [selectedIndex, setSelectedIndex] = useState(0)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const commands: Command[] = useMemo(
    () => [
      {
        id: 'new-tab',
        label: 'New Tab',
        shortcut: 'Ctrl+T',
        action: () => {
          window.axle.createTab()
          setCommandPaletteOpen(false)
        }
      },
      {
        id: 'toggle-sidebar',
        label: 'Toggle Sidebar',
        shortcut: 'Ctrl+B',
        action: () => {
          toggleSidebar()
          setCommandPaletteOpen(false)
        }
      },
      {
        id: 'open-omnibox',
        label: 'Go to URL',
        shortcut: 'Ctrl+L',
        action: () => {
          setCommandPaletteOpen(false)
          setTimeout(() => setOmniboxOpen(true), 50)
        }
      },
      {
        id: 'theme-dark',
        label: 'Theme: Dark',
        description: mode === 'dark' ? 'Current' : undefined,
        action: () => {
          setMode('dark')
          setCommandPaletteOpen(false)
        }
      },
      {
        id: 'theme-light',
        label: 'Theme: Light',
        description: mode === 'light' ? 'Current' : undefined,
        action: () => {
          setMode('light')
          setCommandPaletteOpen(false)
        }
      },
      ...Object.entries(TINT_PRESETS).map(([name, config]) => ({
        id: `tint-${name}`,
        label: `Tint: ${name.charAt(0).toUpperCase() + name.slice(1)}`,
        action: () => {
          setTint(config)
          setCommandPaletteOpen(false)
        }
      })),
      // Switch to tab commands
      ...[...pinnedTabs, ...tabs].map((tab) => ({
        id: `switch-${tab.id}`,
        label: `Switch to: ${tab.title || 'Untitled'}`,
        description: tab.url,
        action: () => {
          window.axle.switchTab(tab.id)
          setCommandPaletteOpen(false)
        }
      }))
    ],
    [mode, tabs, pinnedTabs, setMode, setTint, toggleSidebar, setOmniboxOpen, setCommandPaletteOpen]
  )

  const filtered = query
    ? commands.filter(
        (c) =>
          c.label.toLowerCase().includes(query.toLowerCase()) ||
          c.description?.toLowerCase().includes(query.toLowerCase())
      )
    : commands

  useEffect(() => {
    setSelectedIndex(0)
  }, [query])

  function handleKeyDown(e: React.KeyboardEvent): void {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex((i) => Math.min(i + 1, filtered.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex((i) => Math.max(i - 1, 0))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (filtered[selectedIndex]) {
        filtered[selectedIndex].action()
      }
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh]"
      onClick={() => setCommandPaletteOpen(false)}
    >
      <div className="absolute inset-0 bg-black/40" />

      <div
        className="relative z-10 w-full max-w-[480px] overflow-hidden rounded-2xl border border-border-default bg-bg-elevated shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 px-4 py-3 border-b border-border-default">
          <span className="text-[10px] text-fg-muted bg-bg-active px-1.5 py-0.5 rounded font-mono">
            {'>'}
          </span>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a command..."
            className="flex-1 bg-transparent text-sm text-fg-primary placeholder:text-fg-muted outline-none"
            spellCheck={false}
          />
        </div>

        <div className="max-h-[300px] overflow-y-auto py-1">
          {filtered.slice(0, 20).map((cmd, i) => (
            <button
              key={cmd.id}
              onClick={cmd.action}
              className={`flex w-full items-center justify-between gap-2 px-4 py-2 text-left transition-colors ${
                i === selectedIndex
                  ? 'bg-bg-hover text-fg-primary'
                  : 'text-fg-secondary hover:bg-bg-hover'
              }`}
            >
              <div className="flex flex-col overflow-hidden">
                <span className="truncate text-xs">{cmd.label}</span>
                {cmd.description && (
                  <span className="truncate text-[10px] text-fg-muted">{cmd.description}</span>
                )}
              </div>
              {cmd.shortcut && (
                <span className="shrink-0 text-[10px] text-fg-muted bg-bg-base px-1.5 py-0.5 rounded font-mono">
                  {cmd.shortcut}
                </span>
              )}
            </button>
          ))}
          {filtered.length === 0 && (
            <div className="px-4 py-6 text-center text-xs text-fg-muted">No commands found</div>
          )}
        </div>
      </div>
    </div>
  )
}

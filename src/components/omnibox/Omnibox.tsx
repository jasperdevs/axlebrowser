import { useState, useRef, useEffect } from "react";
import { useUIStore } from "@/stores/uiStore";
import { useTabStore } from "@/stores/tabStore";

export function Omnibox(): JSX.Element {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const setOmniboxOpen = useUIStore((s) => s.setOmniboxOpen);
  const activeTabId = useTabStore((s) => s.activeTabId);
  const nav = useTabStore((s) => s.activeNavigation);
  const tabs = useTabStore((s) => s.tabs);
  const pinnedTabs = useTabStore((s) => s.pinnedTabs);

  // Focus input on mount, prefill with current URL
  useEffect(() => {
    inputRef.current?.focus();
    if (nav?.url && nav.url !== "about:blank") {
      setQuery(nav.url);
      inputRef.current?.select();
    }
  }, [nav?.url]);

  // Filter tabs matching query
  const allTabs = [...pinnedTabs, ...tabs];
  const matchingTabs =
    query.length > 0
      ? allTabs.filter(
          (t) =>
            t.title.toLowerCase().includes(query.toLowerCase()) ||
            t.url.toLowerCase().includes(query.toLowerCase()),
        )
      : [];

  function handleSubmit(e: React.FormEvent): void {
    e.preventDefault();
    if (!query.trim()) return;

    if (activeTabId) {
      window.axle.navigate(activeTabId, query.trim());
    }
    setOmniboxOpen(false);
  }

  function handleSwitchToTab(tabId: string): void {
    window.axle.switchTab(tabId);
    setOmniboxOpen(false);
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh]"
      onClick={() => setOmniboxOpen(false)}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Omnibox panel */}
      <div
        className="relative z-10 w-full max-w-[560px] overflow-hidden rounded-2xl border border-border-default bg-bg-elevated shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <form
          onSubmit={handleSubmit}
          className="flex items-center gap-3 px-4 py-3"
        >
          {/* Search icon */}
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
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search or enter URL..."
            className="flex-1 bg-transparent text-sm text-fg-primary placeholder:text-fg-muted outline-none"
            spellCheck={false}
            autoComplete="off"
          />
        </form>

        {/* Tab matches */}
        {matchingTabs.length > 0 && (
          <div className="border-t border-border-default px-2 py-1.5">
            <div className="px-2 pb-1 text-[10px] uppercase tracking-wider text-fg-muted">
              Open Tabs
            </div>
            {matchingTabs.slice(0, 5).map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleSwitchToTab(tab.id)}
                className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left hover:bg-bg-hover transition-colors"
              >
                {tab.faviconUrl ? (
                  <img
                    src={tab.faviconUrl}
                    alt=""
                    className="h-4 w-4 rounded-sm shrink-0"
                  />
                ) : (
                  <div className="h-3 w-3 rounded-full bg-fg-muted/30 shrink-0" />
                )}
                <div className="flex flex-col overflow-hidden">
                  <span className="truncate text-xs text-fg-primary">
                    {tab.title}
                  </span>
                  <span className="truncate text-[10px] text-fg-muted">
                    {tab.url}
                  </span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

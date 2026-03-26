import { useState } from "react";
import { useTabStore } from "@/stores/tabStore";
import type { TabState } from "@shared/types/tabs";

interface TabItemProps {
  tab: TabState;
}

export function TabItem({ tab }: TabItemProps): JSX.Element {
  const activeTabId = useTabStore((s) => s.activeTabId);
  const isActive = tab.id === activeTabId;
  const [isHovered, setIsHovered] = useState(false);

  // Fade based on recency
  const age = Date.now() - tab.lastAccessedAt;
  const fadeMinutes = age / 1000 / 60;
  let opacityClass = "opacity-100";
  if (!isActive && fadeMinutes > 60) opacityClass = "opacity-40";
  else if (!isActive && fadeMinutes > 30) opacityClass = "opacity-60";
  else if (!isActive && fadeMinutes > 10) opacityClass = "opacity-80";

  return (
    <div
      className={`group relative no-drag`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <button
        onClick={() => window.axle.switchTab(tab.id)}
        className={`flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left transition-colors ${opacityClass} ${
          isActive
            ? "bg-bg-active text-fg-primary"
            : "text-fg-secondary hover:bg-bg-hover hover:text-fg-primary"
        }`}
      >
        {/* Favicon */}
        <div className="flex h-4 w-4 shrink-0 items-center justify-center">
          {tab.faviconUrl ? (
            <img
              src={tab.faviconUrl}
              alt=""
              className="h-4 w-4 rounded-sm"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
          ) : (
            <div className="h-3 w-3 rounded-full bg-fg-muted/30" />
          )}
        </div>

        {/* Title */}
        <span className="truncate text-xs leading-tight">
          {tab.title || "New Tab"}
        </span>

        {/* Loading indicator */}
        {tab.isLoading && (
          <div className="ml-auto h-1.5 w-1.5 shrink-0 animate-pulse rounded-full bg-accent" />
        )}
      </button>

      {/* Close button on hover */}
      {isHovered && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            window.axle.closeTab(tab.id);
          }}
          className="absolute right-1 top-1/2 -translate-y-1/2 flex h-5 w-5 items-center justify-center rounded-md text-fg-muted hover:bg-bg-hover hover:text-fg-primary transition-colors"
        >
          <svg
            width="10"
            height="10"
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

      {/* Thumbnail tooltip on hover */}
      {isHovered && tab.thumbnailDataUrl && !isActive && (
        <div className="absolute left-full top-0 z-50 ml-2 w-60 overflow-hidden rounded-xl border border-border-default bg-bg-elevated shadow-xl">
          <img src={tab.thumbnailDataUrl} alt="" className="w-full" />
          <div className="px-2 py-1.5 text-[11px] text-fg-secondary truncate">
            {tab.title}
          </div>
        </div>
      )}
    </div>
  );
}

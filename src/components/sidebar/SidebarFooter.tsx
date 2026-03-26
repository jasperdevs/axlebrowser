export function SidebarFooter(): JSX.Element {
  return (
    <div className="flex items-center gap-1 border-t border-border-default px-2 py-1.5 no-drag">
      {/* Settings */}
      <button
        className="flex h-7 w-7 items-center justify-center rounded-md text-fg-muted hover:bg-bg-hover hover:text-fg-secondary transition-colors"
        title="Settings"
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 14 14"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.2"
        >
          <circle cx="7" cy="7" r="2.5" />
          <path d="M7 1v1.5M7 11.5V13M1 7h1.5M11.5 7H13M2.75 2.75l1.06 1.06M10.19 10.19l1.06 1.06M2.75 11.25l1.06-1.06M10.19 3.81l1.06-1.06" />
        </svg>
      </button>

      {/* VPN Shield */}
      <button
        className="flex h-7 w-7 items-center justify-center rounded-md text-fg-muted hover:bg-bg-hover hover:text-fg-secondary transition-colors"
        title="VPN"
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 14 14"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.2"
        >
          <path d="M7 1L2 3.5V6.5C2 9.5 4 12 7 13C10 12 12 9.5 12 6.5V3.5L7 1Z" />
        </svg>
      </button>

      {/* Downloads */}
      <button
        className="flex h-7 w-7 items-center justify-center rounded-md text-fg-muted hover:bg-bg-hover hover:text-fg-secondary transition-colors"
        title="Downloads"
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 14 14"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinecap="round"
        >
          <path d="M7 2v8M4 7l3 3 3-3M2 12h10" />
        </svg>
      </button>
    </div>
  );
}

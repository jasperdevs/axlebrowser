import { useTabStore } from "@/stores/tabStore";

export function SidebarNav(): JSX.Element {
  const nav = useTabStore((s) => s.activeNavigation);
  const activeTabId = useTabStore((s) => s.activeTabId);

  const canGoBack = nav?.canGoBack ?? false;
  const canGoForward = nav?.canGoForward ?? false;

  return (
    <div className="flex items-center gap-0.5 px-2 py-1 no-drag">
      <NavButton
        disabled={!canGoBack}
        onClick={() => activeTabId && window.axle.goBack(activeTabId)}
        title="Back (Alt+Left)"
      >
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
          <polyline points="10,3 5,8 10,13" />
        </svg>
      </NavButton>

      <NavButton
        disabled={!canGoForward}
        onClick={() => activeTabId && window.axle.goForward(activeTabId)}
        title="Forward (Alt+Right)"
      >
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
          <polyline points="6,3 11,8 6,13" />
        </svg>
      </NavButton>

      <NavButton
        onClick={() => activeTabId && window.axle.reload(activeTabId)}
        title="Reload (Ctrl+R)"
      >
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
          <path d="M2.5 8a5.5 5.5 0 0 1 9.3-4" />
          <polyline points="12,2 12,5 9,5" />
          <path d="M13.5 8a5.5 5.5 0 0 1-9.3 4" />
          <polyline points="4,14 4,11 7,11" />
        </svg>
      </NavButton>
    </div>
  );
}

function NavButton({
  children,
  disabled = false,
  onClick,
  title,
}: {
  children: React.ReactNode;
  disabled?: boolean;
  onClick?: () => void;
  title?: string;
}): JSX.Element {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`flex items-center justify-center rounded-md w-7 h-7 transition-colors ${
        disabled
          ? "text-fg-muted cursor-default"
          : "text-fg-secondary hover:bg-bg-hover hover:text-fg-primary cursor-default"
      }`}
    >
      {children}
    </button>
  );
}

import { useTabStore } from "@/stores/tabStore";

export function DomainDisplay(): JSX.Element {
  const nav = useTabStore((s) => s.activeNavigation);

  let domain = "";
  let isSecure = false;

  if (nav?.url) {
    try {
      const url = new URL(nav.url);
      domain = url.hostname;
      isSecure = url.protocol === "https:";
    } catch {
      domain = nav.url;
    }
  }

  return (
    <div className="drag-region flex items-center gap-1.5 px-3 pt-2 pb-1">
      {domain && (
        <div className="no-drag flex items-center gap-1.5 overflow-hidden rounded-md px-1.5 py-0.5 text-[11px] text-fg-secondary hover:bg-bg-hover transition-colors cursor-default truncate">
          {isSecure && (
            <svg
              width="10"
              height="10"
              viewBox="0 0 10 10"
              fill="currentColor"
              className="shrink-0 text-fg-muted"
            >
              <path d="M7.5 4.5V3.5C7.5 2.12 6.38 1 5 1S2.5 2.12 2.5 3.5V4.5H2C1.45 4.5 1 4.95 1 5.5V8.5C1 9.05 1.45 9.5 2 9.5H8C8.55 9.5 9 9.05 9 8.5V5.5C9 4.95 8.55 4.5 8 4.5H7.5ZM3.5 3.5C3.5 2.67 4.17 2 5 2S6.5 2.67 6.5 3.5V4.5H3.5V3.5Z" />
            </svg>
          )}
          <span className="truncate">{domain}</span>
        </div>
      )}
    </div>
  );
}

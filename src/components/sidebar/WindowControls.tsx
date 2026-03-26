import { useState, useEffect } from 'react'

export function WindowControls(): JSX.Element {
  const [maximized, setMaximized] = useState(true)

  useEffect(() => {
    // Check initial state
    window.axle.isMaximized().then(setMaximized)
  }, [])

  async function handleMaximize(): Promise<void> {
    await window.axle.maximizeWindow()
    const isMax = await window.axle.isMaximized()
    setMaximized(isMax)
  }

  return (
    <div className="flex items-center gap-1 no-drag">
      {/* Minimize */}
      <button
        onClick={() => window.axle.minimizeWindow()}
        className="flex h-6 w-6 items-center justify-center rounded-md text-fg-muted hover:bg-bg-hover hover:text-fg-secondary transition-colors"
        title="Minimize"
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
          <line x1="2" y1="5" x2="8" y2="5" />
        </svg>
      </button>

      {/* Maximize / Restore */}
      <button
        onClick={handleMaximize}
        className="flex h-6 w-6 items-center justify-center rounded-md text-fg-muted hover:bg-bg-hover hover:text-fg-secondary transition-colors"
        title={maximized ? 'Restore' : 'Maximize'}
      >
        {maximized ? (
          <svg
            width="10"
            height="10"
            viewBox="0 0 10 10"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.2"
          >
            <rect x="0.5" y="2.5" width="7" height="7" rx="1" />
            <path d="M2.5 2.5V1.5C2.5 0.95 2.95 0.5 3.5 0.5H8.5C9.05 0.5 9.5 0.95 9.5 1.5V6.5C9.5 7.05 9.05 7.5 8.5 7.5H7.5" />
          </svg>
        ) : (
          <svg
            width="10"
            height="10"
            viewBox="0 0 10 10"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.2"
          >
            <rect x="0.5" y="0.5" width="9" height="9" rx="1.5" />
          </svg>
        )}
      </button>

      {/* Close */}
      <button
        onClick={() => window.axle.closeWindow()}
        className="flex h-6 w-6 items-center justify-center rounded-md text-fg-muted hover:bg-[#e81123] hover:text-white transition-colors"
        title="Close"
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
    </div>
  )
}

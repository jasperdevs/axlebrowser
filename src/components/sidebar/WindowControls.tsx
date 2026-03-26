import { useState, useEffect } from 'react'

interface WindowControlsProps {
  compact?: boolean
}

export function WindowControls({ compact: _compact }: WindowControlsProps): JSX.Element {
  const [maximized, setMaximized] = useState(true)

  useEffect(() => {
    window.axle.isMaximized().then(setMaximized)
  }, [])

  async function handleMaximize(): Promise<void> {
    await window.axle.maximizeWindow()
    setMaximized(await window.axle.isMaximized())
  }

  return (
    <div className="flex items-center gap-[6px] no-drag">
      {/* Minimize */}
      <button
        onClick={() => window.axle.minimizeWindow()}
        className="group flex h-[13px] w-[13px] items-center justify-center rounded-full bg-fg-muted/15 hover:bg-[#f5bf4f] transition-colors"
        title="Minimize"
      >
        <svg
          width="7"
          height="7"
          viewBox="0 0 8 8"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          className="opacity-0 group-hover:opacity-100 text-black transition-opacity"
        >
          <line x1="1.5" y1="4" x2="6.5" y2="4" />
        </svg>
      </button>

      {/* Maximize */}
      <button
        onClick={handleMaximize}
        className="group flex h-[13px] w-[13px] items-center justify-center rounded-full bg-fg-muted/15 hover:bg-[#34c759] transition-colors"
        title={maximized ? 'Restore' : 'Maximize'}
      >
        <svg
          width="7"
          height="7"
          viewBox="0 0 8 8"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinecap="round"
          className="opacity-0 group-hover:opacity-100 text-black transition-opacity"
        >
          {maximized ? (
            <>
              <line x1="1.5" y1="4" x2="4" y2="1.5" />
              <line x1="4" y1="1.5" x2="6.5" y2="4" />
              <line x1="1.5" y1="4" x2="4" y2="6.5" />
              <line x1="4" y1="6.5" x2="6.5" y2="4" />
            </>
          ) : (
            <>
              <line x1="1" y1="5" x2="3.5" y2="7.5" />
              <line x1="4.5" y1="0.5" x2="7" y2="3" />
            </>
          )}
        </svg>
      </button>

      {/* Close */}
      <button
        onClick={() => window.axle.closeWindow()}
        className="group flex h-[13px] w-[13px] items-center justify-center rounded-full bg-fg-muted/15 hover:bg-[#ff5f57] transition-colors"
        title="Close"
      >
        <svg
          width="7"
          height="7"
          viewBox="0 0 8 8"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          className="opacity-0 group-hover:opacity-100 text-black transition-opacity"
        >
          <line x1="1.5" y1="1.5" x2="6.5" y2="6.5" />
          <line x1="6.5" y1="1.5" x2="1.5" y2="6.5" />
        </svg>
      </button>
    </div>
  )
}

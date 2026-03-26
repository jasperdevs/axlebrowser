import { useState, useEffect } from 'react'

interface WindowControlsProps {
  compact?: boolean
}

export function WindowControls({ compact }: WindowControlsProps): JSX.Element {
  const [maximized, setMaximized] = useState(true)

  useEffect(() => {
    window.axle.isMaximized().then(setMaximized)
  }, [])

  async function handleMaximize(): Promise<void> {
    await window.axle.maximizeWindow()
    const isMax = await window.axle.isMaximized()
    setMaximized(isMax)
  }

  const size = compact ? 'h-5 w-5' : 'h-[18px] w-[18px]'
  const iconSize = compact ? 7 : 8

  return (
    <div className={`flex items-center ${compact ? 'gap-0.5' : 'gap-1'} no-drag`}>
      <button
        onClick={() => window.axle.minimizeWindow()}
        className={`flex ${size} items-center justify-center rounded-full text-fg-muted/40 hover:bg-fg-muted/15 hover:text-fg-muted transition-all`}
        title="Minimize"
      >
        <svg
          width={iconSize}
          height={iconSize}
          viewBox="0 0 10 10"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        >
          <line x1="2.5" y1="5" x2="7.5" y2="5" />
        </svg>
      </button>

      <button
        onClick={handleMaximize}
        className={`flex ${size} items-center justify-center rounded-full text-fg-muted/40 hover:bg-fg-muted/15 hover:text-fg-muted transition-all`}
        title={maximized ? 'Restore' : 'Maximize'}
      >
        {maximized ? (
          <svg
            width={iconSize}
            height={iconSize}
            viewBox="0 0 10 10"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.2"
          >
            <rect x="1" y="3" width="6" height="6" rx="1" />
            <path d="M3 3V2C3 1.45 3.45 1 4 1H8C8.55 1 9 1.45 9 2V6C9 6.55 8.55 7 8 7H7" />
          </svg>
        ) : (
          <svg
            width={iconSize}
            height={iconSize}
            viewBox="0 0 10 10"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.2"
          >
            <rect x="1" y="1" width="8" height="8" rx="1.5" />
          </svg>
        )}
      </button>

      <button
        onClick={() => window.axle.closeWindow()}
        className={`flex ${size} items-center justify-center rounded-full text-fg-muted/40 hover:bg-[#e81123]/80 hover:text-white transition-all`}
        title="Close"
      >
        <svg
          width={iconSize}
          height={iconSize}
          viewBox="0 0 10 10"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        >
          <line x1="2.5" y1="2.5" x2="7.5" y2="7.5" />
          <line x1="7.5" y1="2.5" x2="2.5" y2="7.5" />
        </svg>
      </button>
    </div>
  )
}

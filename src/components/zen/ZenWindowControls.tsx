import { useState, useEffect } from 'react'

export function ZenWindowControls(): JSX.Element {
  const [maximized, setMaximized] = useState(true)

  useEffect(() => {
    window.axle.isMaximized().then(setMaximized)
  }, [])

  async function handleMaximize(): Promise<void> {
    await window.axle.maximizeWindow()
    setMaximized(await window.axle.isMaximized())
  }

  return (
    <div className="no-drag flex items-center gap-2">
      <WinBtn
        onClick={() => window.axle.minimizeWindow()}
        title="Minimize"
        hover="hover:bg-[rgba(255,255,255,0.1)]"
      >
        <svg width="10" height="1" viewBox="0 0 10 1">
          <rect width="10" height="1" fill="currentColor" />
        </svg>
      </WinBtn>
      <WinBtn
        onClick={handleMaximize}
        title={maximized ? 'Restore' : 'Maximize'}
        hover="hover:bg-[rgba(255,255,255,0.1)]"
      >
        {maximized ? (
          <svg
            width="10"
            height="10"
            viewBox="0 0 10 10"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
          >
            <rect x="2" y="0" width="8" height="8" rx="1" />
            <rect x="0" y="2" width="8" height="8" rx="1" />
          </svg>
        ) : (
          <svg
            width="10"
            height="10"
            viewBox="0 0 10 10"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
          >
            <rect x="0.5" y="0.5" width="9" height="9" rx="1.5" />
          </svg>
        )}
      </WinBtn>
      <WinBtn onClick={() => window.axle.closeWindow()} title="Close" hover="hover:bg-[#c42b1c]">
        <svg
          width="10"
          height="10"
          viewBox="0 0 10 10"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.2"
        >
          <line x1="1" y1="1" x2="9" y2="9" />
          <line x1="9" y1="1" x2="1" y2="9" />
        </svg>
      </WinBtn>
    </div>
  )
}

function WinBtn({
  children,
  onClick,
  title,
  hover
}: {
  children: React.ReactNode
  onClick: () => void
  title: string
  hover: string
}): JSX.Element {
  return (
    <button
      onClick={onClick}
      title={title}
      className={`flex h-8 w-11 items-center justify-center text-[rgba(255,255,255,0.7)] transition-colors ${hover}`}
    >
      {children}
    </button>
  )
}

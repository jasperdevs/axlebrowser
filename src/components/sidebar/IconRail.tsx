import { useSpaceStore } from '@/stores/spaceStore'
import { useUIStore } from '@/stores/uiStore'
import { SpaceIcon } from './SpaceIcon'
import axleLogo from '@/assets/axleXonly.svg'

export function IconRail(): JSX.Element {
  const spaces = useSpaceStore((s) => s.spaces)
  const activeSpaceId = useSpaceStore((s) => s.activeSpaceId)
  const switchSpace = useSpaceStore((s) => s.switchSpace)
  const addSpace = useSpaceStore((s) => s.addSpace)
  const setSettingsOpen = useUIStore((s) => s.setSettingsOpen)

  return (
    <div className="flex h-full w-[52px] flex-col items-center border-r border-border-default bg-bg-base py-3">
      {/* Drag region at top */}
      <div className="drag-region mb-4 h-2 w-full" />

      {/* Axle logo */}
      <div className="no-drag mb-5">
        <img src={axleLogo} alt="Axle" className="h-6 w-6 opacity-40" />
      </div>

      {/* Space icons */}
      <div className="no-drag flex flex-1 flex-col items-center gap-2 overflow-y-auto">
        {spaces.map((space) => (
          <SpaceIcon
            key={space.id}
            space={space}
            isActive={space.id === activeSpaceId}
            onClick={() => switchSpace(space.id)}
          />
        ))}

        {/* Add space */}
        <button
          onClick={() => {
            const id = addSpace('New Space')
            switchSpace(id)
          }}
          className="flex h-9 w-9 items-center justify-center rounded-xl text-fg-muted hover:text-fg-secondary hover:bg-bg-hover transition-all"
          title="New Space"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          >
            <line x1="8" y1="3" x2="8" y2="13" />
            <line x1="3" y1="8" x2="13" y2="8" />
          </svg>
        </button>
      </div>

      {/* Settings */}
      <div className="no-drag mt-3">
        <button
          onClick={() => setSettingsOpen(true)}
          className="flex h-9 w-9 items-center justify-center rounded-xl text-fg-muted hover:text-fg-secondary hover:bg-bg-hover transition-all"
          title="Settings"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.3"
          >
            <circle cx="9" cy="9" r="3" />
            <path d="M9 2v2M9 14v2M2 9h2M14 9h2M4.2 4.2l1.4 1.4M12.4 12.4l1.4 1.4M4.2 13.8l1.4-1.4M12.4 5.6l1.4-1.4" />
          </svg>
        </button>
      </div>
    </div>
  )
}

import { useSpaceStore } from '@/stores/spaceStore'
import { useUIStore } from '@/stores/uiStore'
import { useTabStore } from '@/stores/tabStore'
import { WindowControls } from './WindowControls'
import { SpaceIcon } from './SpaceIcon'
import axleLogo from '@/assets/axleXonly.svg'

export function IconRail(): JSX.Element {
  const spaces = useSpaceStore((s) => s.spaces)
  const activeSpaceId = useSpaceStore((s) => s.activeSpaceId)
  const switchSpace = useSpaceStore((s) => s.switchSpace)
  const addSpace = useSpaceStore((s) => s.addSpace)
  const setSettingsOpen = useUIStore((s) => s.setSettingsOpen)
  const collapsed = useUIStore((s) => s.sidebarCollapsed)

  return (
    <div className="flex h-full w-[44px] flex-col items-center border-r border-border-default bg-bg-base">
      {/* Drag region + window controls */}
      <div className="drag-region flex w-full flex-col items-center pt-2 pb-2 gap-1">
        {collapsed && <WindowControls compact />}
      </div>

      {/* Axle logo */}
      <button
        className="no-drag mb-3 flex h-8 w-8 items-center justify-center rounded-xl opacity-50 hover:opacity-80 transition-opacity"
        title="Axle"
      >
        <img src={axleLogo} alt="Axle" className="h-5 w-5" />
      </button>

      {/* Space icons */}
      <div className="flex flex-1 flex-col items-center gap-1.5 overflow-y-auto py-1">
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
          className="no-drag flex h-8 w-8 items-center justify-center rounded-xl text-fg-muted/40 hover:text-fg-muted hover:bg-bg-hover transition-all"
          title="New Space"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          >
            <line x1="7" y1="3" x2="7" y2="11" />
            <line x1="3" y1="7" x2="11" y2="7" />
          </svg>
        </button>
      </div>

      {/* Bottom: settings */}
      <div className="flex flex-col items-center gap-1 pb-3 no-drag">
        <button
          onClick={() => setSettingsOpen(true)}
          className="flex h-8 w-8 items-center justify-center rounded-xl text-fg-muted/50 hover:text-fg-secondary hover:bg-bg-hover transition-all"
          title="Settings"
        >
          <svg
            width="15"
            height="15"
            viewBox="0 0 15 15"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.1"
          >
            <circle cx="7.5" cy="7.5" r="2.5" />
            <path d="M7.5 1.5v1.5M7.5 12v1.5M1.5 7.5H3M12 7.5h1.5M3.2 3.2l1.06 1.06M10.74 10.74l1.06 1.06M3.2 11.8l1.06-1.06M10.74 4.26l1.06-1.06" />
          </svg>
        </button>
      </div>
    </div>
  )
}

import type { Space } from '@shared/types/spaces'

interface SpaceIconProps {
  space: Space
  isActive: boolean
  onClick: () => void
}

export function SpaceIcon({ space, isActive, onClick }: SpaceIconProps): JSX.Element {
  const favicons = space.favicons.filter(Boolean).slice(0, 4)

  return (
    <button
      onClick={onClick}
      className={`relative flex h-9 w-9 items-center justify-center rounded-xl overflow-hidden transition-all ${
        isActive ? 'bg-bg-elevated ring-[1.5px] ring-accent/40' : 'bg-bg-surface hover:bg-bg-hover'
      }`}
      title={space.name}
    >
      {favicons.length === 0 && (
        <span className={`text-sm font-semibold ${isActive ? 'text-fg-primary' : 'text-fg-muted'}`}>
          {space.name.charAt(0).toUpperCase()}
        </span>
      )}

      {favicons.length === 1 && <img src={favicons[0]} alt="" className="h-5 w-5 rounded" />}

      {favicons.length === 2 && (
        <div className="flex h-full w-full">
          <img src={favicons[0]} alt="" className="h-full w-1/2 object-cover" />
          <img src={favicons[1]} alt="" className="h-full w-1/2 object-cover" />
        </div>
      )}

      {favicons.length === 3 && (
        <div className="flex h-full w-full flex-col">
          <img src={favicons[0]} alt="" className="h-1/2 w-full object-cover" />
          <div className="flex h-1/2 w-full">
            <img src={favicons[1]} alt="" className="h-full w-1/2 object-cover" />
            <img src={favicons[2]} alt="" className="h-full w-1/2 object-cover" />
          </div>
        </div>
      )}

      {favicons.length >= 4 && (
        <div className="grid h-full w-full grid-cols-2 grid-rows-2">
          {favicons.slice(0, 4).map((f, i) => (
            <img key={i} src={f} alt="" className="h-full w-full object-cover" />
          ))}
        </div>
      )}

      {/* Active indicator */}
      {isActive && (
        <div className="absolute -left-[2px] top-1/2 -translate-y-1/2 h-4 w-[3px] rounded-r-full bg-accent" />
      )}
    </button>
  )
}

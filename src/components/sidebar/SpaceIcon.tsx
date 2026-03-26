import type { Space } from '@shared/types/spaces'

interface SpaceIconProps {
  space: Space
  isActive: boolean
  onClick: () => void
}

/**
 * Spotify-style favicon collage icon for a space.
 * 1 favicon = full icon
 * 2 favicons = split vertically
 * 3 favicons = one on top, two on bottom
 * 4 favicons = 2x2 grid
 * 0 favicons = first letter of space name
 */
export function SpaceIcon({ space, isActive, onClick }: SpaceIconProps): JSX.Element {
  const favicons = space.favicons.filter(Boolean).slice(0, 4)

  return (
    <button
      onClick={onClick}
      className={`no-drag relative flex h-8 w-8 items-center justify-center rounded-xl overflow-hidden transition-all ${
        isActive
          ? 'ring-1.5 ring-accent/60 bg-bg-elevated shadow-sm'
          : 'bg-bg-surface hover:bg-bg-hover'
      }`}
      title={space.name}
    >
      {favicons.length === 0 && (
        <span className={`text-[11px] font-semibold ${isActive ? 'text-accent' : 'text-fg-muted'}`}>
          {space.name.charAt(0).toUpperCase()}
        </span>
      )}

      {favicons.length === 1 && <img src={favicons[0]} alt="" className="h-4 w-4 rounded-sm" />}

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

      {/* Active indicator dot */}
      {isActive && (
        <div className="absolute -left-0.5 top-1/2 -translate-y-1/2 h-3 w-[3px] rounded-r-full bg-accent" />
      )}
    </button>
  )
}

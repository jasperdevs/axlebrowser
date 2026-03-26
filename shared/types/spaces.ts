export interface Space {
  id: string
  name: string
  /** Tab IDs belonging to this space */
  tabIds: string[]
  /** Accent color hue for the space (optional per-space tint) */
  colorHue?: number
  /** Favicon URLs of tabs in this space (for collage icon) */
  favicons: string[]
}

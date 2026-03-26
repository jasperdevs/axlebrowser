export interface TintConfig {
  /** Hue value 0-360 */
  hue: number;
  /** Intensity 0-100 (0 = pure monochrome) */
  intensity: number;
}

export type ThemeMode = "dark" | "light";

export interface ThemeState {
  mode: ThemeMode;
  tint: TintConfig;
}

/** Preset tint colors */
export const TINT_PRESETS: Record<string, TintConfig> = {
  none: { hue: 0, intensity: 0 },
  red: { hue: 0, intensity: 40 },
  orange: { hue: 30, intensity: 40 },
  green: { hue: 140, intensity: 40 },
  teal: { hue: 175, intensity: 40 },
  blue: { hue: 220, intensity: 40 },
  purple: { hue: 270, intensity: 40 },
  pink: { hue: 330, intensity: 40 },
};

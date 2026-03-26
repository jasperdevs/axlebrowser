import type { TintConfig, ThemeMode } from "@shared/types/theme";

/**
 * Apply a tint to the entire UI by computing tinted CSS custom property values
 * and setting them on :root.
 *
 * The tint system works by mixing a hue into the monochrome base palette.
 * Accent colors get the strongest tint, backgrounds get subtle shifts, text barely changes.
 */
export function applyTint(tint: TintConfig, mode: ThemeMode): void {
  const root = document.documentElement;
  const { hue, intensity } = tint;
  const t = intensity / 100; // 0-1

  if (mode === "dark") {
    root.style.setProperty("--bg-base", hsl(hue, t * 8, 4 + t * 2));
    root.style.setProperty("--bg-surface", hsl(hue, t * 8, 7 + t * 2));
    root.style.setProperty("--bg-elevated", hsl(hue, t * 8, 10 + t * 2));
    root.style.setProperty("--bg-hover", hsl(hue, t * 10, 14 + t * 2));
    root.style.setProperty("--bg-active", hsl(hue, t * 10, 17 + t * 2));
    root.style.setProperty("--border-default", hsl(hue, t * 8, 12 + t * 2));
    root.style.setProperty("--fg-primary", hsl(hue, t * 4, 90));
    root.style.setProperty("--fg-secondary", hsl(hue, t * 5, 55));
    root.style.setProperty("--fg-muted", hsl(hue, t * 5, 35));
    root.style.setProperty(
      "--accent",
      hsl(hue, Math.max(t * 80, 0), t > 0 ? 65 : 100),
    );
    root.style.setProperty(
      "--accent-hover",
      hsl(hue, Math.max(t * 80, 0), t > 0 ? 55 : 88),
    );
    root.style.setProperty("--accent-fg", hsl(hue, 0, t > 0 ? 5 : 0));
  } else {
    // Light mode
    root.style.setProperty("--bg-base", hsl(hue, t * 8, 96 - t * 2));
    root.style.setProperty("--bg-surface", hsl(hue, t * 8, 93 - t * 2));
    root.style.setProperty("--bg-elevated", hsl(hue, t * 6, 100));
    root.style.setProperty("--bg-hover", hsl(hue, t * 10, 91 - t * 2));
    root.style.setProperty("--bg-active", hsl(hue, t * 10, 87 - t * 2));
    root.style.setProperty("--border-default", hsl(hue, t * 8, 88 - t * 2));
    root.style.setProperty("--fg-primary", hsl(hue, t * 4, 10));
    root.style.setProperty("--fg-secondary", hsl(hue, t * 5, 40));
    root.style.setProperty("--fg-muted", hsl(hue, t * 5, 60));
    root.style.setProperty(
      "--accent",
      hsl(hue, Math.max(t * 80, 0), t > 0 ? 45 : 0),
    );
    root.style.setProperty(
      "--accent-hover",
      hsl(hue, Math.max(t * 80, 0), t > 0 ? 35 : 15),
    );
    root.style.setProperty("--accent-fg", hsl(hue, 0, t > 0 ? 98 : 100));
  }
}

function hsl(h: number, s: number, l: number): string {
  return `hsl(${Math.round(h)}, ${Math.round(s)}%, ${Math.round(l)}%)`;
}

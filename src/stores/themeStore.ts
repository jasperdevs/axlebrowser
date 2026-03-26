import { create } from "zustand";
import type { ThemeMode, TintConfig } from "@shared/types/theme";
import { applyTint } from "@/lib/tint";

interface ThemeStore {
  mode: ThemeMode;
  tint: TintConfig;

  setMode: (mode: ThemeMode) => void;
  setTint: (tint: TintConfig) => void;
  setTintHue: (hue: number) => void;
  setTintIntensity: (intensity: number) => void;
}

export const useThemeStore = create<ThemeStore>((set, get) => ({
  mode: "dark",
  tint: { hue: 0, intensity: 0 },

  setMode: (mode) => {
    const root = document.documentElement;
    root.classList.remove("dark", "light");
    root.classList.add(mode);
    set({ mode });
    // Re-apply tint for the new mode
    applyTint(get().tint, mode);
  },

  setTint: (tint) => {
    set({ tint });
    applyTint(tint, get().mode);
  },

  setTintHue: (hue) => {
    const tint = { ...get().tint, hue };
    set({ tint });
    applyTint(tint, get().mode);
  },

  setTintIntensity: (intensity) => {
    const tint = { ...get().tint, intensity };
    set({ tint });
    applyTint(tint, get().mode);
  },
}));

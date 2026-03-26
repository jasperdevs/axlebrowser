import { useThemeStore } from '@/stores/themeStore'
import { TINT_PRESETS } from '@shared/types/theme'

interface SettingsPanelProps {
  onClose: () => void
}

export function SettingsPanel({ onClose }: SettingsPanelProps): JSX.Element {
  const mode = useThemeStore((s) => s.mode)
  const tint = useThemeStore((s) => s.tint)
  const setMode = useThemeStore((s) => s.setMode)
  const setTintHue = useThemeStore((s) => s.setTintHue)
  const setTintIntensity = useThemeStore((s) => s.setTintIntensity)
  const setTint = useThemeStore((s) => s.setTint)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40" />

      <div
        className="relative z-10 w-full max-w-[420px] overflow-hidden rounded-2xl border border-border-default bg-bg-elevated shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border-default px-5 py-3">
          <h2 className="text-sm font-medium text-fg-primary">Settings</h2>
          <button
            onClick={onClose}
            className="flex h-6 w-6 items-center justify-center rounded-md text-fg-muted hover:bg-bg-hover hover:text-fg-primary transition-colors"
          >
            <svg
              width="10"
              height="10"
              viewBox="0 0 10 10"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            >
              <line x1="2" y1="2" x2="8" y2="8" />
              <line x1="8" y1="2" x2="2" y2="8" />
            </svg>
          </button>
        </div>

        <div className="max-h-[60vh] overflow-y-auto px-5 py-4 space-y-5">
          {/* Theme Mode */}
          <Section title="Theme">
            <div className="flex gap-2">
              <ToggleButton active={mode === 'dark'} onClick={() => setMode('dark')}>
                Dark
              </ToggleButton>
              <ToggleButton active={mode === 'light'} onClick={() => setMode('light')}>
                Light
              </ToggleButton>
            </div>
          </Section>

          {/* Tint Color */}
          <Section title="Tint Color">
            <div className="flex flex-wrap gap-2">
              {Object.entries(TINT_PRESETS).map(([name, config]) => (
                <button
                  key={name}
                  onClick={() => setTint(config)}
                  className={`flex h-8 items-center gap-1.5 rounded-lg px-3 text-[11px] transition-colors ${
                    tint.hue === config.hue && tint.intensity === config.intensity
                      ? 'bg-accent text-accent-fg'
                      : 'bg-bg-hover text-fg-secondary hover:bg-bg-active'
                  }`}
                >
                  {config.intensity > 0 && (
                    <div
                      className="h-3 w-3 rounded-full"
                      style={{ backgroundColor: `hsl(${config.hue}, 60%, 50%)` }}
                    />
                  )}
                  {name.charAt(0).toUpperCase() + name.slice(1)}
                </button>
              ))}
            </div>
          </Section>

          {/* Hue Slider */}
          <Section title={`Hue: ${Math.round(tint.hue)}°`}>
            <input
              type="range"
              min="0"
              max="360"
              value={tint.hue}
              onChange={(e) => setTintHue(Number(e.target.value))}
              className="w-full accent-accent h-1.5 rounded-full appearance-none bg-bg-active cursor-pointer"
              style={{
                background: `linear-gradient(to right, 
                  hsl(0,70%,50%), hsl(60,70%,50%), hsl(120,70%,50%), 
                  hsl(180,70%,50%), hsl(240,70%,50%), hsl(300,70%,50%), hsl(360,70%,50%))`
              }}
            />
          </Section>

          {/* Intensity Slider */}
          <Section title={`Intensity: ${Math.round(tint.intensity)}%`}>
            <input
              type="range"
              min="0"
              max="100"
              value={tint.intensity}
              onChange={(e) => setTintIntensity(Number(e.target.value))}
              className="w-full accent-accent h-1.5 rounded-full appearance-none bg-bg-active cursor-pointer"
            />
          </Section>

          {/* Search Engine */}
          <Section title="Default Search Engine">
            <select className="w-full rounded-lg bg-bg-hover border border-border-default px-3 py-2 text-xs text-fg-primary outline-none focus:border-accent">
              <option value="google">Google</option>
              <option value="duckduckgo">DuckDuckGo</option>
              <option value="bing">Bing</option>
              <option value="ecosia">Ecosia</option>
            </select>
          </Section>

          {/* About */}
          <Section title="About">
            <div className="text-[11px] text-fg-muted space-y-1">
              <p>Axle Browser v0.1.0</p>
              <p>Built with Electron + React + Tailwind</p>
              <p className="text-accent">axlebrowser.com</p>
            </div>
          </Section>
        </div>
      </div>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }): JSX.Element {
  return (
    <div>
      <label className="mb-2 block text-[11px] font-medium uppercase tracking-wider text-fg-muted">
        {title}
      </label>
      {children}
    </div>
  )
}

function ToggleButton({
  active,
  onClick,
  children
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}): JSX.Element {
  return (
    <button
      onClick={onClick}
      className={`rounded-lg px-4 py-1.5 text-xs transition-colors ${
        active ? 'bg-accent text-accent-fg' : 'bg-bg-hover text-fg-secondary hover:bg-bg-active'
      }`}
    >
      {children}
    </button>
  )
}

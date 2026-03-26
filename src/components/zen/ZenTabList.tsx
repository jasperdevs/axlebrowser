import { useTabStore } from '@/stores/tabStore'
import { useUIStore } from '@/stores/uiStore'
import { ZenTab } from './ZenTab'

export function ZenTabList(): JSX.Element {
  const tabs = useTabStore((s) => s.tabs)
  const collapsed = useUIStore((s) => s.sidebarCollapsed)

  return (
    <div
      className="no-drag flex flex-1 flex-col overflow-y-auto px-1 py-0.5"
      style={{ gap: 'var(--zen-tab-gap)' }}
    >
      {tabs.map((tab) => (
        <ZenTab key={tab.id} tab={tab} collapsed={collapsed} />
      ))}
    </div>
  )
}

import { useUIStore } from '@/stores/uiStore'
import { IconRail } from './IconRail'
import { TabPanel } from './TabPanel'

export function Sidebar(): JSX.Element {
  const collapsed = useUIStore((s) => s.sidebarCollapsed)

  return (
    <div className="flex h-full bg-bg-surface">
      {/* Icon rail -- always visible */}
      <IconRail />

      {/* Tab panel -- hidden when collapsed */}
      {!collapsed && <TabPanel />}
    </div>
  )
}

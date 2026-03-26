import { useUIStore } from '@/stores/uiStore'
import { IconRail } from './IconRail'
import { TabPanel } from './TabPanel'

export function Sidebar(): JSX.Element {
  const collapsed = useUIStore((s) => s.sidebarCollapsed)

  return (
    <div className="pointer-events-auto flex h-full shrink-0 bg-bg-base">
      <IconRail />
      {!collapsed && <TabPanel />}
    </div>
  )
}

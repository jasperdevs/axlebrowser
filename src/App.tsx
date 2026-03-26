import { useIpcSubscriptions } from '@/hooks/useIpc'
import { ZenSidebar } from '@/components/zen/ZenSidebar'
import { ZenUrlbar } from '@/components/zen/ZenUrlbar'
import { ZenWindowControls } from '@/components/zen/ZenWindowControls'
import { useUIStore } from '@/stores/uiStore'
import { useEffect } from 'react'

export default function App(): JSX.Element {
  useIpcSubscriptions()

  const urlbarOpen = useUIStore((s) => s.urlbarOpen)
  const closeUrlbar = useUIStore((s) => s.closeUrlbar)

  useEffect(() => {
    const handler = (e: KeyboardEvent): void => {
      if (e.key === 'Escape') closeUrlbar()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [closeUrlbar])

  return (
    <div className="flex h-screen w-screen">
      {/* Sidebar (left) */}
      <ZenSidebar />

      {/* Content area overlay - transparent, clicks pass through */}
      <div className="pointer-events-none relative flex-1">
        {/* Window controls top-right */}
        <div className="pointer-events-auto absolute right-3 top-2 z-10">
          <ZenWindowControls />
        </div>
      </div>

      {/* Floating URL bar */}
      {urlbarOpen && <ZenUrlbar />}
    </div>
  )
}

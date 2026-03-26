import { create } from 'zustand'

interface UIStore {
  sidebarCollapsed: boolean
  urlbarOpen: boolean
  urlbarQuery: string

  toggleSidebar: () => void
  setSidebarCollapsed: (collapsed: boolean) => void
  openUrlbar: (prefill?: string) => void
  closeUrlbar: () => void
  setUrlbarQuery: (q: string) => void
}

export const useUIStore = create<UIStore>((set) => ({
  sidebarCollapsed: false,
  urlbarOpen: false,
  urlbarQuery: '',

  toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
  setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
  openUrlbar: (prefill) => set({ urlbarOpen: true, urlbarQuery: prefill || '' }),
  closeUrlbar: () => set({ urlbarOpen: false, urlbarQuery: '' }),
  setUrlbarQuery: (q) => set({ urlbarQuery: q })
}))

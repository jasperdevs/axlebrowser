import { create } from 'zustand'
import type { Space } from '@shared/types/spaces'

interface SpaceStore {
  spaces: Space[]
  activeSpaceId: string

  addSpace: (name: string) => string
  removeSpace: (id: string) => void
  renameSpace: (id: string, name: string) => void
  switchSpace: (id: string) => void
  addTabToSpace: (spaceId: string, tabId: string) => void
  removeTabFromSpace: (spaceId: string, tabId: string) => void
  updateSpaceFavicons: (spaceId: string, favicons: string[]) => void
}

let nextId = 1
function genId(): string {
  return `space-${nextId++}`
}

const defaultSpaceId = 'space-default'

export const useSpaceStore = create<SpaceStore>((set, get) => ({
  spaces: [
    {
      id: defaultSpaceId,
      name: 'Home',
      tabIds: [],
      favicons: []
    }
  ],
  activeSpaceId: defaultSpaceId,

  addSpace: (name) => {
    const id = genId()
    set((s) => ({
      spaces: [...s.spaces, { id, name, tabIds: [], favicons: [] }]
    }))
    return id
  },

  removeSpace: (id) => {
    const state = get()
    if (state.spaces.length <= 1) return
    set((s) => ({
      spaces: s.spaces.filter((sp) => sp.id !== id),
      activeSpaceId: s.activeSpaceId === id ? s.spaces[0].id : s.activeSpaceId
    }))
  },

  renameSpace: (id, name) => {
    set((s) => ({
      spaces: s.spaces.map((sp) => (sp.id === id ? { ...sp, name } : sp))
    }))
  },

  switchSpace: (id) => {
    set({ activeSpaceId: id })
  },

  addTabToSpace: (spaceId, tabId) => {
    set((s) => ({
      spaces: s.spaces.map((sp) =>
        sp.id === spaceId ? { ...sp, tabIds: [...sp.tabIds.filter((t) => t !== tabId), tabId] } : sp
      )
    }))
  },

  removeTabFromSpace: (spaceId, tabId) => {
    set((s) => ({
      spaces: s.spaces.map((sp) =>
        sp.id === spaceId ? { ...sp, tabIds: sp.tabIds.filter((t) => t !== tabId) } : sp
      )
    }))
  },

  updateSpaceFavicons: (spaceId, favicons) => {
    set((s) => ({
      spaces: s.spaces.map((sp) =>
        sp.id === spaceId ? { ...sp, favicons: favicons.slice(0, 4) } : sp
      )
    }))
  }
}))

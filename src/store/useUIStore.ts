import { create } from 'zustand'

interface UIState {
  isSelectionDrawerOpen: boolean
  openSelectionDrawer: () => void
  closeSelectionDrawer: () => void
}

export const useUIStore = create<UIState>((set) => ({
  isSelectionDrawerOpen: false,
  openSelectionDrawer: () => set({ isSelectionDrawerOpen: true }),
  closeSelectionDrawer: () => set({ isSelectionDrawerOpen: false }),
}))
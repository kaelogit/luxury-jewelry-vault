import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface SelectionItem {
  id: string
  title: string      // Fixed: matches product.title
  price: number
  image: string      // Fixed: maps to image_url
  house: string      // Used for branding/display
  asset_class: string // Fixed: used for protocol filtering
}

interface SelectionState {
  items: SelectionItem[]
  addItem: (item: SelectionItem) => void
  removeItem: (id: string) => void
  clearVault: () => void
  getTotalPrice: () => number
}

export const useSelectionStore = create<SelectionState>()(
  persist(
    (set, get) => ({
      items: [],
      
      addItem: (item) => {
        const currentItems = get().items
        const isAlreadyInVault = currentItems.some((i) => i.id === item.id)
        
        if (!isAlreadyInVault) {
          set({ items: [...currentItems, item] })
        }
      },

      removeItem: (id) => {
        set({ items: get().items.filter((i) => i.id !== id) })
      },

      clearVault: () => set({ items: [] }),

      getTotalPrice: () => {
        return get().items.reduce((total, item) => total + Number(item.price), 0)
      }
    }),
    {
      name: 'lume-vault-selection-v4', // Updated version to force a clean cache
    }
  )
)
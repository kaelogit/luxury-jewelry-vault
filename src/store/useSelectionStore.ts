import { create } from 'zustand'
import { persist } from 'zustand/middleware'

/**
 * SELECTION ITEM INTERFACE
 * Aligned with the Master SQL Registry (products table)
 */
export interface SelectionItem {
  id: string
  name: string       // Standardized: matches product.name
  title?: string     // Alias for legacy support
  price: number
  image: string      // Maps to image_url
  category: string   // Standardized: matches product.category
  asset_class?: string // Alias for legacy protocol filtering
  slug: string       // Essential for routing from the vault back to product
  house?: string
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
          // Normalize the item before adding: ensure title/name and category/asset_class are synced
          const normalizedItem = {
            ...item,
            name: item.name || item.title || 'Unknown Asset',
            category: item.category || item.asset_class || 'Bespoke'
          }
          set({ items: [...currentItems, normalizedItem] })
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
      name: 'lume-vault-selection-v5', // Version bump to clear old incompatible local storage
    }
  )
)
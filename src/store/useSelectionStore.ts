import { create } from 'zustand'
import { persist } from 'zustand/middleware'

/**
 * SHOPPING BAG ITEM
 * Basic details for items kept in the user's selection.
 */
export interface SelectionItem {
  id: string
  name: string
  price: number
  image: string
  category: string
  slug: string
  house: string
  quantity: number
}

interface SelectionState {
  items: SelectionItem[]
  addItem: (item: Omit<SelectionItem, 'quantity'>) => void
  removeItem: (id: string) => void
  deleteItem: (id: string) => void
  clearBag: () => void 
  getTotalPrice: () => number
}

export const useSelectionStore = create<SelectionState>()(
  persist(
    (set, get) => ({
      items: [],
      
      /**
       * Add a product to the bag.
       * If it's already there, we just add one more to the count.
       */
      addItem: (item) => {
        const currentItems = get().items
        const exists = currentItems.find((i) => i.id === item.id)
        
        if (exists) {
          set({
            items: currentItems.map((i) =>
              i.id === item.id 
                ? { ...i, quantity: (i.quantity || 1) + 1 } 
                : i
            ),
          })
        } else {
          const newItem: SelectionItem = {
            ...item,
            price: Number(item.price),
            quantity: 1,
            house: item.house || 'Lume Vault',
          }
          set({ items: [...currentItems, newItem] })
        }
      },

      /**
       * Reduce the count of an item.
       * If only one is left, we remove it from the bag entirely.
       */
      removeItem: (id) => {
        const currentItems = get().items
        const target = currentItems.find((i) => i.id === id)

        if (target && target.quantity > 1) {
          set({
            items: currentItems.map((i) =>
              i.id === id ? { ...i, quantity: i.quantity - 1 } : i
            ),
          })
        } else {
          set({ items: currentItems.filter((i) => i.id !== id) })
        }
      },

      /**
       * Remove a product completely, no matter how many were added.
       */
      deleteItem: (id) => {
        set({ items: get().items.filter((i) => i.id !== id) })
      },

      /**
       * Empty the entire bag.
       */
      clearBag: () => set({ items: [] }),

      /**
       * Calculate the total price of everything in the bag.
       */
      getTotalPrice: () => {
        return get().items.reduce(
          (total, item) => total + Number(item.price) * (item.quantity || 1), 
          0
        )
      }
    }),
    {
      name: 'lume-vault-bag-storage',
    }
  )
)
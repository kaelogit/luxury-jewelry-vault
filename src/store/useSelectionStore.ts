import { create } from 'zustand'
import { persist } from 'zustand/middleware'

/**
 * SELECTION ITEM INTERFACE
 * Perfectly aligned with Lume Vault Production Standards and UI requirements.
 */
export interface SelectionItem {
  id: string
  name: string       // Matches products.name
  price: number      // Numeric value for calculations
  image: string      // Matches products.image_url
  category: string   // Matches products.category
  slug: string       // Required for routing back to product page
  house: string      // Displays 'Lume Vault' branding on UI
  quantity: number   // NEW: Tracks how many of this asset are selected
}

interface SelectionState {
  items: SelectionItem[]
  addItem: (item: Omit<SelectionItem, 'quantity'>) => void // Accepts item without quantity
  removeItem: (id: string) => void       // Decrements or removes item
  deleteItem: (id: string) => void       // Completely removes item regardless of quantity
  clearCart: () => void 
  getTotalPrice: () => number
}

export const useSelectionStore = create<SelectionState>()(
  persist(
    (set, get) => ({
      items: [],
      
      /**
       * Adds a piece to the selection
       * If it exists, increments quantity. If not, adds new with quantity 1.
       */
      addItem: (item) => {
        const currentItems = get().items
        const existingItem = currentItems.find((i) => i.id === item.id)
        
        if (existingItem) {
          // INCREMENT LOGIC: Map through and update quantity
          set({
            items: currentItems.map((i) =>
              i.id === item.id 
                ? { ...i, quantity: (i.quantity || 1) + 1 } 
                : i
            ),
          })
        } else {
          // NEW ASSET LOGIC: Normalize and set initial quantity to 1
          const normalizedItem: SelectionItem = {
            id: item.id,
            name: item.name,
            price: Number(item.price),
            image: item.image,
            category: item.category,
            slug: item.slug,
            house: item.house || 'Lume Vault',
            quantity: 1, // Start at 1
          }
          set({ items: [...currentItems, normalizedItem] })
        }
      },

      /**
       * Removes or Decrements an item
       * If quantity > 1, it reduces it. If 1, it removes the row.
       */
      removeItem: (id) => {
        const currentItems = get().items
        const existingItem = currentItems.find((i) => i.id === id)

        if (existingItem && existingItem.quantity > 1) {
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
       * Hard Delete
       * Purges the item row entirely regardless of quantity
       */
      deleteItem: (id) => {
        set({ items: get().items.filter((i) => i.id !== id) })
      },

      /**
       * Purges the selection after successful checkout
       */
      clearCart: () => set({ items: [] }),

      /**
       * Calculates total valuation
       * Logic: Price * Quantity
       */
      getTotalPrice: () => {
        return get().items.reduce(
          (total, item) => total + Number(item.price) * (item.quantity || 1), 
          0
        )
      }
    }),
    {
      name: 'lume-vault-registry-v3', // Version bumped to v3 for quantity support
    }
  )
)
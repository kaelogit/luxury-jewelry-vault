import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

interface IngressState {
  isBooted: boolean
  setBooted: (val: boolean) => void
}

export const useIngressStore = create<IngressState>()(
  persist(
    (set) => ({
      isBooted: false,
      setBooted: (val) => set({ isBooted: val }),
    }),
    {
      name: 'lume-ingress-status',
      storage: createJSONStorage(() => sessionStorage), // Keeps it to current tab session only
    }
  )
)
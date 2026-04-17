import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// Definindo a estrutura do item e do carrinho
export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface CartStore {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set) => ({
      items: [],
      addItem: (item) => set((state) => {
        const existing = state.items.find(i => i.id === item.id);
        if (existing) {
          return { items: state.items.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i) }
        }
        return { items: [...state.items, item] }
      }),
      removeItem: (id) => set((state) => ({
        items: state.items.filter((item) => item.id !== id)
      })),
      clearCart: () => set({ items: [] }),
    }),
    {
      name: 'code-tv-cart',
    }
  )
)
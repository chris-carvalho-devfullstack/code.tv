import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string; // Adicionado para exibir a foto no carrinho
}

interface CartStore {
  items: CartItem[];
  isOpen: boolean;
  toggleCart: () => void;
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  decreaseQuantity: (id: string) => void;
  clearCart: () => void;
  getTotal: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
      
      addItem: (item) => set((state) => {
        const existing = state.items.find(i => i.id === item.id);
        if (existing) {
          return { items: state.items.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i) }
        }
        return { items: [...state.items, { ...item, quantity: 1 }], isOpen: true } // Abre o carrinho ao adicionar
      }),

      decreaseQuantity: (id) => set((state) => {
        const existing = state.items.find(i => i.id === id);
        if (existing && existing.quantity > 1) {
          return { items: state.items.map(i => i.id === id ? { ...i, quantity: i.quantity - 1 } : i) }
        }
        return { items: state.items.filter((item) => item.id !== id) } // Remove se chegar a zero
      }),

      removeItem: (id) => set((state) => ({
        items: state.items.filter((item) => item.id !== id)
      })),
      
      clearCart: () => set({ items: [] }),
      
      getTotal: () => {
        return get().items.reduce((total, item) => total + (item.price * item.quantity), 0);
      }
    }),
    {
      name: 'code-tv-cart',
      partialize: (state) => ({ items: state.items }), // Persiste apenas os itens, não o estado de aberto/fechado
    }
  )
)
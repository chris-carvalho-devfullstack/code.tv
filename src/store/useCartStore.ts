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
  updateQuantity: (id: string, quantity: number) => void; // <--- NOVA FUNÇÃO
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
          // Se já existe, soma a quantidade enviada com a existente
          return { items: state.items.map(i => i.id === item.id ? { ...i, quantity: i.quantity + (item.quantity || 1) } : i) }
        }
        // Se não existe, adiciona com a quantidade inicial (ou 1) e abre o carrinho
        return { items: [...state.items, { ...item, quantity: item.quantity || 1 }], isOpen: true } 
      }),

      decreaseQuantity: (id) => set((state) => {
        const existing = state.items.find(i => i.id === id);
        if (existing && existing.quantity > 1) {
          return { items: state.items.map(i => i.id === id ? { ...i, quantity: i.quantity - 1 } : i) }
        }
        return { items: state.items.filter((item) => item.id !== id) } // Remove se chegar a zero
      }),

      // --- NOVA FUNÇÃO: Necessária para o botão + inteligente com verificação no servidor ---
      updateQuantity: (id, quantity) => set((state) => ({
        items: state.items.map((item) =>
          item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item
        ),
      })),

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
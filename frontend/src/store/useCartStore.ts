import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Product } from '@/types/product';
import { syncCartWithBackend } from '@/services/cart.service';

export interface CartItem extends Product {
  quantity: number;
}

interface CartStore {
  items: CartItem[];
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (product, quantity = 1) => {
        if (quantity < 1) return; // Disallow native additions dropping below zero logically
        
        set((state) => {
          const existingItem = state.items.find(item => item.id === product.id);
          const newItems = existingItem 
            ? state.items.map(item => item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item)
            : [...state.items, { ...product, quantity }];
          
          syncCartWithBackend(newItems);
          return { items: newItems };
        });
      },
      removeItem: (productId) => {
        set((state) => {
          const newItems = state.items.filter(item => item.id !== productId);
          syncCartWithBackend(newItems);
          return { items: newItems };
        });
      },
      updateQuantity: (productId, quantity) => {
        if (quantity < 1) return; // Strictly forbid negative logic
        set((state) => {
          const newItems = state.items.map(item => item.id === productId ? { ...item, quantity } : item);
          syncCartWithBackend(newItems);
          return { items: newItems };
        });
      },
      clearCart: () => {
        syncCartWithBackend([]);
        set({ items: [] });
      },
      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },
      getTotalPrice: () => {
        return get().items.reduce((total, item) => total + (item.price * item.quantity), 0);
      }
    }),
    {
      name: 'pravaahya-cart-state',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

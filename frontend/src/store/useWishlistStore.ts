import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Product } from '@/types/product';

interface WishlistStore {
  items: Product[];
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  toggleItem: (product: Product) => void;
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => void;
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (product) => {
        set((state) => {
          if (state.items.find(item => item.id === product.id)) return state;
          return { items: [...state.items, product] };
        });
      },
      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter(item => item.id !== productId)
        }));
      },
      toggleItem: (product) => {
        const exists = get().isInWishlist(product.id);
        if (exists) {
           get().removeItem(product.id);
        } else {
           get().addItem(product);
        }
      },
      isInWishlist: (productId) => {
        return !!get().items.find(item => item.id === productId);
      },
      clearWishlist: () => set({ items: [] }),
    }),
    {
      name: 'pravaahya-wishlist',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

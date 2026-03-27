import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Product } from '@/types/product';

interface RecentlyViewedStore {
  items: Product[];
  addItem: (product: Product) => void;
  clearItems: () => void;
}

export const useRecentlyViewedStore = create<RecentlyViewedStore>()(
  persist(
    (set) => ({
      items: [],
      addItem: (product) => {
        set((state) => {
          // Remove explicit collisions preventing duplicate mappings directly
          const filtered = state.items.filter((item) => item.id !== product.id);
          // Aggregate logic prepending onto stack and truncating bounds strictly
          return { items: [product, ...filtered].slice(0, 10) };
        });
      },
      clearItems: () => set({ items: [] }),
    }),
    {
      name: 'pravaahya-recently-viewed',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

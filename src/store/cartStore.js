import { create } from "zustand";
// 1. Import the 'persist' middleware
import { persist } from "zustand/middleware";

// 2. Wrap your store definition with the persist middleware
export const useCartStore = create(
  persist(
    (set) => ({
      // State
      items: [],

      // Actions (Your actions remain exactly the same)
      addItem: (product) =>
        set((state) => {
          const existingItem = state.items.find(
            (item) => item.id === product.id
          );
          if (existingItem) {
            return {
              items: state.items.map((item) =>
                item.id === product.id
                  ? { ...item, quantity: item.quantity + 1 }
                  : item
              ),
            };
          } else {
            return { items: [...state.items, { ...product, quantity: 1 }] };
          }
        }),

      removeItem: (productId) =>
        set((state) => ({
          items: state.items.filter((item) => item.id !== productId),
        })),

      increaseQuantity: (productId) =>
        set((state) => ({
          items: state.items.map((item) =>
            item.id === productId
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
        })),

      decreaseQuantity: (productId) =>
        set((state) => ({
          items: state.items.map((item) =>
            item.id === productId && item.quantity > 1
              ? { ...item, quantity: item.quantity - 1 }
              : item
          ),
        })),

      clearCart: () => set({ items: [] }),
    }),
    {
      // 3. Add a name for the storage key in localStorage
      name: "cart-storage",
    }
  )
);

"use client";

import { useEffect, useState } from "react";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CartItem, Product } from "@/types";

interface CartStore {
  items: CartItem[];
  addItem: (product: Product, size?: string) => void;
  removeItem: (cartId: string) => void;
  updateQuantity: (cartId: string, quantity: number) => void;
  clearCart: () => void;
  total: () => number;
  itemCount: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product: Product, size?: string) => {
        const cartId = `${product.id}#${size || ""}`;
        set((state) => {
          const items = state.items.map((item) => ({
            ...item,
            cartId: item.cartId || `${item.id}#${item.size || ""}`,
          }));
          const existing = items.find((item) => item.cartId === cartId);
          if (existing) {
            return {
              items: items.map((item) =>
                item.cartId === cartId
                  ? { ...item, quantity: item.quantity + 1 }
                  : item
              ),
            };
          }
          return { items: [...items, { ...product, quantity: 1, size, cartId }] };
        });
      },

      removeItem: (cartId: string) => {
        set((state) => ({
          items: state.items
            .map((item) => ({
              ...item,
              cartId: item.cartId || `${item.id}#${item.size || ""}`,
            }))
            .filter((item) => item.cartId !== cartId),
        }));
      },

      updateQuantity: (cartId: string, quantity: number) => {
        if (quantity <= 0) {
          get().removeItem(cartId);
          return;
        }
        set((state) => ({
          items: state.items.map((item) => {
            const itemWithId = {
              ...item,
              cartId: item.cartId || `${item.id}#${item.size || ""}`,
            };
            return itemWithId.cartId === cartId ? { ...itemWithId, quantity } : itemWithId;
          }),
        }));
      },

      clearCart: () => set({ items: [] }),

      total: () => {
        const { items } = get();
        return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
      },

      itemCount: () => {
        const { items } = get();
        return items.reduce((sum, item) => sum + item.quantity, 0);
      },
    }),
    {
      name: "vital-life-cart",
    }
  )
);

export function useClientCartCount(): number {
  const count = useCartStore((s) => s.itemCount());
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted ? count : 0;
}

export function useClientCart(): CartStore & { isReady: boolean } {
  const store = useCartStore();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return {
    ...store,
    items: mounted ? store.items : [],
    itemCount: () => (mounted ? store.itemCount() : 0),
    total: () => (mounted ? store.total() : 0),
    isReady: mounted,
  };
}

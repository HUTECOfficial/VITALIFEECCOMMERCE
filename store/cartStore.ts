"use client";

import { useEffect, useState } from "react";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CartItem, Product } from "@/types";

interface CartStore {
  items: CartItem[];
  addItem: (product: Product, size?: string, color?: string, quantity?: number) => void;
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

      addItem: (product: Product, size?: string, color?: string, quantity = 1) => {
        const cartId = `${product.id}#${size || ""}#${color || ""}`;
        const quantityToAdd = Math.max(1, Math.floor(quantity));
        set((state) => {
          const items = state.items.map((item) => ({
            ...item,
            cartId: `${item.id}#${item.size || ""}#${item.color || ""}`,
          }));
          const existing = items.find((item) => item.cartId === cartId);
          if (existing) {
            return {
              items: items.map((item) =>
                item.cartId === cartId
                  ? { ...item, quantity: item.quantity + quantityToAdd }
                  : item
              ),
            };
          }
          return { items: [...items, { ...product, quantity: quantityToAdd, size, color, cartId }] };
        });
      },

      removeItem: (cartId: string) => {
        set((state) => ({
          items: state.items
            .map((item) => ({
              ...item,
              cartId: `${item.id}#${item.size || ""}#${item.color || ""}`,
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
              cartId: `${item.id}#${item.size || ""}#${item.color || ""}`,
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

"use client";

import { useSyncExternalStore } from "react";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CartItem, Product } from "@/types";

function availableStock(product: Product, size?: string, color?: string) {
  const variant = product.variants?.find(
    (option) => option.size === (size || "") && option.color === (color || "")
  );
  const stock = variant?.stockQuantity ?? product.stockQuantity;
  return typeof stock === "number" && Number.isFinite(stock) ? Math.max(1, Math.floor(stock)) : undefined;
}

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
        const max = availableStock(product, size, color);
        const quantityToAdd = Math.min(Math.max(1, Math.floor(quantity)), max ?? Number.MAX_SAFE_INTEGER);
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
                  ? { ...item, quantity: Math.min(item.quantity + quantityToAdd, max ?? Number.MAX_SAFE_INTEGER) }
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
        if (!Number.isFinite(quantity)) return;
        const normalizedQuantity = Math.floor(quantity);
        if (normalizedQuantity <= 0) {
          get().removeItem(cartId);
          return;
        }
        set((state) => ({
          items: state.items.map((item) => {
            const itemWithId = {
              ...item,
              cartId: `${item.id}#${item.size || ""}#${item.color || ""}`,
            };
            const max = availableStock(itemWithId, itemWithId.size, itemWithId.color);
            return itemWithId.cartId === cartId
              ? { ...itemWithId, quantity: Math.min(normalizedQuantity, max ?? Number.MAX_SAFE_INTEGER) }
              : itemWithId;
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

const subscribeToHydration = () => () => undefined;

function useHydrated() {
  return useSyncExternalStore(subscribeToHydration, () => true, () => false);
}

export function useClientCartCount(): number {
  const count = useCartStore((s) => s.itemCount());
  return useHydrated() ? count : 0;
}

export function useClientCart(): CartStore & { isReady: boolean } {
  const store = useCartStore();
  const isReady = useHydrated();
  return {
    ...store,
    items: isReady ? store.items : [],
    itemCount: () => (isReady ? store.itemCount() : 0),
    total: () => (isReady ? store.total() : 0),
    isReady,
  };
}

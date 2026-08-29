"use client";

import type { MouseEvent, ReactNode } from "react";
import { useCartStore } from "@/store/cartStore";
import type { CartItem, Product } from "@/types";
import { getQuoteWhatsAppUrl } from "@/lib/whatsapp";

interface QuoteWhatsAppLinkProps {
  product: Product;
  size?: string | null;
  color?: string | null;
  className?: string;
  children: ReactNode;
}

function getCartId(product: Product, size?: string | null, color?: string | null) {
  return `${product.id}#${size || ""}#${color || ""}`;
}

export function QuoteWhatsAppLink({
  product,
  size,
  color,
  className,
  children,
}: QuoteWhatsAppLinkProps) {
  const cartItems = useCartStore((state) => state.items);
  const addItem = useCartStore((state) => state.addItem);
  const cartId = getCartId(product, size, color);
  const currentItem = cartItems.find((item) => item.cartId === cartId);
  const itemsToQuote: CartItem[] = currentItem
    ? cartItems.map((item) => item.cartId === cartId ? { ...item, quantity: item.quantity + 1 } : item)
    : [...cartItems, { ...product, quantity: 1, size: size || undefined, color: color || undefined, cartId }];

  const handleQuote = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();

    addItem(product, size || undefined, color || undefined, 1);
    window.open(getQuoteWhatsAppUrl(itemsToQuote), "_blank", "noopener,noreferrer");
  };

  return (
    <a
      href={getQuoteWhatsAppUrl(itemsToQuote)}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleQuote}
      className={className}
    >
      {children}
    </a>
  );
}

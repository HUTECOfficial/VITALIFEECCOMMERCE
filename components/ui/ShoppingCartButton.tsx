"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, Check, Minus, Plus } from "lucide-react";
import Link from "next/link";
import { useCartStore } from "@/store/cartStore";
import { Product } from "@/types";
import { cn } from "@/lib/utils";
import { StockIndicator } from "@/components/ui/StockIndicator";
import { getVariantStock } from "@/lib/product-variants";

export function ShoppingCartButton({ product, showStock = true, showQuantity = false }: { product: Product; showStock?: boolean; showQuantity?: boolean }) {
  const addItem = useCartStore((s) => s.addItem);
  const [addedQuantity, setAddedQuantity] = useState<number | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (addedQuantity === null) return;
    const timeoutId = window.setTimeout(() => setAddedQuantity(null), 1600);
    return () => window.clearTimeout(timeoutId);
  }, [addedQuantity]);

  const handleAdd = () => {
    if (hasUnselectedVariant || unavailable) return;
    addItem(product, selectedSize || undefined, selectedColor || undefined, quantity);
    setAddedQuantity(quantity);
  };

  const selectSize = (size: string) => {
    setSelectedSize(size);
    setQuantity(1);
  };

  const selectColor = (color: string) => {
    setSelectedColor(color);
    setQuantity(1);
  };

  const hasUnselectedVariant = Boolean((product.sizes?.length && !selectedSize) || (product.colors?.length && !selectedColor));
  const selectedVariantStock = hasUnselectedVariant ? undefined : getVariantStock(product, selectedSize, selectedColor);
  const unavailable = !hasUnselectedVariant && (!product.inStock || selectedVariantStock === 0 || (Boolean(product.variants?.length) && selectedVariantStock === undefined));
  const canIncreaseQuantity = !hasUnselectedVariant && !unavailable && (selectedVariantStock === undefined || quantity < selectedVariantStock);

  if (product.quoteOnly) {
    return (
      <div className="space-y-2">
        {product.colors?.length ? <OptionSelector label="Color" options={product.colors} selected={selectedColor} onSelect={selectColor} /> : null}
        {product.sizes?.length ? <OptionSelector label="Talla / medida" options={product.sizes} selected={selectedSize} onSelect={selectSize} /> : null}
        <Link
          href={`/contacto?producto=${encodeURIComponent(product.name)}${selectedSize ? `&talla=${encodeURIComponent(selectedSize)}` : ""}${selectedColor ? `&color=${encodeURIComponent(selectedColor)}` : ""}`}
          className="w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl font-bold transition-colors shadow-md min-h-12 bg-[#1a3a6b] text-white hover:bg-[#2eb8d4]"
        >
          <ShoppingCart className="w-4 h-4" /> Cotizar
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {product.colors?.length ? <OptionSelector label="Color" options={product.colors} selected={selectedColor} onSelect={selectColor} /> : null}
      {product.sizes?.length ? <OptionSelector label="Talla / medida" options={product.sizes} selected={selectedSize} onSelect={selectSize} /> : null}
      {showStock && !hasUnselectedVariant && <StockIndicator quantity={unavailable ? 0 : selectedVariantStock} inStock={product.inStock} compact />}
      {showQuantity && (
        <div className="flex items-center justify-between gap-4 rounded-xl border border-[#1a3a6b]/10 bg-white/70 p-2 pl-3">
          <span className="text-xs font-black uppercase tracking-wide text-[#1a3a6b]/60">Cantidad</span>
          <div className="flex items-center rounded-lg border border-gray-200 bg-white p-1 shadow-sm">
            <button
              type="button"
              onClick={() => setQuantity((current) => Math.max(1, current - 1))}
              disabled={quantity === 1}
              className="flex h-8 w-8 items-center justify-center rounded-md text-[#1a3a6b] transition-colors hover:bg-[#e8f4fd] disabled:cursor-not-allowed disabled:text-gray-300 disabled:hover:bg-transparent"
              aria-label="Reducir cantidad"
            >
              <Minus className="h-4 w-4" />
            </button>
            <span className="w-10 text-center text-base font-black text-[#1a3a6b]" aria-live="polite">
              {quantity}
            </span>
            <button
              type="button"
              onClick={() => setQuantity((current) => current + 1)}
              disabled={!canIncreaseQuantity}
              className="flex h-8 w-8 items-center justify-center rounded-md text-[#1a3a6b] transition-colors hover:bg-[#e8f4fd] disabled:cursor-not-allowed disabled:text-gray-300 disabled:hover:bg-transparent"
              aria-label="Aumentar cantidad"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
      <motion.button
        type="button"
        onClick={handleAdd}
        whileTap={{ scale: 0.98 }}
        disabled={hasUnselectedVariant || unavailable}
        className={cn(
          "w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl font-bold transition-colors shadow-md min-h-12",
          hasUnselectedVariant || unavailable
            ? "bg-gray-300 text-white cursor-not-allowed"
            : "bg-[#1a3a6b] text-white hover:bg-[#2eb8d4]"
        )}
        aria-label={showQuantity ? `Agregar ${quantity} ${quantity === 1 ? "unidad" : "unidades"} de ${product.name} al carrito` : `Comprar ${product.name}`}
      >
        <AnimatePresence mode="wait">
          {addedQuantity !== null ? (
            <motion.span
              key="check"
              className="flex items-center gap-2"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
            >
              <Check className="w-4 h-4" /> {addedQuantity === 1 ? "Agregado" : `${addedQuantity} agregados`}
            </motion.span>
          ) : unavailable ? (
            <motion.span key="unavailable" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>Agotado</motion.span>
          ) : (
            <motion.span
              key="cart"
              className="flex items-center gap-2"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
            >
              <ShoppingCart className="w-4 h-4" /> {showQuantity ? "Agregar al carrito" : "Comprar"}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
}

function OptionSelector({ label, options, selected, onSelect }: { label: string; options: string[]; selected: string | null; onSelect: (option: string) => void }) {
  return (
    <div>
      <p className="mb-1 text-[10px] font-black uppercase tracking-wide text-[#1a3a6b]/60">{label}</p>
      <div className="flex flex-wrap gap-1.5">
        {options.map((option) => (
          <button key={option} type="button" onClick={() => onSelect(option)} className={cn("text-[10px] font-bold px-2.5 py-1.5 rounded-lg border transition-all", selected === option ? "bg-[#1a3a6b] text-white border-[#1a3a6b]" : "bg-white text-[#1a3a6b] border-gray-200 hover:border-[#1a3a6b]")}>{option}</button>
        ))}
      </div>
    </div>
  );
}

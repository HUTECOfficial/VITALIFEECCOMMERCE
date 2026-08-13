"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, Check } from "lucide-react";
import Link from "next/link";
import { useCartStore } from "@/store/cartStore";
import { Product } from "@/types";
import { cn } from "@/lib/utils";
import { StockIndicator } from "@/components/ui/StockIndicator";
import { getVariantStock } from "@/lib/product-variants";

export function ShoppingCartButton({ product, showStock = true }: { product: Product; showStock?: boolean }) {
  const addItem = useCartStore((s) => s.addItem);
  const [added, setAdded] = useState(false);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);

  useEffect(() => {
    if (!added) return;
    const timeoutId = window.setTimeout(() => setAdded(false), 1600);
    return () => window.clearTimeout(timeoutId);
  }, [added]);

  const handleAdd = () => {
    if (hasUnselectedVariant || selectedVariantStock === 0) return;
    addItem(product, selectedSize || undefined, selectedColor || undefined);
    setAdded(true);
  };

  const hasUnselectedVariant = Boolean((product.sizes?.length && !selectedSize) || (product.colors?.length && !selectedColor));
  const selectedVariantStock = hasUnselectedVariant ? undefined : getVariantStock(product, selectedSize, selectedColor);
  const unavailable = !hasUnselectedVariant && (selectedVariantStock === 0 || (Boolean(product.variants?.length) && selectedVariantStock === undefined));

  if (product.quoteOnly) {
    return (
      <div className="space-y-2">
        {product.colors?.length ? <OptionSelector label="Color" options={product.colors} selected={selectedColor} onSelect={setSelectedColor} /> : null}
        {product.sizes?.length ? <OptionSelector label="Talla / medida" options={product.sizes} selected={selectedSize} onSelect={setSelectedSize} /> : null}
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
      {product.colors?.length ? <OptionSelector label="Color" options={product.colors} selected={selectedColor} onSelect={setSelectedColor} /> : null}
      {product.sizes?.length ? <OptionSelector label="Talla / medida" options={product.sizes} selected={selectedSize} onSelect={setSelectedSize} /> : null}
      {showStock && !hasUnselectedVariant && <StockIndicator quantity={unavailable ? 0 : selectedVariantStock} inStock={product.inStock} compact />}
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
        aria-label={`Comprar ${product.name}`}
      >
        <AnimatePresence mode="wait">
          {added ? (
            <motion.span
              key="check"
              className="flex items-center gap-2"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
            >
              <Check className="w-4 h-4" /> Agregado
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
              <ShoppingCart className="w-4 h-4" /> Comprar
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

"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import IntrinsicImage from "@/components/ui/IntrinsicImage";
import { ShoppingCart, Eye } from "lucide-react";
import Link from "next/link";
import { Product } from "@/types";
import { useCartStore } from "@/store/cartStore";
import { formatPrice } from "@/lib/utils";
import { categoryLabels } from "@/data/products";
import { cn } from "@/lib/utils";
import { StockIndicator } from "@/components/ui/StockIndicator";
import { getProductNameParts } from "@/lib/product-name";
import { getVariantStock } from "@/lib/product-variants";
import { QuoteWhatsAppLink } from "@/components/ui/QuoteWhatsAppLink";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore((s) => s.addItem);
  const [added, setAdded] = useState(false);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const productName = getProductNameParts(product.name);
  const presentation = product.presentation || productName.presentation;
  const hasUnselectedVariant = Boolean((product.sizes?.length && !selectedSize) || (product.colors?.length && !selectedColor));
  const selectedVariantStock = hasUnselectedVariant ? undefined : getVariantStock(product, selectedSize, selectedColor);
  const unavailable = !hasUnselectedVariant && (selectedVariantStock === 0 || (Boolean(product.variants?.length) && selectedVariantStock === undefined));

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    if (hasUnselectedVariant || unavailable) return;
    addItem(product, selectedSize || undefined, selectedColor || undefined);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <motion.div
      className="group overflow-hidden rounded-3xl bg-white shadow-[0_10px_30px_rgba(26,58,107,0.1)]"
      whileHover={{ y: -6, boxShadow: "0 20px 40px rgba(26,58,107,0.15)" }}
      transition={{ duration: 0.2 }}
    >
      <Link href={`/productos/${product.slug}`} className="block">
        <IntrinsicImage
          src={product.image}
          alt={product.name}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          fixedAspectRatio={16 / 9}
          className="object-contain transition-transform duration-300"
        >
          {/* Overlay */}
          <div className="absolute inset-0 bg-[#1a3a6b]/0 group-hover:bg-[#1a3a6b]/40 transition-all duration-300 flex items-center justify-center">
            <motion.div
              className="flex items-center gap-2 text-white text-sm font-medium bg-white/20 backdrop-blur px-4 py-2 rounded-full"
              initial={{ opacity: 0, scale: 0.8 }}
              whileHover={{ scale: 1 }}
              animate={{ opacity: 0 }}
              whileInView={{ opacity: 0 }}
            >
              <Eye className="w-4 h-4" />
              Ver detalles
            </motion.div>
          </div>

          {/* Category badge */}
          <div className="absolute top-3 left-3">
            <span className="bg-white/90 backdrop-blur text-[#1a3a6b] text-[10px] font-semibold px-2.5 py-1 rounded-full">
              {categoryLabels[product.category]}
            </span>
          </div>
        </IntrinsicImage>
      </Link>

      <div className="p-4">
        <Link href={`/productos/${product.slug}`}>
          <h3 className="font-semibold text-[#1a3a6b] text-sm leading-tight hover:text-[#2eb8d4] transition-colors line-clamp-2">
            {productName.title}
          </h3>
        </Link>
        {product.brand && (
          <p className="mt-1 text-[10px] font-black uppercase tracking-wide text-[#1a3a6b]/50">{product.brand}</p>
        )}
        {presentation && (
          <p className="mt-1 mb-2 text-[11px] font-bold text-[#1a3a6b]/60">
            <span className="mr-1 uppercase tracking-wide text-[#2eb8d4]">Presentación</span>
            {presentation}
          </p>
        )}
        <p className="text-gray-500 text-xs leading-relaxed mb-3 line-clamp-2">
          {product.description}
        </p>
        <div className="mb-3">
          <StockIndicator quantity={unavailable ? 0 : selectedVariantStock} inStock={product.inStock} compact />
        </div>
        {product.colors?.length && (
          <div className="mb-3">
            <p className="mb-1 text-[10px] font-black uppercase tracking-wide text-[#1a3a6b]/60">Color</p>
            <div className="flex flex-wrap gap-1.5">
              {product.colors.map((color) => (
                <button key={color} onClick={(e) => { e.preventDefault(); setSelectedColor(color); }} className={cn("text-[10px] font-bold px-2 py-1 rounded-lg border transition-all", selectedColor === color ? "bg-[#1a3a6b] text-white border-[#1a3a6b]" : "bg-white text-[#1a3a6b] border-gray-200 hover:border-[#1a3a6b]")}>{color}</button>
              ))}
            </div>
          </div>
        )}
        {product.sizes?.length && (
          <div className="mb-3">
            <p className="mb-1 text-[10px] font-black uppercase tracking-wide text-[#1a3a6b]/60">Talla / medida</p>
            <div className="flex flex-wrap gap-1.5">
            {product.sizes.map((size) => (
              <button
                key={size}
                onClick={(e) => {
                  e.preventDefault();
                  setSelectedSize(size);
                }}
                className={cn(
                  "text-[10px] font-bold px-2 py-1 rounded-lg border transition-all",
                  selectedSize === size
                    ? "bg-[#1a3a6b] text-white border-[#1a3a6b]"
                    : "bg-white text-[#1a3a6b] border-gray-200 hover:border-[#1a3a6b]"
                )}
              >
                {size}
              </button>
            ))}
            </div>
          </div>
        )}
        <div className={cn("flex items-center justify-between", product.quoteOnly && "justify-end")}>
          {!product.quoteOnly && (
            <span className="font-bold text-[#1a3a6b] text-lg">{formatPrice(product.price)}</span>
          )}
          {product.quoteOnly ? (
            <QuoteWhatsAppLink
              product={product}
              size={selectedSize}
              color={selectedColor}
              className="text-xs font-medium px-3 py-2 rounded-full bg-[#1a3a6b] text-white hover:bg-[#2eb8d4] transition-colors"
            >
              Cotizar
            </QuoteWhatsAppLink>
          ) : (
          <AnimatePresence mode="wait">
            {added ? (
              <motion.span
                key="added"
                className="text-[#2eb8d4] text-xs font-medium"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
              >
                ✓ Agregado
              </motion.span>
            ) : (
              <motion.button
                key="btn"
                onClick={handleAddToCart}
                disabled={hasUnselectedVariant || unavailable}
                className={cn(
                  "flex items-center gap-1.5 text-xs font-medium px-3 py-2 rounded-full transition-colors",
                  hasUnselectedVariant || unavailable
                    ? "bg-gray-300 text-white cursor-not-allowed"
                    : "bg-[#1a3a6b] text-white hover:bg-[#2eb8d4]"
                )}
                whileTap={{ scale: 0.92 }}
                aria-label={`Agregar ${product.name} al carrito`}
              >
                <ShoppingCart className="w-3.5 h-3.5" />
                {unavailable ? "Agotado" : "Agregar"}
              </motion.button>
            )}
          </AnimatePresence>
          )}
        </div>
      </div>
    </motion.div>
  );
}

"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ChevronDown, ShoppingCart, ArrowRight } from "lucide-react";
import type { Brand } from "@/data/brands";
import type { Product } from "@/types";
import { formatPrice } from "@/lib/utils";
import { categoryLabels } from "@/data/products";
import { ShoppingCartButton } from "@/components/ui/ShoppingCartButton";
import { StockIndicator } from "@/components/ui/StockIndicator";
import { brandCategoryToProductCategories } from "@/data/catalogCategories";

interface Props {
  brand: Brand;
  total: number;
}

export default function BrandDetailClient({ brand, total }: Props) {
  const [openFamily, setOpenFamily] = useState<string | null>(brand.families[0]?.name ?? null);
  const [allProducts, setAllProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetch("/api/products", { cache: "no-store" })
      .then((res) => res.json())
      .then((data: Product[]) => setAllProducts(data || []))
      .catch(() => setAllProducts([]));
  }, []);

  const brandProducts = useMemo(() => {
    const productCategories = brandCategoryToProductCategories[brand.category];
    return allProducts.filter((product) => productCategories.includes(product.category));
  }, [allProducts, brand.category]);

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Blobs */}
      <div className="ambient-blob w-[500px] h-[500px] top-[-100px] left-[-150px] bg-[rgba(46,184,212,0.18)]" />
      <div className="ambient-blob w-[400px] h-[400px] top-[200px] right-[-100px] bg-[rgba(26,58,107,0.12)]" />

      {/* ── HERO ── */}
      <section className="relative pt-10 pb-12">
        <div className="mesh-dots absolute inset-0 z-0 opacity-60" />
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6">
          {/* Back */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <Link
              href="/insumos"
              className="inline-flex items-center gap-2 text-[#1a3a6b]/60 hover:text-[#1a3a6b] text-sm font-semibold mb-8 transition-colors"
            >
              ← Volver al catálogo
            </Link>
          </motion.div>


          <div className="flex flex-col sm:flex-row items-start gap-8">
            {/* Brand badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              className={`flex-shrink-0 w-28 h-28 rounded-3xl bg-gradient-to-br ${brand.gradient} flex items-center justify-center shadow-2xl relative overflow-hidden`}
            >
              <div className="absolute inset-0 bg-white/10" />
              <span className="relative z-10 text-white font-black text-2xl text-center leading-tight px-2">
                {brand.name.split(" ")[0].slice(0, 4)}
              </span>
            </motion.div>

            <div className="flex-1 min-w-0">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2 glass-card px-4 py-1.5 mb-3"
              >
                <span className="text-xs font-bold text-[#2eb8d4] uppercase tracking-wide">{brand.category}</span>
              </motion.div>
              <motion.h1
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-4xl sm:text-5xl font-black text-[#1a3a6b] leading-tight mb-3"
              >
                {brand.name}
              </motion.h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.15 }}
                className="text-[#1a3a6b]/65 text-lg max-w-2xl"
              >
                {brand.description}
              </motion.p>

              {/* Stats */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="flex flex-wrap gap-3 mt-5"
              >
                <div className="glass-card px-4 py-2 flex items-center gap-2">
                  <span className="text-2xl font-black text-[#1a3a6b]">{total}</span>
                  <span className="text-sm text-[#1a3a6b]/60 font-medium">productos</span>
                </div>
                <div className="glass-card px-4 py-2 flex items-center gap-2">
                  <span className="text-2xl font-black text-[#1a3a6b]">{brand.families.length}</span>
                  <span className="text-sm text-[#1a3a6b]/60 font-medium">líneas</span>
                </div>
                <Link
                  href={`/insumos?q=${encodeURIComponent(brand.name)}`}
                  className="glass-card px-5 py-2 flex items-center gap-2 bg-[#1a3a6b]/10 border border-[#1a3a6b]/30 text-[#1a3a6b] font-bold text-sm hover:bg-[#1a3a6b]/20 transition-colors"
                >
                  <ShoppingCart className="w-4 h-4" /> Ver en catálogo
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* ── PRODUCT FAMILIES ── */}
      <section className="relative z-10 pb-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-4">
          {brand.families.map((family, fi) => {
            const isOpen = openFamily === family.name;
            return (
              <motion.div
                key={family.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: fi * 0.06 }}
                className="glass-card overflow-hidden"
              >
                {/* Family header */}
                <button
                  onClick={() => setOpenFamily(isOpen ? null : family.name)}
                  className="w-full flex items-center justify-between gap-4 p-5 text-left group"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <div className={`w-10 h-10 rounded-2xl bg-gradient-to-br ${brand.gradient} flex items-center justify-center flex-shrink-0`}>
                      <span className="text-white text-xs font-black">{String(fi + 1).padStart(2, "0")}</span>
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-base font-bold text-[#1a3a6b] truncate group-hover:text-[#2eb8d4] transition-colors">
                        {family.name}
                      </h3>
                      <p className="text-sm text-[#1a3a6b]/55 line-clamp-1">{family.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span className="text-xs font-bold text-[#2eb8d4] bg-[#2eb8d4]/10 px-2.5 py-1 rounded-full">
                      {family.items.length} productos
                    </span>
                    <motion.span
                      animate={{ rotate: isOpen ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                      className="text-[#1a3a6b]/40 group-hover:text-[#2eb8d4] transition-colors"
                    >
                      <ChevronDown className="w-5 h-5" />
                    </motion.span>
                  </div>
                </button>

                {/* Items */}
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="overflow-hidden border-t border-[#1a3a6b]/08"
                    >
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-[#1a3a6b]/06 p-4">
                        {family.items.map((item, idx) => (
                          <motion.div
                            key={idx}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.03 }}
                            className="flex items-center justify-between gap-3 bg-white/60 backdrop-blur-sm rounded-xl px-4 py-3 group hover:bg-[#2eb8d4]/08 transition-colors"
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#2eb8d4] flex-shrink-0" />
                              <span className="text-sm text-[#1a3a6b]/85 font-medium truncate">{item}</span>
                            </div>
                            <Link
                              href={`/insumos?q=${encodeURIComponent(item)}`}
                              className="flex-shrink-0 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-all text-xs font-bold text-[#1a3a6b] bg-[#1a3a6b]/10 hover:bg-[#1a3a6b]/20 px-3 py-1.5 rounded-lg"
                            >
                              Ver en catálogo
                            </Link>
                          </motion.div>
                        ))}
                      </div>

                      {/* Family CTA */}
                      <div className="p-4 pt-0">
                        <Link
                          href={`/insumos?q=${encodeURIComponent(family.name)}`}
                          className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-[#1a3a6b]/10 border border-[#1a3a6b]/25 text-[#1a3a6b] font-bold text-sm hover:bg-[#1a3a6b]/20 transition-colors"
                        >
                          Ver productos en el catálogo
                        </Link>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

        {/* ── ACTUAL PRODUCTS GRID ── */}
        {brandProducts.length > 0 && (
          <section className="relative z-10 pb-20">
            <div className="max-w-6xl mx-auto px-4 sm:px-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-[#2eb8d4] font-bold text-xs uppercase tracking-[0.2em] mb-1">Productos disponibles</p>
                  <h2 className="text-2xl font-black text-[#1a3a6b]">Compra directa de {brand.name}</h2>
                </div>
                <span className="text-sm font-bold text-[#1a3a6b]/50">{brandProducts.length} productos</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                {brandProducts.map((product, i) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 14 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.04 }}
                    className="rounded-2xl border border-[#1a3a6b]/10 bg-white p-4 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all"
                  >
                    <Link href={`/productos/${product.slug}`} className="block relative h-40 rounded-xl overflow-hidden bg-[#eef7fd] mb-4">
                      <Image src={product.image} alt={product.name} fill className="object-contain p-3" sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" />
                    </Link>
                    <p className="text-[11px] uppercase tracking-wide font-bold text-[#2eb8d4] mb-1">{categoryLabels[product.category]}</p>
                    <Link href={`/productos/${product.slug}`}>
                      <h3 className="font-black text-[#1a3a6b] text-base leading-tight mb-1 line-clamp-2 hover:text-[#2eb8d4] transition-colors">{product.name}</h3>
                    </Link>
                    <p className="text-xs text-[#1a3a6b]/60 line-clamp-2 min-h-9 mb-3">{product.description}</p>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[#1a3a6b] font-black text-lg">{product.quoteOnly ? "Cotizar" : formatPrice(product.price)}</span>
                      <StockIndicator quantity={product.stockQuantity} inStock={product.inStock} compact />
                    </div>
                    <div className="flex gap-2">
                      <ShoppingCartButton product={product} />
                      <Link
                        href={`/productos/${product.slug}`}
                        className="inline-flex items-center justify-center text-xs font-bold text-[#1a3a6b] border border-[#1a3a6b]/20 rounded-xl px-3 py-2 hover:bg-[#e8f4fd] transition-colors shrink-0"
                      >
                        Ver detalle
                      </Link>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Final CTA */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 mt-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="liquid-glass p-8 sm:p-10 text-center"
          >
            <h2 className="text-3xl font-black text-[#1a3a6b] mb-2">
              Agrega {brand.name} a tu carrito
            </h2>
            <p className="text-[#1a3a6b]/60 mb-6">
              Todos los productos disponibles en nuestro catálogo con compra directa.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href={`/insumos?q=${encodeURIComponent(brand.name)}`}
                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl bg-[#1a3a6b] text-white font-bold shadow-xl shadow-[#1a3a6b]/30 hover:bg-[#2eb8d4] hover:scale-[1.02] transition-all"
              >
                <ShoppingCart className="w-5 h-5" /> Ver catálogo
              </Link>
              <Link
                href="/carrito"
                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl glass-card text-[#1a3a6b] font-bold border border-[#1a3a6b]/15 hover:shadow-md transition-all"
              >
                Ver carrito <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

"use client";

import { useState } from "react";
import type { Product } from "@/types";
import { ProductImageZoom } from "@/components/ui/ProductImageZoom";
import { ShoppingCartButton } from "@/components/ui/ShoppingCartButton";
import { getVariantImage } from "@/lib/product-variants";
import { formatPrice } from "@/lib/utils";
import { categoryLabels } from "@/data/products";
import { getProductNameParts } from "@/lib/product-name";

export function ProductDetailClient({ product, galleryImages }: { product: Product; galleryImages?: string[] }) {
  const [selection, setSelection] = useState<{ size: string | null; color: string | null }>({ size: null, color: null });
  const selectedImage = getVariantImage(product, selection.size, selection.color) || product.image;

  return (
    <>
      <ProductImageZoom key={selectedImage} src={selectedImage} images={galleryImages} alt={product.name} />
      <div className="flex flex-col justify-center">
        <ProductDetails product={product} onVariantChange={setSelection} />
      </div>
    </>
  );
}

function ProductDetails({ product, onVariantChange }: { product: Product; onVariantChange: (selection: { size: string | null; color: string | null }) => void }) {
  const productName = getProductNameParts(product.name, product.brand);
  const brand = product.brand || productName.brand;
  const specifications = [...productName.details];

  if (product.presentation && !specifications.some((detail) => detail.value.toLocaleLowerCase("es-MX") === product.presentation?.toLocaleLowerCase("es-MX"))) {
    specifications.unshift({ label: "Presentación", value: product.presentation });
  }

  return (
    <>
      <span className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-[#2eb8d4]">{categoryLabels[product.category]}</span>
      <h1 className="mb-2 text-3xl font-black leading-tight text-[#1a3a6b] sm:text-4xl">{productName.title}</h1>
      {brand && <p className="mb-5 text-sm font-bold text-[#1a3a6b]/65"><span className="mr-1.5 uppercase tracking-wide text-[#2eb8d4]">Marca:</span>{brand}</p>}

      {specifications.length > 0 && (
        <dl className="mb-6 grid grid-cols-2 gap-2.5 sm:grid-cols-3">
          {specifications.map((detail, index) => (
            <div key={`${detail.label}-${detail.value}-${index}`} className="rounded-2xl border border-[#2eb8d4]/20 bg-gradient-to-br from-white to-[#e8f4fd] px-3.5 py-3 shadow-[0_6px_18px_rgba(26,58,107,0.06)]">
              <dt className="text-[10px] font-black uppercase tracking-[0.12em] text-[#2eb8d4]">{detail.label}</dt>
              <dd className="mt-1 text-sm font-extrabold leading-snug text-[#1a3a6b]">{detail.value}</dd>
            </div>
          ))}
        </dl>
      )}

      <div className="mb-6 rounded-2xl border border-[#1a3a6b]/10 bg-white/70 p-4 shadow-[0_8px_24px_rgba(26,58,107,0.05)]">
        <h2 className="mb-1.5 text-xs font-black uppercase tracking-[0.14em] text-[#2eb8d4]">Descripción del producto</h2>
        <p className="leading-relaxed text-[#1a3a6b]/70">{product.description}</p>
      </div>
      {!product.quoteOnly && <div className="mb-6"><span className="block text-3xl font-black text-[#1a3a6b]">{formatPrice(product.price)}</span></div>}
      <div className="w-full max-w-xs"><ShoppingCartButton product={product} showQuantity onVariantChange={onVariantChange} /></div>
    </>
  );
}

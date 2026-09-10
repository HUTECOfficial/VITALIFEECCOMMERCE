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
      <ProductImageZoom src={selectedImage} images={galleryImages} alt={product.name} />
      <div className="flex flex-col justify-center">
        <ProductDetails product={product} onVariantChange={setSelection} />
      </div>
    </>
  );
}

function ProductDetails({ product, onVariantChange }: { product: Product; onVariantChange: (selection: { size: string | null; color: string | null }) => void }) {
  const productName = getProductNameParts(product.name);

  return (
    <>
      <span className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-[#2eb8d4]">{categoryLabels[product.category]}</span>
      <h1 className="mb-2 text-4xl font-black text-[#1a3a6b]">{productName.title}</h1>
      {product.brand && <p className="mb-3 text-sm font-bold text-[#1a3a6b]/60"><span className="mr-1.5 uppercase tracking-wide text-[#2eb8d4]">Marca:</span>{product.brand}</p>}
      {(product.presentation || productName.presentation) && <p className="mb-4 inline-flex w-fit rounded-full bg-[#e8f4fd] px-3 py-1 text-sm font-bold text-[#1a3a6b]"><span className="mr-1.5 text-[#2eb8d4]">Presentación:</span>{product.presentation || productName.presentation}</p>}
      <p className="mb-6 text-[#1a3a6b]/65">{product.description}</p>
      {!product.quoteOnly && <div className="mb-6"><span className="block text-3xl font-black text-[#1a3a6b]">{formatPrice(product.price)}</span></div>}
      <div className="w-full max-w-xs"><ShoppingCartButton product={product} showQuantity onVariantChange={onVariantChange} /></div>
    </>
  );
}

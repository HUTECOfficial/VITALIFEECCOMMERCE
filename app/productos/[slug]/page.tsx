import { notFound } from "next/navigation";
import { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getProductBySlug } from "@/lib/data";
import { formatPrice } from "@/lib/utils";
import { categoryLabels } from "@/data/products";
import { ShoppingCartButton } from "@/components/ui/ShoppingCartButton";
import { ProductImageZoom } from "@/components/ui/ProductImageZoom";
import { productGalleryImages } from "@/data/productGallery";
import { getProductNameParts } from "@/lib/product-name";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Producto no encontrado | Vital Life" };
  return {
    title: `${product.name} | Vital Life`,
    description: product.description,
  };
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();
  const productName = getProductNameParts(product.name);

  return (
    <div className="min-h-screen pt-24 pb-16 hero-gradient">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          href="/insumos"
          className="inline-flex items-center gap-2 text-[#1a3a6b]/60 hover:text-[#1a3a6b] text-sm font-semibold mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Volver al catálogo
        </Link>

        <div className="grid md:grid-cols-2 gap-8">
          <ProductImageZoom
            src={product.image}
            images={productGalleryImages[product.slug]}
            alt={product.name}
          />

          <div className="flex flex-col justify-center">
            <span className="text-[#2eb8d4] font-bold text-xs uppercase tracking-[0.2em] mb-2">
              {categoryLabels[product.category]}
            </span>
            <h1 className="text-4xl font-black text-[#1a3a6b] mb-2">{productName.title}</h1>
            {product.brand && (
              <p className="mb-3 text-sm font-bold text-[#1a3a6b]/60">
                <span className="mr-1.5 uppercase tracking-wide text-[#2eb8d4]">Marca:</span>
                {product.brand}
              </p>
            )}
            {(product.presentation || productName.presentation) && (
              <p className="mb-4 inline-flex w-fit rounded-full bg-[#e8f4fd] px-3 py-1 text-sm font-bold text-[#1a3a6b]">
                <span className="mr-1.5 text-[#2eb8d4]">Presentación:</span>
                {product.presentation || productName.presentation}
              </p>
            )}
            <p className="text-[#1a3a6b]/65 mb-6">{product.description}</p>
            {!product.quoteOnly && (
              <div className="mb-6">
                <span className="block text-3xl font-black text-[#1a3a6b]">{formatPrice(product.price)}</span>
              </div>
            )}
            <div className="w-full max-w-xs">
              <ShoppingCartButton product={product} showQuantity />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

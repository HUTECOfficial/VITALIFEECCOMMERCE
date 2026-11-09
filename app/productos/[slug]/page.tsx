import { notFound } from "next/navigation";
import { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getProductBySlug } from "@/lib/data";
import { getProductNameParts } from "@/lib/product-name";
import { ProductDetailClient } from "@/components/ui/ProductDetailClient";
import { productGalleryImages } from "@/data/productGallery";
import JsonLd from "@/components/seo/JsonLd";
import { productDescription, productJsonLd } from "@/lib/seo";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Producto no encontrado", robots: { index: false } };
  const productName = getProductNameParts(product.name, product.brand);
  const title = [productName.title, productName.brand].filter(Boolean).join(" ");
  const description = productDescription(product);
  const path = `/productos/${product.slug}`;
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title: `${title} | Vital Life Insumos Médicos`,
      description,
      url: path,
      images: product.image ? [{ url: product.image, alt: product.name }] : undefined,
    },
  };
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();
  return (
    <div className="min-h-screen pt-24 pb-16 hero-gradient">
      <JsonLd data={productJsonLd(product)} />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          href="/insumos"
          className="inline-flex items-center gap-2 text-[#1a3a6b]/60 hover:text-[#1a3a6b] text-sm font-semibold mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Volver al catálogo
        </Link>

        <div className="grid md:grid-cols-2 gap-8">
          <ProductDetailClient product={product} galleryImages={productGalleryImages[product.slug]} />
        </div>
      </div>
    </div>
  );
}

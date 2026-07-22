import { notFound } from "next/navigation";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getProductBySlug } from "@/lib/data";
import { formatPrice } from "@/lib/utils";
import { ShoppingCartButton } from "@/components/ui/ShoppingCartButton";

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
          <div className="relative h-80 md:h-96 rounded-3xl overflow-hidden bg-white shadow-lg">
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
          </div>

          <div className="flex flex-col justify-center">
            <span className="text-[#2eb8d4] font-bold text-xs uppercase tracking-[0.2em] mb-2">
              {product.category}
            </span>
            <h1 className="text-4xl font-black text-[#1a3a6b] mb-4">{product.name}</h1>
            <p className="text-[#1a3a6b]/65 mb-6">{product.description}</p>
            <div className="flex items-center gap-3 mb-6">
              <span className="text-3xl font-black text-[#1a3a6b]">{product.quoteOnly ? "Cotización disponible" : formatPrice(product.price)}</span>
              <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">
                {product.inStock ? "Disponible" : "Agotado"}
              </span>
            </div>
            <div className="w-full max-w-xs">
              <ShoppingCartButton product={product} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

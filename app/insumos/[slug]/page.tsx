import { notFound } from "next/navigation";
import { Metadata } from "next";
import Link from "next/link";
import { brands, getBrandById, getTotalProducts } from "@/data/brands";
import BrandDetailClient from "./BrandDetailClient";
import { truncate } from "@/lib/seo";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return brands.map((b) => ({ slug: b.id }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const brand = getBrandById(slug);
  if (!brand) return { title: "Marca no encontrada", robots: { index: false } };
  const description = truncate(`Productos ${brand.name} en Vital Life: ${brand.description} Venta de insumos médicos en León, Guanajuato con envío a todo México.`);
  return {
    title: `${brand.name}: insumos médicos y material de curación`,
    description,
    alternates: { canonical: `/insumos/${brand.id}` },
    openGraph: { title: `${brand.name} | Vital Life Insumos Médicos`, description, url: `/insumos/${brand.id}` },
  };
}

export default async function BrandPage({ params }: PageProps) {
  const { slug } = await params;
  const brand = getBrandById(slug);
  if (!brand) notFound();

  const total = getTotalProducts(brand);

  return <BrandDetailClient brand={brand} total={total} />;
}

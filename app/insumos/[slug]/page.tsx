import { notFound } from "next/navigation";
import { Metadata } from "next";
import Link from "next/link";
import { brands, getBrandById, getTotalProducts } from "@/data/brands";
import BrandDetailClient from "./BrandDetailClient";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return brands.map((b) => ({ slug: b.id }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const brand = getBrandById(slug);
  if (!brand) return { title: "Marca no encontrada | Vital Life" };
  return {
    title: `${brand.name} — Insumos Médicos | Vital Life`,
    description: brand.description,
  };
}

export default async function BrandPage({ params }: PageProps) {
  const { slug } = await params;
  const brand = getBrandById(slug);
  if (!brand) notFound();

  const total = getTotalProducts(brand);

  return <BrandDetailClient brand={brand} total={total} />;
}

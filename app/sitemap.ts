import type { MetadataRoute } from "next";
import { brands } from "@/data/brands";
import { nursingServices } from "@/data/nursingServices";
import { getProducts } from "@/lib/data";
import { absoluteUrl } from "@/lib/seo";

// Se regenera cada hora para incluir los productos que se agreguen desde el CMS.
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await getProducts();

  return [
    { url: absoluteUrl("/"), changeFrequency: "weekly", priority: 1 },
    { url: absoluteUrl("/insumos"), changeFrequency: "daily", priority: 0.9 },
    { url: absoluteUrl("/enfermeria"), changeFrequency: "monthly", priority: 0.8 },
    { url: absoluteUrl("/contacto"), changeFrequency: "yearly", priority: 0.6 },
    { url: absoluteUrl("/nosotros"), changeFrequency: "yearly", priority: 0.5 },
    ...nursingServices.map(({ slug }) => ({
      url: absoluteUrl(`/enfermeria/servicios/${slug}`),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    ...brands.map((brand) => ({
      url: absoluteUrl(`/insumos/${brand.id}`),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
    ...products.map((product) => ({
      url: absoluteUrl(`/productos/${product.slug}`),
      changeFrequency: "weekly" as const,
      priority: product.inStock ? 0.6 : 0.4,
      images: product.image ? [absoluteUrl(product.image)] : undefined,
    })),
  ];
}

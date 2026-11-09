// Datos del negocio y utilidades de SEO compartidas (metadatos, sitemap y JSON-LD).
import type { Product } from "@/types";
import { categoryLabels } from "@/data/products";

export const SITE_URL = "https://www.vitalifemx.store";
export const SITE_NAME = "Vital Life Insumos Médicos";

export const BUSINESS = {
  name: SITE_NAME,
  legalName: "Vital Life Servicios Integrales",
  email: "serviciovitalife@outlook.com",
  phones: ["+52 477 850 0011", "+52 479 228 4057", "+52 477 703 1953"],
  city: "León",
  region: "Guanajuato",
  country: "MX",
  logo: "/vitalife-logo.png",
  sameAs: [
    "https://www.facebook.com/vitallifeenfermeria/",
    "https://www.instagram.com/vital_life_insumosmedicos/",
  ],
};

export function absoluteUrl(path: string) {
  return new URL(path, SITE_URL).toString();
}

/** Serializa JSON-LD escapando "<" para que no se pueda cerrar el <script>. */
export function serializeJsonLd(data: unknown) {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

export function truncate(text: string, max = 158) {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  return `${clean.slice(0, max - 1).replace(/\s+\S*$/, "")}…`;
}

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["MedicalBusiness", "Store"],
        "@id": `${SITE_URL}/#organization`,
        name: BUSINESS.name,
        legalName: BUSINESS.legalName,
        url: SITE_URL,
        logo: absoluteUrl(BUSINESS.logo),
        image: absoluteUrl(BUSINESS.logo),
        email: BUSINESS.email,
        telephone: BUSINESS.phones[0],
        description:
          "Tienda de insumos médicos, material de curación y equipo médico en León, Guanajuato, con envíos a todo México. También ofrece enfermería domiciliaria y fisioterapia.",
        address: {
          "@type": "PostalAddress",
          addressLocality: BUSINESS.city,
          addressRegion: BUSINESS.region,
          addressCountry: BUSINESS.country,
        },
        areaServed: { "@type": "Country", name: "México" },
        priceRange: "$$",
        currenciesAccepted: "MXN",
        paymentAccepted: "Tarjeta de crédito, tarjeta de débito",
        contactPoint: BUSINESS.phones.slice(0, 2).map((telephone) => ({
          "@type": "ContactPoint",
          telephone,
          contactType: "sales",
          areaServed: "MX",
          availableLanguage: "es",
        })),
        sameAs: BUSINESS.sameAs,
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: SITE_URL,
        name: SITE_NAME,
        inLanguage: "es-MX",
        publisher: { "@id": `${SITE_URL}/#organization` },
      },
    ],
  };
}

export function productDescription(product: Product) {
  const brand = product.brand ? ` ${product.brand}` : "";
  const category = categoryLabels[product.category];
  const action = product.quoteOnly ? "Cotiza" : "Compra en línea";
  return truncate(`${product.name}${brand} · ${category}. ${action} en Vital Life, insumos médicos en León, Guanajuato con envío a todo México. ${product.description}`);
}

export function productJsonLd(product: Product) {
  const url = absoluteUrl(`/productos/${product.slug}`);
  const breadcrumb = {
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Inicio", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Insumos médicos", item: absoluteUrl("/insumos") },
      { "@type": "ListItem", position: 3, name: product.name, item: url },
    ],
  };

  // Google solo acepta la ficha de producto con precio; los de "solo cotización" llevan únicamente la ruta de navegación.
  if (product.quoteOnly || !(product.price > 0)) {
    return { "@context": "https://schema.org", ...breadcrumb };
  }

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Product",
        "@id": `${url}#product`,
        name: product.name,
        description: truncate(product.description || product.name, 500),
        image: product.image ? [absoluteUrl(product.image)] : undefined,
        sku: product.slug,
        category: categoryLabels[product.category],
        brand: product.brand ? { "@type": "Brand", name: product.brand } : undefined,
        url,
        offers: {
          "@type": "Offer",
          url,
          price: product.price.toFixed(2),
          priceCurrency: "MXN",
          availability: product.inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
          itemCondition: "https://schema.org/NewCondition",
          seller: { "@id": `${SITE_URL}/#organization` },
        },
      },
      breadcrumb,
    ],
  };
}

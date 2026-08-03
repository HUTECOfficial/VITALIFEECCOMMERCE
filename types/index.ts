export const productCategories = [
  "guantes",
  "curacion",
  "antisepticos",
  "jeringas",
  "terapia-iv",
  "sondas-cateteres",
  "respiratorio",
  "diagnostico",
  "quirurgico",
  "rehabilitacion",
  "medicamentos",
  "proteccion-desechables",
  "residuos",
  "atencion-paciente",
] as const;

export type ProductCategory = (typeof productCategories)[number];

export interface Product {
  id: string;
  name: string;
  slug: string;
  category: ProductCategory;
  price: number;
  description: string;
  image: string;
  inStock: boolean;
  stockQuantity?: number;
  featured?: boolean;
  sizes?: string[];
  colors?: string[];
  quoteOnly?: boolean;
  brand?: string;
}

export interface CartItem extends Product {
  quantity: number;
  size?: string;
  color?: string;
  cartId: string;
}

export interface Service {
  id: string;
  title: string;
  slug: string;
  description: string;
  features: string[];
  icon: string;
  href: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  content: string;
  rating: number;
}

// ============ Brand catalog types ============

export interface BrandProduct {
  name: string;
  variants?: string[];
}

export interface BrandFamily {
  name: string;
  description: string;
  items: string[];
}

export interface Brand {
  id: string;
  name: string;
  description: string;
  category: string;
  gradient: string;
  families: BrandFamily[];
}

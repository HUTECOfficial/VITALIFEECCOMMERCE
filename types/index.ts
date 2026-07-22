export interface Product {
  id: string;
  name: string;
  slug: string;
  category: "vendas" | "guantes" | "jeringas" | "medicamentos" | "curacion" | "equipo";
  price: number;
  description: string;
  image: string;
  inStock: boolean;
  featured?: boolean;
  sizes?: string[];
  quoteOnly?: boolean;
}

export interface CartItem extends Product {
  quantity: number;
  size?: string;
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

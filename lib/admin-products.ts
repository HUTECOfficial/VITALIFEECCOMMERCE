import { createServerClient } from "@/lib/supabase/server";
import type { Product } from "@/types";
import { productVariantsToStorage, readProductVariants } from "@/lib/product-variants";

export type ProductMetrics = {
  unitsSold: number;
  revenue: number;
};

export type AdminDashboardData = {
  products: Product[];
  metricsByProductId: Record<string, ProductMetrics>;
  totalRevenue: number;
  totalUnitsSold: number;
};

type ProductRow = {
  id: string;
  name: string;
  slug: string;
  category: Product["category"];
  price: number | null;
  description: string | null;
  image: string | null;
  in_stock: boolean | null;
  stock_quantity: number | null;
  featured: boolean | null;
  sizes: unknown;
  quote_only: boolean | null;
};

function mapProduct(row: ProductRow): Product {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    category: row.category,
    price: Number(row.price ?? 0),
    description: row.description ?? "",
    image: row.image ?? "",
    inStock: row.in_stock ?? false,
    stockQuantity: row.stock_quantity ?? 0,
    featured: row.featured ?? false,
    ...readProductVariants(row.sizes),
    quoteOnly: row.quote_only ?? false,
  };
}

export function productToRow(product: Product) {
  return {
    name: product.name,
    slug: product.slug,
    category: product.category,
    price: product.price,
    description: product.description,
    image: product.image,
    in_stock: product.inStock,
    stock_quantity: product.stockQuantity ?? 0,
    featured: product.featured ?? false,
    sizes: productVariantsToStorage(product),
    quote_only: product.quoteOnly ?? false,
  };
}

export async function getAdminDashboardData(): Promise<AdminDashboardData> {
  const supabase = createServerClient();
  const { data: rawProducts, error: productsError } = await supabase
    .from("products")
    .select("id,name,slug,category,price,description,image,in_stock,stock_quantity,featured,sizes,quote_only")
    .order("name", { ascending: true });

  if (productsError) throw new Error("No se pudo cargar el catálogo. Aplica la migración 003_product_stock_quantity.sql.");

  const products = ((rawProducts ?? []) as ProductRow[]).map(mapProduct);
  const metricsByProductId: Record<string, ProductMetrics> = Object.fromEntries(
    products.map((product) => [product.id, { unitsSold: 0, revenue: 0 }])
  );

  const { data: paidOrders, error: ordersError } = await supabase
    .from("orders")
    .select("id")
    .eq("status", "paid");
  if (ordersError) throw new Error("No se pudieron cargar las ventas.");

  const orderIds = (paidOrders ?? []).map((order) => order.id as string);
  if (orderIds.length === 0) {
    return { products, metricsByProductId, totalRevenue: 0, totalUnitsSold: 0 };
  }

  const { data: items, error: itemsError } = await supabase
    .from("order_items")
    .select("product_id,price,quantity")
    .in("order_id", orderIds);
  if (itemsError) throw new Error("No se pudieron calcular las ventas por producto.");

  let totalRevenue = 0;
  let totalUnitsSold = 0;
  for (const item of items ?? []) {
    const productId = item.product_id as string | null;
    const quantity = Number(item.quantity ?? 0);
    const revenue = Number(item.price ?? 0) * quantity;
    totalUnitsSold += quantity;
    totalRevenue += revenue;
    if (productId && metricsByProductId[productId]) {
      metricsByProductId[productId].unitsSold += quantity;
      metricsByProductId[productId].revenue += revenue;
    }
  }

  return { products, metricsByProductId, totalRevenue, totalUnitsSold };
}

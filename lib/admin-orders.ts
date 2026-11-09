import { createServerClient } from "@/lib/supabase/server";

export type OrderStatus = "pending" | "paid" | "payment_failed" | "refunded" | "expired";

export type AdminOrderItem = {
  name: string;
  price: number;
  quantity: number;
  size: string | null;
  color: string | null;
};

export type AdminOrder = {
  id: string;
  createdAt: string;
  paidAt: string | null;
  status: string;
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
  colonia: string;
  city: string;
  state: string | null;
  cp: string;
  subtotal: number;
  iva: number;
  total: number;
  shippingCarrier: string | null;
  shippingService: string | null;
  shippingDescription: string | null;
  shippingCost: number;
  trackingNumber: string | null;
  trackingUrl: string | null;
  labelUrl: string | null;
  labelCost: number | null;
  labelCreatedAt: string | null;
  items: AdminOrderItem[];
};

type OrderRow = Record<string, unknown> & { order_items?: Record<string, unknown>[] | null };

function str(value: unknown) {
  return typeof value === "string" ? value : "";
}

function nullableStr(value: unknown) {
  return typeof value === "string" && value ? value : null;
}

export function mapOrder(row: OrderRow): AdminOrder {
  return {
    id: str(row.id),
    createdAt: str(row.created_at),
    paidAt: nullableStr(row.paid_at),
    status: str(row.status) || "pending",
    firstName: str(row.first_name),
    lastName: str(row.last_name),
    phone: str(row.phone),
    address: str(row.address),
    colonia: str(row.colonia),
    city: str(row.city),
    state: nullableStr(row.state),
    cp: str(row.cp),
    subtotal: Number(row.subtotal ?? 0),
    iva: Number(row.iva ?? 0),
    total: Number(row.total ?? 0),
    shippingCarrier: nullableStr(row.shipping_carrier),
    shippingService: nullableStr(row.shipping_service),
    shippingDescription: nullableStr(row.shipping_description),
    shippingCost: Number(row.shipping_cost ?? 0),
    trackingNumber: nullableStr(row.tracking_number),
    trackingUrl: nullableStr(row.tracking_url),
    labelUrl: nullableStr(row.shipping_label_url),
    labelCost: row.shipping_label_cost === null || row.shipping_label_cost === undefined ? null : Number(row.shipping_label_cost),
    labelCreatedAt: nullableStr(row.shipping_label_created_at),
    items: (row.order_items ?? []).map((item) => ({
      name: str(item.name),
      price: Number(item.price ?? 0),
      quantity: Number(item.quantity ?? 0),
      size: nullableStr(item.size),
      color: nullableStr(item.color),
    })),
  };
}

export const ORDER_SELECT = "*, order_items(name,price,quantity,size,color)";

export async function getAdminOrders(limit = 300): Promise<{ orders: AdminOrder[]; error?: string }> {
  const { data, error } = await createServerClient()
    .from("orders")
    .select(ORDER_SELECT)
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) return { orders: [], error: "No se pudieron cargar los pedidos." };
  return { orders: ((data ?? []) as OrderRow[]).map(mapOrder) };
}

export async function getAdminOrder(id: string): Promise<AdminOrder | null> {
  const { data, error } = await createServerClient().from("orders").select(ORDER_SELECT).eq("id", id).maybeSingle();
  if (error || !data) return null;
  return mapOrder(data as OrderRow);
}

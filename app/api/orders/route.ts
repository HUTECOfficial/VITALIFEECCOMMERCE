import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";

interface OrderItem {
  productId?: string;
  name: string;
  price: number;
  quantity: number;
  size?: string;
  color?: string;
}

interface OrderPayload {
  firstName: string;
  lastName: string;
  address: string;
  colonia: string;
  city: string;
  cp: string;
  phone: string;
  subtotal: number;
  iva: number;
  total: number;
  items: OrderItem[];
}

export async function POST(request: NextRequest) {
  try {
    const body: OrderPayload = await request.json();

    const supabase = createServerClient();
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        first_name: body.firstName,
        last_name: body.lastName,
        address: body.address,
        colonia: body.colonia,
        city: body.city,
        cp: body.cp,
        phone: body.phone,
        subtotal: body.subtotal,
        iva: body.iva,
        total: body.total,
      })
      .select("id")
      .single();

    if (orderError || !order) {
      return NextResponse.json(
        { error: "No se pudo crear el pedido" },
        { status: 500 }
      );
    }

    const orderItems = body.items.map((item) => ({
      order_id: order.id,
      product_id: item.productId || null,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      size: item.size || null,
      color: item.color || null,
    }));

    const { error: itemsError } = await supabase
      .from("order_items")
      .insert(orderItems);

    if (itemsError) {
      return NextResponse.json(
        { error: "No se pudieron guardar los productos del pedido" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, orderId: order.id });
  } catch (err) {
    return NextResponse.json(
      { error: "Error procesando el pedido" },
      { status: 500 }
    );
  }
}

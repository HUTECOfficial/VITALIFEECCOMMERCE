import type { CartItem } from "@/types";

export const INSUMOS_WHATSAPP_NUMBER = "524778500011";

export function getQuoteWhatsAppUrl(items: CartItem[]) {
  const lines = items.map((item, index) => {
    const options = [
      item.size && `Talla/medida: ${item.size}`,
      item.color && `Color: ${item.color}`,
    ].filter(Boolean);

    return [
      `${index + 1}. ${item.name}`,
      `Cantidad: ${item.quantity}`,
      ...options,
    ].join(" · ");
  });

  const message = [
    "Hola, quiero cotizar los siguientes insumos médicos:",
    ...lines,
    "Quedo atento(a) a su cotización. ¡Gracias!",
  ].join("\n");

  return `https://wa.me/${INSUMOS_WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

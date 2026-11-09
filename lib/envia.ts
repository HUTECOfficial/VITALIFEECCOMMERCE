// Integración con Envia.com: cotización, generación y cancelación de guías (solo servidor).
import "server-only";
import { createServerClient } from "@/lib/supabase/server";
import {
  getDefaultShippingSettings,
  mergeShippingSettings,
  type ShippingAddress,
  type ShippingPackage,
  type ShippingSettings,
} from "@/lib/shipping-settings";

const ENVIA_API_URL = process.env.ENVIA_ENV === "production" ? "https://api.envia.com" : "https://api-test.envia.com";
const ENVIA_GEOCODES_URL = "https://geocodes.envia.com";

export interface ShippingDestination {
  cp: string;
  city?: string;
  colonia?: string;
}

export interface ShippingOption {
  id: string;
  carrier: string;
  carrierName: string;
  service: string;
  serviceName: string;
  deliveryEstimate: string;
  deliveryDate: string | null;
  price: number;
}

export interface PostalCodeInfo {
  state: string;
  stateName: string;
  city: string;
  suburbs: string[];
}

export interface GeneratedLabel {
  carrier: string;
  service: string;
  trackingNumber: string;
  trackUrl: string;
  labelUrl: string;
  price: number;
  shipmentId: number | null;
}

interface EnviaRate {
  carrier: string;
  carrierDescription: string;
  service: string;
  serviceDescription: string;
  dropOff: number;
  deliveryEstimate: string;
  deliveryDate?: { date?: string } | null;
  totalPrice: number;
  currency: string;
}

export class ShippingError extends Error {}

export function getEnviaStatus() {
  return {
    configured: Boolean(process.env.ENVIA_API_KEY?.trim()),
    environment: process.env.ENVIA_ENV === "production" ? ("production" as const) : ("sandbox" as const),
  };
}

function getApiKey(): string {
  const key = process.env.ENVIA_API_KEY?.trim();
  if (!key) throw new ShippingError("ENVIA_API_KEY no está configurada en las variables de entorno");
  return key;
}

function defaultSettings() {
  return getDefaultShippingSettings(process.env.ENVIA_ORIGIN_CP || "37000");
}

export async function getShippingSettings(): Promise<ShippingSettings> {
  const defaults = defaultSettings();
  try {
    const { data, error } = await createServerClient()
      .from("shipping_settings")
      .select("settings")
      .eq("id", true)
      .maybeSingle();
    if (error || !data) return defaults;
    return mergeShippingSettings(data.settings, defaults);
  } catch {
    return defaults;
  }
}

// Envia responde algunos errores con HTTP 200 y meta "error", así que se revisan ambos.
function enviaErrorMessage(data: unknown, fallback: string): string {
  if (!data || typeof data !== "object") return fallback;
  const record = data as Record<string, unknown>;
  const error = record.error && typeof record.error === "object" ? (record.error as Record<string, unknown>) : null;
  const message = [error?.message, error?.description, record.carrier_message, record.message]
    .find((value) => typeof value === "string" && value.trim());
  return typeof message === "string" ? `Envia: ${message}` : fallback;
}

async function enviaPost(path: string, body: unknown): Promise<{ ok: boolean; data: Record<string, unknown> | null }> {
  const res = await fetch(`${ENVIA_API_URL}${path}`, {
    method: "POST",
    headers: { Authorization: `Bearer ${getApiKey()}`, "Content-Type": "application/json" },
    body: JSON.stringify(body),
    cache: "no-store",
  });
  const data = await res.json().catch(() => null);
  return { ok: res.ok && data?.meta !== "error", data };
}

function toEnviaAddress(address: ShippingAddress) {
  return {
    name: address.name,
    company: address.company || undefined,
    email: address.email || undefined,
    phone: address.phone,
    street: address.street,
    number: address.number || "S/N",
    district: address.district,
    city: address.city,
    state: address.state,
    country: "MX",
    postalCode: address.postalCode,
    reference: address.reference || undefined,
  };
}

function toEnviaPackage(pkg: ShippingPackage, declaredValue = 0) {
  return {
    content: pkg.content,
    amount: 1,
    type: "box",
    weight: pkg.weight,
    declaredValue,
    weightUnit: "KG",
    lengthUnit: "CM",
    dimensions: { length: pkg.length, width: pkg.width, height: pkg.height },
  };
}

export async function lookupPostalCode(cp: string): Promise<PostalCodeInfo | null> {
  const res = await fetch(`${ENVIA_GEOCODES_URL}/zipcode/MX/${encodeURIComponent(cp)}`, { cache: "no-store" });
  if (!res.ok) return null;
  const data = await res.json().catch(() => null);
  const entry = Array.isArray(data) ? data[0] : null;
  const state = entry?.state?.code?.["2digit"];
  if (!state) return null;
  return {
    state,
    stateName: entry.state.name ?? "",
    city: entry.locality ?? "",
    suburbs: Array.isArray(entry.suburbs) ? entry.suburbs : [],
  };
}

async function rateCarrier(
  carrier: string,
  origin: ReturnType<typeof toEnviaAddress>,
  destination: Record<string, string>,
  pkg: ShippingPackage
): Promise<EnviaRate[]> {
  const { ok, data } = await enviaPost("/ship/rate/", {
    origin,
    destination,
    packages: [{ ...toEnviaPackage(pkg), insurance: 0 }],
    shipment: { carrier, type: 1 },
  });
  if (!ok) return [];
  return Array.isArray(data?.data) ? (data.data as EnviaRate[]) : [];
}

export async function quoteShipping(
  input: ShippingDestination,
  packageOverride?: ShippingPackage
): Promise<{ options: ShippingOption[]; location: PostalCodeInfo }> {
  getApiKey();
  if (!/^\d{5}$/.test(input.cp)) throw new ShippingError("El código postal debe tener 5 dígitos");

  const [settings, location] = await Promise.all([getShippingSettings(), lookupPostalCode(input.cp)]);
  if (!location) throw new ShippingError("No encontramos ese código postal. Revísalo e intenta de nuevo.");

  // Para cotizar basta el código postal; el resto de la dirección se completa al generar la guía.
  const destination = {
    name: "Cliente",
    phone: "0000000000",
    street: "Domicilio",
    number: "1",
    district: input.colonia?.trim() || location.suburbs[0] || "Centro",
    city: input.city?.trim() || location.city,
    state: location.state,
    country: "MX",
    postalCode: input.cp,
  };
  const origin = toEnviaAddress(settings.origin);
  const pkg = packageOverride ?? settings.package;

  const results = await Promise.allSettled(settings.carriers.map((carrier) => rateCarrier(carrier, origin, destination, pkg)));
  const cheapestById = new Map<string, ShippingOption>();
  for (const result of results) {
    if (result.status !== "fulfilled") continue;
    for (const rate of result.value) {
      // Solo recolección y entrega a domicilio; las opciones "Ocurre" requieren ir a sucursal.
      if (rate.dropOff !== 0 || rate.currency !== "MXN" || !(rate.totalPrice > 0)) continue;
      const id = `${rate.carrier}:${rate.service}`;
      const current = cheapestById.get(id);
      if (current && current.price <= rate.totalPrice) continue;
      cheapestById.set(id, {
        id,
        carrier: rate.carrier,
        carrierName: rate.carrierDescription,
        service: rate.service,
        serviceName: rate.serviceDescription,
        deliveryEstimate: rate.deliveryEstimate,
        deliveryDate: rate.deliveryDate?.date ?? null,
        price: Math.round(rate.totalPrice * 100) / 100,
      });
    }
  }

  const options = [...cheapestById.values()].sort((a, b) => a.price - b.price);
  if (options.length === 0) throw new ShippingError("No hay paqueterías disponibles para ese código postal en este momento.");
  return { options, location };
}

export async function generateLabel(input: {
  carrier: string;
  service: string;
  destination: ShippingAddress;
  package: ShippingPackage;
  declaredValue: number;
  orderReference: string;
}): Promise<GeneratedLabel> {
  getApiKey();
  const settings = await getShippingSettings();
  const location = await lookupPostalCode(input.destination.postalCode);
  if (!location) throw new ShippingError("No encontramos el código postal de destino.");

  const { ok, data } = await enviaPost("/ship/generate/", {
    origin: toEnviaAddress(settings.origin),
    destination: toEnviaAddress({ ...input.destination, state: location.state }),
    packages: [toEnviaPackage(input.package, input.declaredValue)],
    shipment: { carrier: input.carrier, service: input.service, type: 1, orderReference: input.orderReference },
    settings: { printFormat: "PDF", printSize: settings.printSize, currency: "MXN", comments: `Pedido ${input.orderReference}` },
  });
  const label = Array.isArray(data?.data) ? (data.data[0] as Record<string, unknown> | undefined) : undefined;
  if (!ok || !label || typeof label.trackingNumber !== "string" || !label.trackingNumber) {
    throw new ShippingError(enviaErrorMessage(data, "Envia no pudo generar la guía. Revisa los datos e intenta de nuevo."));
  }
  return {
    carrier: typeof label.carrier === "string" ? label.carrier : input.carrier,
    service: typeof label.service === "string" ? label.service : input.service,
    trackingNumber: label.trackingNumber,
    trackUrl: typeof label.trackUrl === "string" ? label.trackUrl : "",
    labelUrl: typeof label.label === "string" ? label.label : "",
    price: Math.round(Number(label.totalPrice ?? 0) * 100) / 100,
    shipmentId: typeof label.shipmentId === "number" ? label.shipmentId : null,
  };
}

export async function cancelLabel(carrier: string, trackingNumber: string): Promise<{ balanceReturned: boolean }> {
  const { ok, data } = await enviaPost("/ship/cancel/", { carrier, trackingNumber });
  if (!ok) throw new ShippingError(enviaErrorMessage(data, "Envia no pudo cancelar la guía."));
  const result = data?.data && typeof data.data === "object" ? (data.data as Record<string, unknown>) : {};
  return { balanceReturned: result.balanceReturned === true };
}

// Configuración de envíos editable desde el CMS. Sin dependencias de servidor:
// la usan tanto las rutas API como los formularios del panel.

export const SHIPPING_CARRIERS = [
  { id: "fedex", label: "FedEx" },
  { id: "estafeta", label: "Estafeta" },
  { id: "dhl", label: "DHL" },
  { id: "paquetexpress", label: "Paquetexpress" },
  { id: "redpack", label: "Redpack" },
  { id: "ups", label: "UPS" },
] as const;

export const LABEL_PRINT_SIZES = [
  { id: "STOCK_4X6", label: "Etiqueta térmica 4×6\"" },
  { id: "PAPER_4X6", label: "Papel 4×6\"" },
  { id: "PAPER_LETTER", label: "Hoja carta" },
] as const;

export type LabelPrintSize = (typeof LABEL_PRINT_SIZES)[number]["id"];

export interface ShippingAddress {
  name: string;
  company: string;
  email: string;
  phone: string;
  street: string;
  number: string;
  district: string;
  city: string;
  /** Código de estado de Envia (2–3 letras). Se obtiene del código postal al guardar. */
  state: string;
  postalCode: string;
  reference: string;
}

export interface ShippingPackage {
  content: string;
  weight: number;
  length: number;
  width: number;
  height: number;
}

export interface ShippingSettings {
  origin: ShippingAddress;
  carriers: string[];
  package: ShippingPackage;
  printSize: LabelPrintSize;
}

export function getDefaultShippingSettings(originPostalCode = "37000"): ShippingSettings {
  return {
    origin: {
      name: "Vital Life Insumos Médicos",
      company: "Vital Life",
      email: "",
      phone: "4770000000",
      street: "Centro",
      number: "1",
      district: "Centro",
      city: "León",
      state: "GT",
      postalCode: originPostalCode,
      reference: "",
    },
    carriers: ["fedex", "estafeta", "dhl", "paquetexpress"],
    package: { content: "Insumos médicos", weight: 1, length: 20, width: 20, height: 15 },
    printSize: "STOCK_4X6",
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function text(value: unknown, max = 120) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

function positiveNumber(value: unknown, max: number) {
  const parsed = typeof value === "number" ? value : Number(value);
  return Number.isFinite(parsed) && parsed > 0 && parsed <= max ? Math.round(parsed * 100) / 100 : null;
}

export function onlyDigits(value: string) {
  return value.replace(/\D/g, "");
}

export function parsePackage(input: unknown): ShippingPackage | { error: string } {
  if (!isRecord(input)) return { error: "Faltan las medidas del paquete." };
  const weight = positiveNumber(input.weight, 70);
  const length = positiveNumber(input.length, 200);
  const width = positiveNumber(input.width, 200);
  const height = positiveNumber(input.height, 200);
  if (weight === null) return { error: "El peso del paquete debe estar entre 0.01 y 70 kg." };
  if (length === null || width === null || height === null) return { error: "Las medidas del paquete deben estar entre 0.1 y 200 cm." };
  return { content: text(input.content, 80) || "Insumos médicos", weight, length, width, height };
}

/** Valida una dirección de origen o destino. `state` no se valida: el servidor lo obtiene del código postal. */
export function parseAddress(input: unknown, label: string): ShippingAddress | { error: string } {
  if (!isRecord(input)) return { error: `Falta la dirección de ${label}.` };
  const address: ShippingAddress = {
    name: text(input.name, 80),
    company: text(input.company, 80),
    email: text(input.email, 120),
    phone: onlyDigits(text(input.phone, 30)),
    street: text(input.street, 120),
    number: text(input.number, 20),
    district: text(input.district, 80),
    city: text(input.city, 80),
    state: text(input.state, 3).toUpperCase(),
    postalCode: onlyDigits(text(input.postalCode, 10)),
    reference: text(input.reference, 120),
  };
  if (!address.name) return { error: `Escribe el nombre de ${label}.` };
  if (address.phone.length !== 10) return { error: `El teléfono de ${label} debe tener 10 dígitos.` };
  if (!address.street) return { error: `Escribe la calle de ${label}.` };
  if (!address.district) return { error: `Escribe la colonia de ${label}.` };
  if (!address.city) return { error: `Escribe la ciudad de ${label}.` };
  if (!/^\d{5}$/.test(address.postalCode)) return { error: `El código postal de ${label} debe tener 5 dígitos.` };
  if (address.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(address.email)) return { error: `El correo de ${label} no es válido.` };
  return address;
}

export function parseShippingSettings(input: unknown): ShippingSettings | { error: string } {
  if (!isRecord(input)) return { error: "La configuración no es válida." };
  const origin = parseAddress(input.origin, "origen");
  if ("error" in origin) return origin;
  const pkg = parsePackage(input.package);
  if ("error" in pkg) return pkg;
  const validCarriers = new Set<string>(SHIPPING_CARRIERS.map((carrier) => carrier.id));
  const carriers = Array.isArray(input.carriers)
    ? [...new Set(input.carriers.filter((carrier): carrier is string => typeof carrier === "string" && validCarriers.has(carrier)))]
    : [];
  if (carriers.length === 0) return { error: "Activa al menos una paquetería." };
  const printSize = LABEL_PRINT_SIZES.find((size) => size.id === input.printSize)?.id;
  if (!printSize) return { error: "Elige un tamaño de etiqueta válido." };
  return { origin, carriers, package: pkg, printSize };
}

/** Combina lo guardado en la base con los valores por defecto (por si faltan campos de versiones anteriores). */
export function mergeShippingSettings(stored: unknown, defaults: ShippingSettings): ShippingSettings {
  if (!isRecord(stored)) return defaults;
  const merged = {
    origin: { ...defaults.origin, ...(isRecord(stored.origin) ? stored.origin : {}) },
    carriers: Array.isArray(stored.carriers) ? stored.carriers : defaults.carriers,
    package: { ...defaults.package, ...(isRecord(stored.package) ? stored.package : {}) },
    printSize: stored.printSize ?? defaults.printSize,
  };
  const parsed = parseShippingSettings(merged);
  if ("error" in parsed) return defaults;
  return { ...parsed, origin: { ...parsed.origin, state: parsed.origin.state || defaults.origin.state } };
}

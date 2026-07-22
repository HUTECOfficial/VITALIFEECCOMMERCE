import inventory from "@/productos_extraidos.json";
import type { Product } from "@/types";

type InventoryRecord = {
  "Clave de artículo ": string;
  "Descripción del producto  ": string;
  "existencia real": number;
  "Estatus ": string;
};

const variantLabels: Record<string, string> = {
  CHICA: "Chico",
  CHICO: "Chico",
  MED: "Mediano",
  MEDIANA: "Mediano",
  MEDIANO: "Mediano",
  GRANDE: "Grande",
  BLANCO: "Blanco",
  BLANCA: "Blanco",
  NEGRO: "Negro",
  NEGRA: "Negro",
  AZUL: "Azul",
  ROJO: "Rojo",
  ROJA: "Rojo",
  VERDE: "Verde",
  AMARILLO: "Amarillo",
  AMARILLA: "Amarillo",
  XL: "Extra grande",
  XXL: "Extra grande",
};

const variantPattern = new RegExp(`\\b(${Object.keys(variantLabels).join("|")})$`);

function getVariant(name: string) {
  const match = name.match(variantPattern);
  if (!match) return null;
  const baseName = name.slice(0, match.index).trim().replace(/[\s-]+$/, "");
  return { baseName, label: variantLabels[match[1]] };
}

function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function getCategory(name: string): Product["category"] {
  if (/GUANTE|NITRILO/.test(name)) return "guantes";
  if (/JERINGA|AGUJA|CATETER|CANULA|IV|INFUSION|VENOCLISIS|SONDA|FOLEY/.test(name)) return "jeringas";
  if (/GASA|VENDA|APOSITO|CINTA|ESPARADRAPO|CURACION|COMPRESA/.test(name)) return "vendas";
  if (/OXIMETRO|ESTETOSCOPIO|TENSIOMETRO|FERULA|COLLARIN|CABESTRILLO|MASCARILLA|ZAPATO|ELECTROCAUTERIO/.test(name)) return "equipo";
  if (/GEL|JABON|ANTISEPT|CLORHEX|ALCOHOL|LUBRICANTE/.test(name)) return "curacion";
  return "medicamentos";
}

function getImage(category: Product["category"]) {
  const images: Record<Product["category"], string> = {
    vendas: "/material-curacion.png",
    guantes: "/guantes.png",
    jeringas: "/vias-iv.png",
    medicamentos: "/diagnostico.png",
    curacion: "/material-curacion.png",
    equipo: "/diagnostico.png",
  };
  return images[category];
}

const records = inventory as InventoryRecord[];
const variantsByBase = new Map<string, InventoryRecord[]>();

for (const record of records) {
  const variant = getVariant(record["Descripción del producto  "]);
  if (!variant) continue;
  const group = variantsByBase.get(variant.baseName) ?? [];
  group.push(record);
  variantsByBase.set(variant.baseName, group);
}

const groupedNames = new Set(
  [...variantsByBase.entries()]
    .filter(([, group]) => group.length > 1)
    .flatMap(([, group]) => group.map((record) => record["Descripción del producto  "]))
);

const groupedProducts: Product[] = [...variantsByBase.entries()]
  .filter(([, group]) => group.length > 1)
  .map(([name, group]) => {
    const first = group[0];
    const category = getCategory(name);
    return {
      id: `inventory-${first["Clave de artículo "]}`,
      name,
      slug: `${slugify(name)}-${slugify(first["Clave de artículo "])}`,
      category,
      price: 0,
      description: `Disponible bajo cotización. Variantes: ${group
        .map((record) => getVariant(record["Descripción del producto  "])?.label)
        .filter(Boolean)
        .join(", ")}.`,
      image: getImage(category),
      inStock: group.some((record) => record["existencia real"] > 0),
      sizes: group
        .map((record) => getVariant(record["Descripción del producto  "])?.label)
        .filter((variant): variant is string => Boolean(variant)),
      quoteOnly: true,
    };
  });

const individualProducts: Product[] = records
  .filter((record) => !groupedNames.has(record["Descripción del producto  "]))
  .map((record) => {
    const name = record["Descripción del producto  "];
    const category = getCategory(name);
    return {
      id: `inventory-${record["Clave de artículo "]}`,
      name,
      slug: `${slugify(name)}-${slugify(record["Clave de artículo "])}`,
      category,
      price: 0,
      description: `Clave de artículo: ${record["Clave de artículo "]}. Disponible bajo cotización.`,
      image: getImage(category),
      inStock: record["existencia real"] > 0,
      quoteOnly: true,
    };
  });

export const inventoryProducts: Product[] = [...groupedProducts, ...individualProducts];

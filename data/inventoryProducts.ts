import inventory from "@/productos_extraidos.json";
import productNameOverrides from "@/data/product-name-overrides.json";
import productImageOverrides from "@/data/product-image-overrides.json";
import { categoryImageById } from "@/data/visualAssets";
import type { Product } from "@/types";
import { normalizeProductName, standardizeProductDescription } from "@/lib/product-copy";
import { getProductNameParts } from "@/lib/product-name";

type InventoryRecord = {
  "Clave de artículo ": string;
  "Descripción del producto  ": string;
  "existencia real": number;
  "Estatus ": string;
};

const namesByArticleCode = productNameOverrides as Record<string, string>;
const imagesBySlug = productImageOverrides as Record<string, string>;

function getDisplayName(record: InventoryRecord) {
  const articleCode = String(record["Clave de artículo "]).trim();
  return normalizeProductName(namesByArticleCode[articleCode] ?? record["Descripción del producto  "]);
}

function getBrandKey(record: InventoryRecord) {
  const articleCode = String(record["Clave de artículo "]).trim();
  return articleCode.match(/^[A-Z]+/)?.[0] ?? articleCode;
}

const sizeLabels: Record<string, string> = {
  CHICA: "Chico",
  CHICO: "Chico",
  MED: "Mediano",
  MEDIANA: "Mediano",
  MEDIANO: "Mediano",
  GRANDE: "Grande",
  XL: "Extra grande",
  XXL: "Extra grande",
  "#6.0": "6",
  "#6.5": "6.5",
  "#7.0": "7",
  "#7.5": "7.5",
  "#8.0": "8",
  "TALLA 6 1/2": "6.5",
  "TALLA 7 1/2": "7.5",
  "TALLA 6": "6",
  "TALLA 7": "7",
  "TALLA 8": "8",
};

const colorLabels: Record<string, string> = {
  "AZUL ROYAL": "Azul royal",
  "AZUL COBALTO": "Azul cobalto",
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
  ROSA: "Rosa",
  VIOLETA: "Violeta",
};

function getVariant(name: string) {
  const normalized = name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase();
  const vendalasticSize = normalized.match(/^VENDA ELASTICA (10|15) CM ANCHO 5 CM LONGITUD M VENDALASTIC$/)?.[1];
  const idealSize = normalized.match(/^VENDA ELASTICA(?: IDEAL)? (5|7\.5|30)CMX5M(?: \d+)? (?:IDEAL|LEROY)$/)?.[1];
  const elasticBandageSize = vendalasticSize ?? idealSize;
  if (elasticBandageSize) {
    return {
      baseName: "VENDA ELASTICA IDEAL",
      sizes: [`${elasticBandageSize} cm`],
      colors: [],
    };
  }

  let baseName = normalized;
  const sizes: string[] = [];
  const colors: string[] = [];

  for (const [term, label] of Object.entries(sizeLabels)) {
    const pattern = term.startsWith("#")
      ? new RegExp(`\\${term.replace(".", "\\.")}(?![0-9])`, "g")
      : new RegExp(`\\b${term}\\b`, "g");
    if (pattern.test(baseName)) {
      sizes.push(label);
      baseName = baseName.replace(pattern, " ");
    }
  }

  for (const [term, label] of Object.entries(colorLabels)) {
    const pattern = new RegExp(`\\b${term}\\b`, "g");
    if (pattern.test(baseName)) {
      colors.push(label);
      baseName = baseName.replace(pattern, " ");
    }
  }

  baseName = baseName.replace(/\s+/g, " ").trim();
  if (sizes.length === 0 && colors.length === 0) return null;
  return { baseName, sizes, colors };
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
  const product = name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase();

  if (/^GUANTE|GUANTE /.test(product)) return "guantes";
  if (/RECOLECTOR.*(RPBI|PUNZOCORT|PUZOCORT)|BOLSA RESID|BOLSA P\/ESTERILIZAR|CINTA TESTIGO.*VAPOR/.test(product)) return "residuos";
  if (/CUBREBOCA|KN95|GORRO|CUBREZAPATO|BATA QUIRURGICA|UNIFORME QUIRURGICO|CAMPO QUIRURGICO|SABANA PARA EXPLORACION|BOTA SIN PLANTILLA/.test(product)) return "proteccion-desechables";
  if (/ALCOHOL|CLORHEX|CLORHEXI|YODO|DERMODINE|DERMOCLEEN|DERMO-QRIT|ANTIBENZIL|ANTISEPT|GEL ANTIBACTERIAL|AGUA OXIGENADA|CHLORAPREP|TOALLAS ALCOHOLADAS|CEPILLO P\/USO QUIRURGICO/.test(product)) return "antisepticos";
  if (/FERULA|ZAPATO POST|COLLARIN|CABESTRILLO|CINTA KINESIOLOGICA|INMOVILIZADOR|GYPSONA|MEDIAS ANTIEMBOLICAS|CORREA PARA CLAVICULA/.test(product)) return "rehabilitacion";
  if (/OXIMETRO|BAUMANOMETRO|TENSIOMETRO|ESTETOSCOPIO|GLUCOMETRO|TIRAS (REACTIVAS|CONTOUR|ACCU)|LANCETA|TERMOMETRO|ELECTRODO|GEL ULTRASON|ALCOHOLIMETRO|ROLLO DE PAPEL PARA ELECTRO/.test(product)) return "diagnostico";
  if (/MASCARILLA (RCP|P\/OXIGENO|LARINGEA|YUWELL)|TUBO (DE )?SUCCION|CATETER P\/SUCCION|SISTEMA DE SUCCION|TUBO ENDOTRAQUEAL|SONDA ENDOT|CANULA (GUEDEL|CPAP)|CIRCUITO BAIN|SONDA NASAL P\/OXIGENO|PUNTA NASAL|CATETER PARA OXIGENO|CANULA YANKAWER/.test(product)) return "respiratorio";
  if (/SONDA|DRENAJE|PENROSE|ACTIVELIFE|BOLSA RECOLECTORA DE ORINA|BOLSA (?:P\/|PARA )?COLOSTOMIA|FIJADOR P\/SONDA|BOLSA KENGUARD|JALEA LUBRICANTE|LUBRI-6/.test(product)) return "sondas-cateteres";
  if (/FLEBOTEK|VENOCLISIS|BOMBA DE INFUSION|GIRATEK|TEGO|PUNZOCAT|INSYTE|SURFLASH|CATETER 7FR|CONECTOR|LLAVE 3 VIAS|SOLUCION (CS|HT|DX|FP|HESTAR|KRIT)|SOLUCION (DE )?(CLORURO DE SODIO|GLUCOSA|HARTMANN)|SOL HESTAR|AGUA (P\/IRRIGA|INY|DESTILADA)|CLORURO\/POTASIO|SULFATO MAGNESIO|GLUCONATO DE CALCIO|BICARNAT|BICARBONATO SOD|MANITOL|MARIPOSA/.test(product)) return "terapia-iv";
  if (/BISTURI|HOJA P\/BISTURI|MANGO DE BISTURI|SUTURA|VICRYL|NYLON|SEDA|MONOCRYL|MALLA PROLENE|ELECTROCAUTERIO|CAMPANA P\/CIRCUNCISION|PINZA UMBILICAL|TIJERA UMBILICAL|PORTA AGUJA|EQUIPO (DE|PARA) CIRUGIA|MALLA.*MESH|COMPRESA LAPAROTOMIA|TUBO P\/LIGADURA/.test(product)) return "quirurgico";
  if (/JERINGA|AGUJA|PERISAFE|ESPICAT/.test(product)) return "jeringas";
  if (/GASA|VENDA|APOSITO|TEGADERM|MICROPORE|LEUKOPLAST|TRANSPORE|CURITAS|ALGODON|GUATA|COMPRESA|JELONET|COBAN|MALLA TUBULAR|CUTIMED|DUODERM|ESPARADRAPO|TORUNDA|APLICADOR ESTERIL/.test(product)) return "curacion";
  if (/PASTILLERO|VASO RECOLECTOR|BATA P\/ PACIENTE|BATA PARA PACIENTE|PAÑAL|ORINAL|COMODO|RIÑON DE PLASTICO|BOLSA PARA ENEMA|PERA HULE|GOTERO|ABATELENGUAS|RASTRILLO|ROLLO P\/MESA|BOTIQUIN|KIT POP WASH|ARTICULOS: VARIOS/.test(product)) return "atencion-paciente";
  return "medicamentos";
}

function getImage(slug: string, name: string, category: Product["category"]) {
  if (imagesBySlug[slug]) return imagesBySlug[slug];
  const normalizedName = slugify(name);
  const matches = Object.entries(imagesBySlug).filter(([key]) => key === normalizedName || key.startsWith(`${normalizedName}-`));
  return matches.length === 1 ? matches[0][1] : categoryImageById[category];
}

const records = inventory as InventoryRecord[];
const variantsByBase = new Map<string, InventoryRecord[]>();

for (const record of records) {
  const variant = getVariant(record["Descripción del producto  "]);
  if (!variant) continue;
  const groupKey = `${getBrandKey(record)}::${variant.baseName}`;
  const group = variantsByBase.get(groupKey) ?? [];
  group.push(record);
  variantsByBase.set(groupKey, group);
}

const groupedNames = new Set(
  [...variantsByBase.entries()]
    .filter(([, group]) => group.length > 1)
    .flatMap(([, group]) => group.map((record) => record["Descripción del producto  "]))
);

const groupedProducts: Product[] = [...variantsByBase.entries()]
  .filter(([, group]) => group.length > 1)
  .map(([, group]) => {
    const first = group[0];
    const baseName = getVariant(first["Descripción del producto  "])?.baseName ?? first["Descripción del producto  "];
    const isIdealBandage = baseName === "VENDA ELASTICA IDEAL";
    const name = isIdealBandage ? "Venda elástica Ideal" : normalizeProductName(baseName);
    const productName = getProductNameParts(first["Descripción del producto  "]);
    const category = getCategory(name);
    const slug = `${slugify(name)}-${slugify(first["Clave de artículo "])}`;
    const variants = group
      .flatMap((record) => {
        const sourceName = record["Descripción del producto  "];
        const sourceSlug = `${slugify(sourceName)}-${slugify(record["Clave de artículo "])}`;
        const variant = getVariant(sourceName);
        const variantSizes = variant?.sizes.length ? variant.sizes : [""];
        const variantColors = variant?.colors.length ? variant.colors : [""];
        return variantColors.flatMap((color) => variantSizes.map((size) => ({
          color,
          size,
          stockQuantity: Math.max(0, record["existencia real"]),
          image: getImage(sourceSlug, sourceName, category),
        })));
      })
      .sort((left, right) => Number.parseFloat(left.size) - Number.parseFloat(right.size));
    const sizes = [...new Set(variants.map((variant) => variant.size).filter(Boolean))];
    return {
      id: `inventory-${first["Clave de artículo "]}`,
      name,
      slug,
      category,
      price: 0,
      description: standardizeProductDescription("", category, true),
      image: variants.find((variant) => variant.stockQuantity > 0)?.image ?? getImage(slug, name, category),
      inStock: group.some((record) => record["existencia real"] > 0),
      stockQuantity: group.reduce((total, record) => total + Math.max(0, record["existencia real"]), 0),
      sizes,
      colors: [...new Set(group.flatMap((record) => getVariant(record["Descripción del producto  "])?.colors ?? []))],
      variants,
      brand: isIdealBandage ? "Le Roy" : productName.brand ?? undefined,
      presentation: isIdealBandage ? "Rollo de 5 m" : productName.presentation ?? undefined,
      quoteOnly: true,
    };
  });

const individualProducts: Product[] = records
  .filter((record) => !groupedNames.has(record["Descripción del producto  "]))
  .map((record) => {
    const sourceName = record["Descripción del producto  "];
    const productName = getProductNameParts(sourceName);
    const category = getCategory(sourceName);
    const name = getDisplayName(record);
    const slug = `${slugify(sourceName)}-${slugify(record["Clave de artículo "])}`;
    return {
      id: `inventory-${record["Clave de artículo "]}`,
      name,
      slug,
      category,
      price: 0,
      description: standardizeProductDescription("", category, true),
      image: getImage(slug, name, category),
      inStock: record["existencia real"] > 0,
      stockQuantity: Math.max(0, record["existencia real"]),
      quoteOnly: true,
      brand: productName.brand ?? undefined,
      presentation: productName.presentation ?? undefined,
    };
  });

export const inventoryProducts: Product[] = [...groupedProducts, ...individualProducts];

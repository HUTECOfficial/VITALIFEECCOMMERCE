import inventory from "@/productos_extraidos.json";
import productNameOverrides from "@/data/product-name-overrides.json";
import { categoryImageById } from "@/data/visualAssets";
import type { Product } from "@/types";

type InventoryRecord = {
  "Clave de artículo ": string;
  "Descripción del producto  ": string;
  "existencia real": number;
  "Estatus ": string;
};

const namesByArticleCode = productNameOverrides as Record<string, string>;

function getDisplayName(record: InventoryRecord) {
  const articleCode = String(record["Clave de artículo "]).trim();
  return namesByArticleCode[articleCode] ?? record["Descripción del producto  "];
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
  if (/SONDA|DRENAJE|PENROSE|BOLSA RECOLECTORA DE ORINA|BOLSA P\/COLOSTOMIA|FIJADOR P\/SONDA|BOLSA KENGUARD|JALEA LUBRICANTE|LUBRI-6/.test(product)) return "sondas-cateteres";
  if (/FLEBOTEK|VENOCLISIS|BOMBA DE INFUSION|GIRATEK|TEGO|PUNZOCAT|INSYTE|SURFLASH|CATETER 7FR|CONECTOR|LLAVE 3 VIAS|SOLUCION (CS|HT|DX|FP|HESTAR|KRIT)|SOL HESTAR|AGUA (P\/IRRIGA|INY|DESTILADA)|CLORURO\/POTASIO|SULFATO MAGNESIO|GLUCONATO DE CALCIO|BICARNAT|BICARBONATO SOD|MANITOL|MARIPOSA/.test(product)) return "terapia-iv";
  if (/BISTURI|HOJA P\/BISTURI|MANGO DE BISTURI|SUTURA|VICRYL|NYLON|SEDA|MONOCRYL|MALLA PROLENE|ELECTROCAUTERIO|CAMPANA P\/CIRCUNCISION|PINZA UMBILICAL|TIJERA UMBILICAL|PORTA AGUJA|EQUIPO (DE|PARA) CIRUGIA|MALLA.*MESH|COMPRESA LAPAROTOMIA|TUBO P\/LIGADURA/.test(product)) return "quirurgico";
  if (/JERINGA|AGUJA|PERISAFE|ESPICAT/.test(product)) return "jeringas";
  if (/GASA|VENDA|APOSITO|TEGADERM|MICROPORE|LEUKOPLAST|TRANSPORE|CURITAS|ALGODON|GUATA|COMPRESA|JELONET|COBAN|MALLA TUBULAR|CUTIMED|DUODERM|ESPARADRAPO|TORUNDA|APLICADOR ESTERIL/.test(product)) return "curacion";
  if (/PASTILLERO|VASO RECOLECTOR|BATA P\/ PACIENTE|BATA PARA PACIENTE|PAÑAL|ORINAL|COMODO|RIÑON DE PLASTICO|BOLSA PARA ENEMA|PERA HULE|GOTERO|ABATELENGUAS|RASTRILLO|ROLLO P\/MESA|BOTIQUIN|KIT POP WASH|ARTICULOS: VARIOS/.test(product)) return "atencion-paciente";
  return "medicamentos";
}

function getImage(category: Product["category"]) {
  return categoryImageById[category];
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
    const name = getVariant(first["Descripción del producto  "])?.baseName ?? first["Descripción del producto  "];
    const category = getCategory(name);
    return {
      id: `inventory-${first["Clave de artículo "]}`,
      name,
      slug: `${slugify(name)}-${slugify(first["Clave de artículo "])}`,
      category,
      price: 0,
      description: "Disponible bajo cotización. Elige las opciones disponibles.",
      image: getImage(category),
      inStock: group.some((record) => record["existencia real"] > 0),
      stockQuantity: group.reduce((total, record) => total + Math.max(0, record["existencia real"]), 0),
      sizes: [...new Set(group.flatMap((record) => getVariant(record["Descripción del producto  "])?.sizes ?? []))],
      colors: [...new Set(group.flatMap((record) => getVariant(record["Descripción del producto  "])?.colors ?? []))],
      quoteOnly: true,
    };
  });

const individualProducts: Product[] = records
  .filter((record) => !groupedNames.has(record["Descripción del producto  "]))
  .map((record) => {
    const sourceName = record["Descripción del producto  "];
    const category = getCategory(sourceName);
    return {
      id: `inventory-${record["Clave de artículo "]}`,
      name: getDisplayName(record),
      slug: `${slugify(sourceName)}-${slugify(record["Clave de artículo "])}`,
      category,
      price: 0,
      description: `Clave de artículo: ${record["Clave de artículo "]}. Disponible bajo cotización.`,
      image: getImage(category),
      inStock: record["existencia real"] > 0,
      stockQuantity: Math.max(0, record["existencia real"]),
      quoteOnly: true,
    };
  });

export const inventoryProducts: Product[] = [...groupedProducts, ...individualProducts];

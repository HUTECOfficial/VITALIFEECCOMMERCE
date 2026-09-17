export type ProductNameDetail = {
  label:
    | "Presentación"
    | "Contenido del empaque"
    | "Contenido"
    | "Concentración"
    | "Dosis"
    | "Medidas"
    | "Talla / calibre"
    | "Color"
    | "Condición"
    | "Envase"
    | "Vía de administración";
  value: string;
};

export type ProductNameParts = {
  title: string;
  presentation: string | null;
  brand: string | null;
  details: ProductNameDetail[];
};

const knownBrands = [
  "DIPASA / LABORATORIOS VISA",
  "ALCOHOLERA DEL CENTRO S.A DE C.V",
  "PUNZOCAT / ADVANTIVE",
  "APPLIED MEDICAL",
  "SENSI MEDICAL",
  "SENSIMEDICAL",
  "BSN MEDICAL",
  "HUDSON RCI",
  "ESTERIPHARMA",
  "B. BRAUN",
  "ACCU-CHEK",
  "AMBIDERM",
  "ALTAMIRANO",
  "COVIDIEN",
  "INTERSURGICAL",
  "PROTEXIS",
  "TELEFLEX",
  "ETHICON",
  "CONVATEC",
  "MEDLINE",
  "VENDALASTIC",
  "RESPIFIX",
  "QUIRMEX",
  "CONMED",
  "EDIGAR",
  "ATRAMAT",
  "VIZCARRA",
  "NIPRO",
  "PROTEC",
  "BIOMEP",
  "SANDOZ",
  "VALEANT",
  "LIOMONT",
  "LOEFFLER",
  "TAKEDA",
  "MAVER",
  "HERGOM",
  "KENER",
  "GALIA",
  "NAVONTEC",
  "AMSINO",
  "RESMED",
  "BEADVANCE",
  "NODRIM",
  "LEROY",
  "HUDSON",
  "PISA",
  "RÜSCH",
  "LE ROY",
  "AMSA",
  "BD",
  "3M",
];

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function formatValue(value: string) {
  return value
    .replace(/(\d(?:[.,]\d+)?)(MG|MCG|µG|UG|GRS?\.?|KG|ML|CC|LTS?\.?|LITROS?|UI|U\.I\.?|MM|CM|FR|GA|OZ)\b/gi, "$1 $2")
    .replace(/(\d)\s*(PCS?|PZS?|PIEZAS?)\b/gi, "$1 piezas")
    .replace(/(\d)\s*(?:TAB(?:S)?|TABLETAS?)\b/gi, "$1 tabletas")
    .replace(/(\d)\s*CAPS?(?:ULAS)?\b/gi, "$1 cápsulas")
    .replace(/(\d)\s*AMP(?:S|ULAS?|OLLAS?)?\b/gi, "$1 ampolletas")
    .replace(/\bGRS?\.?\b/gi, "g")
    .replace(/\bLTS?\.?\b/gi, "L")
    .replace(/\b(?:PCS?|PZS?|PIEZAS?)\b/gi, "piezas")
    .replace(/\b(?:TAB(?:S)?|TABLETAS?)\b/gi, "tabletas")
    .replace(/\bCAPS?(?:ULAS)?\b/gi, "cápsulas")
    .replace(/\bAMP(?:S|ULAS?|OLLAS?)?\b/gi, "ampolletas")
    .replace(/\bFAMP\b/gi, "frascos ámpula")
    .replace(/\bFCOS?\b/gi, "frascos")
    .replace(/\bJGA(?:S)?\b/gi, "jeringas")
    .replace(/\bPAQ\.?\b/gi, "paquete")
    .replace(/\b(?:C\s*\/|CON)\s*(\d+)/gi, "$1")
    .replace(/\s*\/\s*/g, " / ")
    .replace(/\s*(?:[xX×*])\s*/g, " × ")
    .replace(/\bMCG\b/gi, "mcg")
    .replace(/\bMG\b/gi, "mg")
    .replace(/\bML\b/gi, "mL")
    .replace(/\bCM\b/gi, "cm")
    .replace(/\bMM\b/gi, "mm")
    .replace(/\s+/g, " ")
    .trim();
}

function sentenceCase(value: string) {
  const lower = value.toLocaleLowerCase("es-MX");
  return lower.charAt(0).toLocaleUpperCase("es-MX") + lower.slice(1);
}

function addDetail(details: ProductNameDetail[], label: ProductNameDetail["label"], rawValue: string) {
  let value = formatValue(rawValue);

  if (label === "Presentación") {
    value = value.replace(/^(caja|bolsa|paquete|frasco|bote|tubo|rollo)\s+/i, (word) => `${sentenceCase(word.trim())} con `);
  } else if (label === "Contenido del empaque") {
    value = value.replace(/^(?:C\s*\/|CON)\s*/i, "");
  } else if (label === "Color" || label === "Condición" || label === "Talla / calibre" || label === "Envase") {
    value = sentenceCase(value);
  } else if (label === "Vía de administración") {
    value = value.toLocaleUpperCase("es-MX");
  }

  value = value
    .replace(/^1 piezas$/i, "1 pieza")
    .replace(/^1 tabletas$/i, "1 tableta")
    .replace(/^1 cápsulas$/i, "1 cápsula")
    .replace(/^1 ampolletas$/i, "1 ampolleta")
    .replace(/\bNo esteril\b/i, "No estéril")
    .replace(/\bEsteril\b/i, "Estéril");

  if (!value || details.some((detail) => detail.label === label && detail.value.toLocaleLowerCase("es-MX") === value.toLocaleLowerCase("es-MX"))) return;
  details.push({ label, value });
}

function cleanTitle(value: string) {
  return value
    .replace(/\s+/g, " ")
    .replace(/\s+([,.;:])/g, "$1")
    .replace(/^[\s,.;:/-]+|[\s,.;:/-]+$/g, "")
    .replace(/\s+(?:X|×)\s*$/i, "")
    .replace(/\s+\b(?:DE|DEL|CON)\b$/i, "")
    .trim();
}

/**
 * Separates the sellable product name from brand, dosage, volume, dimensions and pack size.
 * The source name is never changed; this is only a display helper.
 */
export function getProductNameParts(name: string, explicitBrand?: string): ProductNameParts {
  const details: ProductNameDetail[] = [];
  let working = name.replace(/\s+/g, " ").trim();
  let brand = explicitBrand?.trim() || null;

  const brandCandidates = brand ? [brand, ...knownBrands] : [...knownBrands];
  for (const candidate of brandCandidates.sort((a, b) => b.length - a.length)) {
    const brandPattern = new RegExp(`(?:\\s|^)${escapeRegExp(candidate)}\\s*$`, "i");
    if (brandPattern.test(working)) {
      brand = brand || candidate;
      working = working.replace(brandPattern, " ");
      break;
    }
  }

  const extract = (
    pattern: RegExp,
    label: ProductNameDetail["label"],
    transform: (match: string) => string = (match) => match
  ) => {
    working = working.replace(pattern, (match) => {
      addDetail(details, label, transform(match));
      return " ";
    });
  };

  extract(
    /\b(?:CAJA|BOLSA|PAQUETE|PAQ\.?|FRASCO|FCO\.?|BOTE|TUBO|ROLLO)\s+(?:C\s*\/|CON)\s*\d+(?:\s*(?:TABLETAS?|TAB(?:S)?|COMPRIMIDOS?|CAPS?(?:ULAS)?|AMP(?:S|ULAS?|OLLAS?)?|FAMP|FRASCOS?|FCOS?|TUBOS?|BOLSAS?|PZS?|PCS?|PIEZAS?|ROLLOS?|JERINGAS?|JGAS?))?/gi,
    "Presentación"
  );
  extract(
    /\b\d+(?:[.,]\d+)?\s*(?:MG|MCG|µG|UG|G|GRS?\.?|UI|U\.I\.?)?\s*\/\s*\d+(?:[.,]\d+)?\s*(?:ML|L|LTS?\.?)\b/gi,
    "Concentración"
  );
  extract(
    /\b\d+(?:[.,]\d+)?\s*(?:MM|CM|M|PULGADAS?|PULG\.?)\s*[X×*]\s*\d+(?:[.,]\d+)?\s*(?:MM|CM|M|PULGADAS?|PULG\.?)\b/gi,
    "Medidas"
  );
  extract(/\b\d+(?:[.,]\d+)?\s*[X×*]\s*\d+(?:[.,]\d+)?\b/gi, "Medidas");
  extract(/\b\d+(?:[.,]\d+)?\s*(?:MM|CM|M|PULGADAS?|PULG\.?)\b/gi, "Medidas");
  extract(/\b\d+(?:[.,]\d+)?\s*%/gi, "Concentración");
  extract(
    /\b(?:C\s*\/|CON)\s*\d+(?:[.,]\d+)?\s*(?:KG|GRS?\.?|ML|CC|LTS?\.?|LITROS?|L|OZ)\b/gi,
    "Contenido",
    (match) => match.replace(/^(?:C\s*\/|CON)\s*/i, "")
  );
  extract(
    /\b(?:C\s*\/|CON)\s*\d+(?:\s*(?:TABLETAS?|TAB(?:S)?|COMPRIMIDOS?|CAPS?(?:ULAS)?|AMP(?:S|ULAS?|OLLAS?)?|FAMP|FRASCOS?|FCOS?|TUBOS?|BOLSAS?|PZS?|PCS?|PIEZAS?|ROLLOS?|JERINGAS?|JGAS?))?\b/gi,
    "Contenido del empaque"
  );
  extract(
    /\b\d+\s*(?:TABLETAS?|TAB(?:S)?|COMPRIMIDOS?|CAPS?(?:ULAS)?|AMP(?:S|ULAS?|OLLAS?)?|FAMP|FRASCOS?|FCOS?|TUBOS?|BOLSAS?|PZS?|PCS?|PIEZAS?|ROLLOS?|JERINGAS?|JGAS?)\b/gi,
    "Contenido del empaque"
  );
  extract(/\b\d+(?:[.,]\d+)?\s*(?:MG|MCG|µG|UG|UI|U\.I\.?)\b/gi, "Dosis");
  extract(/\b\d+(?:[.,]\d+)?\s*(?:KG|GRS?\.?|ML|CC|LTS?\.?|LITROS?|L|OZ)\b/gi, "Contenido");
  extract(/\b(?:FCO|FRASCO)\b/gi, "Presentación", () => "Frasco");
  extract(/\b(?:AMPULA|ÁMPULA|AMPOLLA)\b/gi, "Presentación", () => "Ampolleta");
  extract(/\b(?:CAL(?:IBRE)?\.?\s*)?(?:#\s*)?\d+(?:[.,]\d+)?\s*(?:FR|GA)\b/gi, "Talla / calibre");
  extract(/\b\d+(?:[.,]\d+)?G\b/gi, "Talla / calibre");
  extract(/\bTALLA\s+(?:CHICA|CHICO|MEDIANA|MEDIANO|GRANDE|XL|XXL|\d+(?:[.,]\d+)?(?:\s+1\/2)?)\b/gi, "Talla / calibre");
  extract(/\b(?:CHICA|CHICO|MEDIANA|MEDIANO|GRANDE|EXTRA GRANDE|XL|XXL)\b/gi, "Talla / calibre");
  extract(/\b(?:AZUL ROYAL|AZUL COBALTO|AZUL|BLANCA?|NEGR[OA]|ROJ[OA]|VERDE|AMARILL[OA]|ROSA|VIOLETA|TRANSPARENTE)\b/gi, "Color");
  extract(/\b(?:NO\s+EST[EÉ]RIL|EST[EÉ]RIL)\b/gi, "Condición");
  extract(/\bPLAST\b/gi, "Envase", () => "Plástico");
  extract(/\b(?:IV|IM|ORAL)\b/gi, "Vía de administración");

  const title = cleanTitle(working) || cleanTitle(name);
  const presentation = details.length
    ? details.map((detail) => `${detail.label}: ${detail.value}`).join(" · ")
    : null;

  return {
    title,
    presentation,
    brand,
    details,
  };
}

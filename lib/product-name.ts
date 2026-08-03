type ProductNameParts = {
  title: string;
  presentation: string | null;
};

const presentationPatterns = [
  /\b\d+(?:[.,]\d+)?\s*(?:MG|MCG|µG|UG|GRS?\.?|G|KG|ML|CC|LTS?\.?|LITROS?|UI|U\.I\.?|MM|CM|M|FR|GA|OZ)\s*\/\s*(?:\d+(?:[.,]\d+)?|[.,]\d+)\s*(?:MG|MCG|µG|UG|GRS?\.?|G|KG|ML|CC|LTS?\.?|LITROS?|UI|U\.I\.?|MM|CM|M|FR|GA|OZ)\b/gi,
  /\b\d+(?:[.,]\d+)?\s*(?:G|FR|GA)\s*[X×*]\s*\d+(?:[.,]\d+)?(?:\s*(?:MM|CM))?\b/gi,
  /\b(?:C|D)\s*\/\s*\d+(?:[.,]\d+)?\s*(?:MG|MCG|µG|UG|GRS?\.?|G|KG|ML|CC|LTS?\.?|LITROS?|UI|U\.I\.?|MM|CM|M|FR|GA|OZ)\b/gi,
  /\b\d+(?:[.,]\d+)?\s*[X×*]\s*\d+(?:[.,]\d+)?(?:\s*(?:MM|CM|M))?\b/gi,
  /\b\d+(?:[.,]\d+)?\s*(?:MG|MCG|µG|UG|GRS?\.?|G|KG|ML|CC|LTS?\.?|LITROS?|UI|U\.I\.?|MM|CM|M|FR|GA|OZ)\b/gi,
  /\b\d+(?:[.,]\d+)?\s*%/gi,
  /\bC\s*\/\s*\d+(?:\s*(?:TAB(?:S)?|COMP(?:R|RS)?|CAPS?(?:ULAS)?|AMP(?:OLLAS?)?|FAMP|FCO(?:S)?|TUBO(?:S)?|BOLSA(?:S)?|PZS?|PCS?|PIEZA(?:S)?|ROLLO(?:S)?|JERINGA(?:S)?))?\b/gi,
  /\b\d+\s*(?:TAB(?:S)?|COMP(?:R|RS)?|CAPS?(?:ULAS)?|AMP(?:OLLAS?)?|FAMP|FCO(?:S)?|TUBO(?:S)?|BOLSA(?:S)?|PZS?|PCS?|PIEZA(?:S)?|ROLLO(?:S)?|JERINGA(?:S)?)\b/gi,
];

function formatPresentation(value: string) {
  return value
    .replace(/(\d(?:[.,]\d+)?)(MG|MCG|µG|UG|GRS?\.?|G|KG|ML|CC|LTS?\.?|LITROS?|UI|U\.I\.?|MM|CM|M|FR|GA|OZ)\b/gi, "$1 $2")
    .replace(/\bGRS?\.?\b/gi, "g")
    .replace(/\bLTS?\.?\b/gi, "L")
    .replace(/\bPCS?\b/gi, "pzas")
    .replace(/\bPZS?\b/gi, "pzas")
    .replace(/\bTAB\b/gi, "tabs")
    .replace(/\bTABS\b/gi, "tabs")
    .replace(/\bAMP\b/gi, "amp")
    .replace(/\bAMPS\b/gi, "amp")
    .replace(/\bC\s*\/\s*(\d+)/gi, "Caja de $1")
    .replace(/\s*([/×*])\s*/g, " $1 ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Separates the sellable product name from dosage, volume, dimensions and pack size.
 * The source name is never changed; this is only a display helper.
 */
export function getProductNameParts(name: string): ProductNameParts {
  const matches: Array<{ start: number; end: number; value: string }> = [];

  for (const pattern of presentationPatterns) {
    pattern.lastIndex = 0;
    for (const match of name.matchAll(pattern)) {
      const start = match.index ?? 0;
      const end = start + match[0].length;
      if (!matches.some((item) => start < item.end && end > item.start)) {
        matches.push({ start, end, value: match[0] });
      }
    }
  }

  if (matches.length === 0) return { title: name, presentation: null };

  matches.sort((a, b) => a.start - b.start);
  let title = name;
  for (const match of [...matches].sort((a, b) => b.start - a.start)) {
    title = `${title.slice(0, match.start)} ${title.slice(match.end)}`;
  }

  title = title
    .replace(/\s+/g, " ")
    .replace(/\s+([,.;:])/g, "$1")
    .replace(/[\s,.;:/]+$/g, "")
    .replace(/-+$/g, "")
    .trim();

  return {
    title: title || name,
    presentation: matches.map((match) => formatPresentation(match.value)).join(" · "),
  };
}

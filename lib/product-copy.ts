import type { ProductCategory } from "@/types";

const lowercaseWords = new Set([
  "a", "al", "con", "de", "del", "el", "en", "la", "las", "los", "para", "por", "sin", "tipo", "y",
]);

const uppercaseTerms = new Set([
  "AMSA", "BD", "CPAP", "CVC", "ECG", "EVA", "IV", "KN95", "N95", "PVC", "RCP", "RPBI", "UI",
]);

const descriptionByCategory: Record<ProductCategory, string> = {
  guantes: "Guantes para uso médico. Consulta las tallas, los colores y la presentación disponibles.",
  curacion: "Insumo para curación y cuidado de heridas. Consulta las medidas y la presentación disponibles.",
  antisepticos: "Producto para antisepsia y control de infecciones. Consulta la presentación disponible.",
  jeringas: "Insumo estéril para aplicación y punción. Consulta el calibre, la capacidad y la presentación disponibles.",
  "terapia-iv": "Insumo para terapia intravenosa y manejo de soluciones. Consulta las especificaciones disponibles.",
  "sondas-cateteres": "Sonda, catéter o accesorio para uso médico. Consulta el calibre, la medida y la presentación disponibles.",
  respiratorio: "Insumo para terapia respiratoria y ventilación. Consulta el tamaño y la presentación disponibles.",
  diagnostico: "Equipo o accesorio para diagnóstico y monitoreo. Consulta las especificaciones disponibles.",
  quirurgico: "Equipo o instrumental para procedimientos quirúrgicos. Consulta las medidas y la presentación disponibles.",
  rehabilitacion: "Producto de apoyo para rehabilitación y ortopedia. Consulta las tallas y medidas disponibles.",
  medicamentos: "Medicamento para uso bajo indicación de un profesional de la salud. Consulta la presentación disponible.",
  "proteccion-desechables": "Insumo de protección y uso desechable. Consulta la talla, el material y la presentación disponibles.",
  residuos: "Insumo para el manejo seguro de residuos. Consulta la capacidad y la presentación disponibles.",
  "atencion-paciente": "Artículo para higiene, comodidad y atención del paciente. Consulta las especificaciones disponibles.",
};

function capitalizeWord(word: string) {
  const firstLetter = word.search(/[a-záéíóúüñ]/i);
  if (firstLetter < 0) return word;
  return `${word.slice(0, firstLetter)}${word.charAt(firstLetter).toLocaleUpperCase("es-MX")}${word.slice(firstLetter + 1)}`;
}

/** Converts legacy, all-uppercase inventory labels into consistent catalog copy. */
export function normalizeProductName(value: string) {
  const sourceLetters = value.match(/[A-Za-zÁÉÍÓÚÜÑáéíóúüñ]/g) ?? [];
  const sourceHasLowercase = sourceLetters.some((letter) => letter === letter.toLocaleLowerCase("es-MX") && letter !== letter.toLocaleUpperCase("es-MX"));
  const normalized = value
    .replace(/\bP\s*\/\s*/gi, "para ")
    .replace(/\bC\s*\/\s*(?=\d)/gi, "con ")
    .replace(/\s+/g, " ")
    .trim();
  if (!sourceLetters.length || sourceHasLowercase) return normalized;

  return normalized
    .toLocaleLowerCase("es-MX")
    .split(" ")
    .map((word, index) => {
      const comparable = word.replace(/[^a-z0-9]/gi, "").toLocaleUpperCase("es-MX");
      if (uppercaseTerms.has(comparable)) return word.toLocaleUpperCase("es-MX");
      if (/^\d+(?:[.,]\d+)?(?:mg|mcg|g|kg|ml|l|mm|cm|m|fr|ui)$/i.test(word)) return word.toLocaleUpperCase("es-MX");
      if (index > 0 && lowercaseWords.has(word)) return word;
      return capitalizeWord(word);
    })
    .join(" ")
    .replace(/\bAcido\b/g, "Ácido")
    .replace(/\bEsteril\b/g, "Estéril")
    .replace(/\bInyeccion\b/g, "Inyección")
    .replace(/\bPlastico\b/g, "Plástico")
    .replace(/\bSodico\b/g, "Sódico")
    .replace(/\bSolucion\b/g, "Solución");
}

export function standardizeProductDescription(
  value: string | null | undefined,
  category: ProductCategory,
  quoteOnly = false
) {
  const description = value?.replace(/\s+/g, " ").trim() ?? "";
  const isInternalOrGeneric = !description
    || /^Clave de art[ií]culo:/i.test(description)
    || /^Disponible bajo cotizaci[oó]n/i.test(description);
  const base = isInternalOrGeneric ? descriptionByCategory[category] : description;
  const punctuated = /[.!?]$/.test(base) ? base : `${base}.`;
  if (!quoteOnly || /cotizaci[oó]n/i.test(punctuated)) return punctuated;
  return `${punctuated} Disponible bajo cotización.`;
}

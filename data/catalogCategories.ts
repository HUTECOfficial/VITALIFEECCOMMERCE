import type { BrandCategory } from "@/data/brands";
import type { ProductCategory } from "@/types";

export const catalogCategoryOrder: ProductCategory[] = [
  "guantes",
  "curacion",
  "antisepticos",
  "jeringas",
  "terapia-iv",
  "sondas-cateteres",
  "respiratorio",
  "diagnostico",
  "quirurgico",
  "rehabilitacion",
  "medicamentos",
  "proteccion-desechables",
  "residuos",
  "atencion-paciente",
];

export const brandCategoryToProductCategories: Record<BrandCategory, ProductCategory[]> = {
  "Apósitos y Cintas": ["curacion"],
  "Guantes": ["guantes"],
  "Agujas y Jeringas": ["jeringas"],
  "Vías IV": ["terapia-iv"],
  "Ventilación": ["respiratorio"],
  "Soluciones IV": ["terapia-iv"],
  "Antisépticos": ["antisepticos"],
  "Material de Curación": ["curacion"],
  "Sondas y Catéteres": ["sondas-cateteres"],
  "Equipo Quirúrgico": ["quirurgico"],
  "Diagnóstico": ["diagnostico"],
  "Rehabilitación": ["rehabilitacion"],
  "Misceláneos": ["proteccion-desechables", "residuos", "atencion-paciente"],
};

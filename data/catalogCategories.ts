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

export const catalogCategoryBySlug: Record<string, ProductCategory> = {
  guantes: "guantes",
  curacion: "curacion",
  "material-curacion": "curacion",
  antisepticos: "antisepticos",
  jeringas: "jeringas",
  "terapia-iv": "terapia-iv",
  "vias-iv": "terapia-iv",
  "sondas-cateteres": "sondas-cateteres",
  sondas: "sondas-cateteres",
  respiratorio: "respiratorio",
  ventilacion: "respiratorio",
  diagnostico: "diagnostico",
  quirurgico: "quirurgico",
  "equipo-quirurgico": "quirurgico",
  rehabilitacion: "rehabilitacion",
  medicamentos: "medicamentos",
  "proteccion-desechables": "proteccion-desechables",
  residuos: "residuos",
  "atencion-paciente": "atencion-paciente",
  miscelaneos: "atencion-paciente",
};

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

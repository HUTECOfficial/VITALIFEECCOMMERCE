import type { ProductCategory } from "@/types";

const storageBaseUrl = "https://qczoqkhgphlhomcscnsk.supabase.co/storage/v1/object/public/VITALIFE/nuevas%20imagenes";

function storageImage(fileName: string) {
  return `${storageBaseUrl}/${encodeURIComponent(fileName)}`;
}

export const homeHeroImage = storageImage("Principal.png");

export const categoryImageById: Record<ProductCategory, string> = {
  guantes: storageImage("Guantes principal.png"),
  curacion: storageImage("Curacion Apositos Vendajes.png"),
  antisepticos: storageImage("Aticepticos Control de Infecciones.png"),
  jeringas: storageImage("Agujas Jeringas.png"),
  "terapia-iv": storageImage("Terapia Intravenosas soluciones.png"),
  "sondas-cateteres": storageImage("Sondas, cateter, drenajes.png"),
  respiratorio: storageImage("Teraparia Respiratoria.png"),
  diagnostico: "/diagnostico.png",
  quirurgico: "/equipo-quirurgico.png",
  rehabilitacion: "/rehabilitacion.png",
  medicamentos: "/diagnostico.png",
  "proteccion-desechables": "/miscelaneos.png",
  residuos: "/miscelaneos.png",
  "atencion-paciente": "/miscelaneos.png",
};

export const nursingServiceImageById = {
  "atencion-domiciliaria": storageImage("Enfermeria Domicilio.png"),
  "rehabilitacion-fisica": storageImage("Fisioterapia.png"),
  "renta-equipo-medico": storageImage("Renta de equipo medico.png"),
  laboratorios: storageImage("Toma de muestra.png"),
  radiografias: storageImage("Radiografias.png"),
  "curacion-heridas": storageImage("Curacion de heridas.png"),
} as const;

export const homepageBrandLogos = [
  { id: "3m", name: "3M", src: storageImage("3m.png") },
  { id: "ambiderm", name: "Ambiderm", src: storageImage("Ambiderm.png") },
  { id: "amsa", name: "AMSA", src: storageImage("Amsa.png") },
  { id: "atramat", name: "Atramat", src: storageImage("Atramat.png") },
  { id: "bd", name: "BD", src: storageImage("BD.png") },
  { id: "b-braun", name: "B. Braun", src: storageImage("Braund.png") },
  { id: "edigar", name: "Edigar", src: storageImage("Edigar.png") },
  { id: "nipro", name: "Nipro", src: storageImage("Nipro.png") },
  { id: "protec", name: "Protec", src: storageImage("Protec.png") },
  { id: "vizcarra", name: "Vizcarra", src: storageImage("Vizcarra.png") },
] as const;

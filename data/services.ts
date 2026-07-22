import { Service } from "@/types";

export const services: Service[] = [
  {
    id: "1",
    title: "Insumos Médicos",
    slug: "insumos",
    description:
      "Comercializamos material de curación, medicamentos y equipo médico certificado para instituciones y pacientes particulares.",
    features: [
      "Productos certificados y de calidad",
      "Entrega rápida en León, Gto.",
      "Precios competitivos",
      "Variedad de marcas reconocidas",
    ],
    icon: "Package",
    href: "/insumos",
  },
  {
    id: "2",
    title: "Enfermería y Fisioterapia",
    slug: "enfermeria",
    description:
      "Servicios de atención domiciliaria, rehabilitación física y cuidado personalizado para tu recuperación y bienestar.",
    features: [
      "Atención domiciliaria",
      "Rehabilitación física",
      "Cuidado personalizado",
      "Profesionales certificados",
    ],
    icon: "Activity",
    href: "/enfermeria",
  },
];

export const companyStats = [
  { label: "Seguridad y Confianza", value: "100%", icon: "Shield" },
  { label: "Atención", value: "24/7", icon: "Clock" },
  { label: "Profesionales Certificados", value: "50+", icon: "Award" },
  { label: "Pacientes Atendidos", value: "1,200+", icon: "Users" },
];

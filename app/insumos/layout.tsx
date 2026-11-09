import type { Metadata } from "next";

const description =
  "Catálogo de insumos médicos con precios: guantes, material de curación, gasas, vendas, jeringas, sondas, catéteres, soluciones, equipo de diagnóstico y rehabilitación. Venta en León, Guanajuato y envíos a todo México.";

export const metadata: Metadata = {
  // Objeto con plantilla para que las páginas de marca hereden el sufijo del sitio.
  title: {
    default: "Catálogo de Insumos Médicos y Material de Curación",
    template: "%s | Vital Life Insumos Médicos",
  },
  description,
  alternates: { canonical: "/insumos" },
  openGraph: {
    title: "Catálogo de Insumos Médicos | Vital Life",
    description,
    url: "/insumos",
  },
};

export default function InsumosLayout({ children }: { children: React.ReactNode }) {
  return children;
}

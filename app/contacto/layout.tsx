import type { Metadata } from "next";

const description =
  "Contacta a Vital Life Insumos Médicos en León, Guanajuato. Cotizaciones de insumos y material médico por WhatsApp o correo, y atención de enfermería y fisioterapia a domicilio.";

export const metadata: Metadata = {
  title: "Contacto y Cotizaciones",
  description,
  alternates: { canonical: "/contacto" },
  openGraph: { title: "Contacto | Vital Life Insumos Médicos", description, url: "/contacto" },
};

export default function ContactoLayout({ children }: { children: React.ReactNode }) {
  return children;
}

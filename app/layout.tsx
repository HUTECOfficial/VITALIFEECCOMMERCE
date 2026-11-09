import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollProgressBar from "@/components/animations/ScrollProgressBar";
import FloatingWhatsAppButton from "@/components/FloatingWhatsAppButton";
import JsonLd from "@/components/seo/JsonLd";
import { organizationJsonLd, SITE_NAME, SITE_URL } from "@/lib/seo";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

const siteDescription =
  "Tienda de insumos médicos en León, Guanajuato: guantes, material de curación, jeringas, sondas, soluciones y equipo médico de +20 marcas. Compra en línea con envío a todo México.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Insumos Médicos en León, Guanajuato | Vital Life",
    template: "%s | Vital Life Insumos Médicos",
  },
  description: siteDescription,
  applicationName: SITE_NAME,
  keywords: [
    "insumos médicos",
    "insumos médicos León",
    "material médico",
    "material de curación",
    "tienda de insumos médicos",
    "equipo médico",
    "guantes de látex",
    "guantes de nitrilo",
    "jeringas",
    "gasas",
    "vendas",
    "sondas",
    "catéteres",
    "suministros hospitalarios",
    "insumos de enfermería",
    "León Guanajuato",
    "enfermería domiciliaria",
    "fisioterapia a domicilio",
  ],
  category: "Salud",
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 } },
  openGraph: {
    title: "Vital Life Insumos Médicos | León, Guanajuato",
    description: siteDescription,
    locale: "es_MX",
    type: "website",
    siteName: SITE_NAME,
  },
  twitter: {
    card: "summary_large_image",
    title: "Vital Life Insumos Médicos | León, Guanajuato",
    description: siteDescription,
  },
  ...(process.env.GOOGLE_SITE_VERIFICATION
    ? { verification: { google: process.env.GOOGLE_SITE_VERIFICATION } }
    : {}),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es-MX"className={`${inter.className} h-full`}>
      <body className="min-h-full flex flex-col bg-white text-gray-900 antialiased">
        <JsonLd data={organizationJsonLd()} />
        <ScrollProgressBar />
        <Navbar />
        <main className="flex-1 pt-[96px]">{children}</main>
        <Footer />
        <FloatingWhatsAppButton />
      </body>
    </html>
  );
}

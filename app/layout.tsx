import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollProgressBar from "@/components/animations/ScrollProgressBar";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Vital Life Insumos Médicos | León, Guanajuato",
    template: "%s | Vital Life Insumos Médicos",
  },
  description:
    "Somos un equipo profesional dedicado a ofrecer un servicio humano, digno y eficaz para el cuidado integral de la salud en León, Guanajuato.",
  keywords: [
    "insumos médicos",
    "León Guanajuato",
    "enfermería domiciliaria",
    "fisioterapia",
    "material de curación",
  ],
  icons: {
    icon: "/vitalife-logo.png",
    apple: "/vitalife-logo.png",
  },
  openGraph: {
    title: "Vital Life Insumos Médicos",
    description: "Servicios integrales de salud en León, Guanajuato",
    locale: "es_MX",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${inter.className} h-full`}>
      <body className="min-h-full flex flex-col bg-white text-gray-900 antialiased">
        <ScrollProgressBar />
        <Navbar />
        <main className="flex-1 pt-[96px]">{children}</main>
        <Footer />
      </body>
    </html>
  );
}


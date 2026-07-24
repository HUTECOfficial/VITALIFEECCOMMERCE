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
  metadataBase: new URL("https://www.vitallifemx.store"),
  title: {
    default: "Vital Life Insumos Médicos | León, Guanajuato",
    template: "%s | Vital Life Insumos Médicos",
  },
  description:
    "Distribuidores autorizados de las mejores marcas médicas. +20 marcas y +500 referencias en almacén. Entrega el mismo día en León, Guanajuato.",
  keywords: [
    "insumos médicos",
    "León Guanajuato",
    "enfermería domiciliaria",
    "fisioterapia",
    "material de curación",
  ],
  openGraph: {
    title: "Vital Life Insumos Médicos",
    description: "Distribuidores autorizados de marcas médicas en León, Guanajuato",
    locale: "es_MX",
    type: "website",
    siteName: "Vital Life Insumos Médicos",
  },
  twitter: {
    card: "summary_large_image",
    title: "Vital Life Insumos Médicos",
    description: "Distribuidores autorizados de marcas médicas en León, Guanajuato",
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


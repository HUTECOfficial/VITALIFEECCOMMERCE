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
        <a
          href="https://wa.me/524771736105"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Contactar por WhatsApp al 477 173 6105"
          className="fixed bottom-4 right-4 z-40 flex h-11 w-11 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_6px_20px_rgba(37,211,102,0.28)] transition-all duration-200 hover:-translate-y-0.5 hover:scale-105 hover:shadow-[0_8px_24px_rgba(37,211,102,0.38)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366] focus-visible:ring-offset-2 sm:bottom-5 sm:right-5"
        >
          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M20.52 3.48A11.83 11.83 0 0 0 12.1 0C5.56 0 .24 5.32.24 11.86c0 2.09.55 4.14 1.6 5.94L.14 24l6.36-1.67a11.84 11.84 0 0 0 5.6 1.43h.01c6.54 0 11.86-5.32 11.86-11.86 0-3.17-1.24-6.14-3.45-8.42ZM12.1 21.76a9.83 9.83 0 0 1-5.02-1.38l-.36-.21-3.77.99 1.01-3.68-.23-.38a9.84 9.84 0 0 1-1.51-5.24c0-5.43 4.42-9.85 9.86-9.85 2.63 0 5.1 1.03 6.96 2.89a9.78 9.78 0 0 1 2.89 6.97c0 5.43-4.42 9.85-9.83 9.85Zm5.4-7.38c-.3-.15-1.77-.88-2.04-.98-.27-.1-.47-.15-.66.15-.2.3-.76.98-.94 1.18-.17.2-.35.22-.65.08-.3-.15-1.26-.46-2.4-1.48a9.05 9.05 0 0 1-1.66-2.07c-.17-.3-.02-.46.13-.6.13-.13.3-.35.45-.52.15-.18.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.66-1.6-.91-2.19-.24-.58-.48-.5-.66-.5h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.22 3.08c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.62.71.23 1.35.19 1.86.12.57-.09 1.77-.72 2.02-1.42.25-.7.25-1.3.17-1.43-.07-.12-.27-.2-.57-.35Z" />
          </svg>
        </a>
      </body>
    </html>
  );
}


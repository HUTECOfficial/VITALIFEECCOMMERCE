import type { Metadata } from "next";

// Página privada o de compra: no debe aparecer en buscadores.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function PrivateLayout({ children }: { children: React.ReactNode }) {
  return children;
}

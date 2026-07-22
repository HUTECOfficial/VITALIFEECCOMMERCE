"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  motion,
  AnimatePresence,
} from "framer-motion";
import Image from "next/image";
import {
  Phone,
  ShoppingCart,
  Menu,
  X,
  ChevronDown,
  Package,
  Home,
  Activity,
} from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { cn } from "@/lib/utils";

const sectoresMenu = [
  { label: "Enfermería y Fisioterapia", href: "/enfermeria", icon: Activity },
];

const navLinks = [
  { label: "Inicio", href: "/" },
  { label: "Nosotros", href: "/nosotros" },
  { label: "Insumos", href: "/insumos", icon: Package },
  { label: "Contacto", href: "/contacto" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [sectoresOpen, setSectoresOpen] = useState(false);
  const pathname = usePathname();
  const itemCount = useCartStore((s) => s.itemCount());

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const isSectorActive = pathname.startsWith("/enfermeria");

  return (
    <>
      {/* Floating Pill Navbar */}
      <motion.div
        className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-24px)] max-w-5xl"
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <nav className="glass-nav rounded-2xl px-4 sm:px-6 h-[80px] flex items-center justify-between">

          {/* Logo */}
          <Link href="/" className="flex items-center group shrink-0">
            <Image
              src="/vitalife-logo.png"
              alt="Vital Life Servicios Integrales"
              width={280}
              height={140}
              className="h-[120px] w-auto object-contain group-hover:scale-105 transition-transform"
              priority
            />
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-0.5">
            {navLinks.map((link) => {
              const isActive = link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);
              return (
                <div key={link.href} className="relative pb-1.5">
                  <Link
                    href={link.href}
                    className={cn(
                      "px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200",
                      isActive
                        ? "text-[#1a3a6b] bg-[#e8f4fd]"
                        : "text-gray-500 hover:text-[#1a3a6b] hover:bg-[#f0f8ff]"
                    )}
                  >
                    {link.label}
                  </Link>
                  {isActive && (
                    <motion.div
                      layoutId="nav-dot"
                      className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#2eb8d4]"
                    />
                  )}
                </div>
              );
            })}

            {/* Sectores dropdown */}
            <div
              className="relative pb-1.5"
              onMouseEnter={() => setSectoresOpen(true)}
              onMouseLeave={() => setSectoresOpen(false)}
            >
              <button
                className={cn(
                  "flex items-center gap-1 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200",
                  isSectorActive
                    ? "text-[#1a3a6b] bg-[#e8f4fd]"
                    : "text-gray-500 hover:text-[#1a3a6b] hover:bg-[#f0f8ff]"
                )}
                aria-haspopup="true"
                aria-expanded={sectoresOpen}
              >
                Sectores
                <ChevronDown
                  className={cn(
                    "w-3.5 h-3.5 transition-transform duration-200",
                    sectoresOpen && "rotate-180"
                  )}
                />
              </button>
              {isSectorActive && (
                <motion.div
                  layoutId="nav-dot"
                  className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#2eb8d4]"
                />
              )}

              <AnimatePresence>
                {sectoresOpen && (
                  <motion.div
                    className="absolute top-full left-0 mt-2 w-56 glass-card p-2 border-0"
                    initial={{ opacity: 0, y: -8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.96 }}
                    transition={{ duration: 0.15 }}
                  >
                    {sectoresMenu.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-600 hover:text-[#1a3a6b] hover:bg-[#e8f4fd] transition-colors"
                      >
                        <div className="w-7 h-7 rounded-lg bg-[#e8f4fd] flex items-center justify-center shrink-0">
                          <item.icon className="w-3.5 h-3.5 text-[#2eb8d4]" />
                        </div>
                        {item.label}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Cart */}
            <Link
              href="/carrito"
              className="relative p-2 rounded-xl text-gray-500 hover:text-[#1a3a6b] hover:bg-[#e8f4fd] transition-colors"
              aria-label={`Carrito, ${itemCount} artículos`}
            >
              <ShoppingCart className="w-5 h-5" />
              <AnimatePresence>
                {itemCount > 0 && (
                  <motion.span
                    key={itemCount}
                    className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] rounded-full bg-[#2eb8d4] text-white text-[9px] font-bold flex items-center justify-center px-1"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    transition={{ type: "spring", stiffness: 400, damping: 15 }}
                  >
                    {itemCount > 9 ? "9+" : itemCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>

            {/* CTA Llámanos */}
            <a
              href="tel:4771510611"
              className="hidden sm:flex items-center gap-2 bg-[#1a3a6b] text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-[#2eb8d4] transition-all duration-200 shadow-sm"
              aria-label="Llamar a Vital Life"
            >
              <Phone className="w-4 h-4" />
              <span>Llámanos</span>
            </a>

            {/* Hamburger */}
            <button
              className="lg:hidden p-2 rounded-xl text-gray-500 hover:text-[#1a3a6b] hover:bg-[#e8f4fd] transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Menú de navegación"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </nav>
      </motion.div>

      {/* Mobile menu — dropdown below navbar */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="fixed inset-0 z-40 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div
              className="absolute inset-0 bg-black/20 backdrop-blur-sm"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              className="absolute top-[84px] left-3 right-3 bg-white rounded-2xl shadow-[0_8px_40px_rgba(26,58,107,0.15)] border border-gray-100 p-4"
              initial={{ opacity: 0, y: -16, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -16, scale: 0.97 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <div className="flex flex-col gap-1">
                {navLinks.map((link) => {
                  const isActive = link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={cn(
                        "px-4 py-3 rounded-xl text-base font-medium transition-colors",
                        isActive
                          ? "text-[#1a3a6b] bg-[#e8f4fd]"
                          : "text-gray-600 hover:text-[#1a3a6b] hover:bg-[#e8f4fd]"
                      )}
                    >
                      {link.label}
                    </Link>
                  );
                })}
                <div className="pt-2 pb-1 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Sectores
                </div>
                {sectoresMenu.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-base text-gray-600 hover:text-[#1a3a6b] hover:bg-[#e8f4fd] transition-colors"
                  >
                    <item.icon className="w-5 h-5 text-[#2eb8d4]" />
                    {item.label}
                  </Link>
                ))}
                <div className="pt-3 border-t border-gray-100 mt-2">
                  <a
                    href="tel:4771510611"
                    className="flex items-center justify-center gap-2 bg-[#1a3a6b] text-white px-6 py-3 rounded-xl text-base font-semibold hover:bg-[#2eb8d4] transition-colors"
                  >
                    <Phone className="w-5 h-5" />
                    477 151 0611
                  </a>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

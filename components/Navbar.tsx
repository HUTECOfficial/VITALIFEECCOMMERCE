"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { Phone, ShoppingCart, Menu, X, ChevronDown, Package, Activity, Sparkles } from "lucide-react";
import { useCartStore, useClientCartCount } from "@/store/cartStore";
import { cn } from "@/lib/utils";

const sectoresMenu = [
  { label: "Enfermería/Fisio", href: "/enfermeria", icon: Activity },
  { label: "Insumos", href: "/insumos", icon: Package },
];

const navLinks = [
  { label: "Inicio", href: "/" },
  { label: "Nosotros", href: "/nosotros" },
  { label: "Catálogo Insumos", href: "/insumos", icon: Package },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const pathname = usePathname();
  const itemCount = useClientCartCount();

  const { scrollY } = useScroll();
  const islandWidth = useTransform(scrollY, [0, 120], ["95%", "78%"]);
  const islandY = useTransform(scrollY, [0, 120], [14, 8]);

  useEffect(() => setMobileOpen(false), [pathname]);

  // Smart navigation state: exact matches take priority over sectors
  const isSectorActive = pathname.startsWith("/enfermeria");
  const isExactNavMatch = navLinks.some(link => 
    link.href !== "/" && pathname.startsWith(link.href)
  );
  const showSectorPill = isSectorActive || (pathname.startsWith("/insumos") && !isExactNavMatch);

  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-50 flex justify-center pointer-events-none px-2 sm:px-4">
        
        {/* LA ISLA DINÁMICA - VERSIÓN ULTRA CREATIVA */}
        <motion.nav
          style={{ width: islandWidth, y: islandY }}
          className="pointer-events-auto relative w-full max-w-5xl rounded-[2rem] sm:rounded-[2.5rem] bg-white/40 backdrop-blur-2xl border border-white/60 shadow-[0_20px_40px_-10px_rgba(26,58,107,0.2),inset_0_1px_3px_rgba(255,255,255,0.8)] flex items-center justify-between px-2.5 sm:px-3 h-[66px] sm:h-[80px] transition-all duration-300 will-change-transform"
        >
          {/* Animated gradient glow */}
          <motion.div 
            className="absolute -inset-[1px] rounded-[2.6rem] bg-gradient-to-r from-[#2eb8d4]/20 via-[#1a3a6b]/15 to-[#2eb8d4]/20 -z-10 pointer-events-none blur-[2px]"
            animate={{ opacity: [0.4, 0.7, 0.4] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* LEFT: Logo Group */}
          <Link href="/" className="relative flex items-center gap-1 -ml-4 sm:-ml-2 shrink-0 group">
            <Image
              src="/vitalife-logo.png"
              alt="Vital Life"
              width={220}
              height={220}
              className="h-[140px] sm:h-[180px] w-auto object-contain"
              priority
            />
            <div className="relative w-11 h-11 sm:w-14 sm:h-14 bg-white shadow-md rounded-full flex items-center justify-center overflow-hidden border border-gray-100 group-hover:scale-105 transition-transform -ml-12">
               <Image src="/Logo-MarcaGTO-oct22.png" alt="GTO" width={40} height={40} className="w-8 h-8 sm:w-10 sm:h-10 object-contain" />
            </div>
          </Link>

          {/* CENTER: Floating Nav Links */}
          <div className="hidden lg:flex items-center gap-1.5 p-1.5 rounded-full bg-white/20 backdrop-blur-md border border-white/40 shadow-inner">
            {navLinks.map((link) => {
              const isActive = link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
              const showPill = isActive; // show pill on exact nav match
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="relative group px-4 py-2 rounded-full"
                >
                  <span className={cn("relative z-10 text-sm font-bold transition-colors", showPill ? "text-[#1a3a6b]" : "text-[#1a3a6b]/60 group-hover:text-[#1a3a6b]")}>
                    {link.label}
                  </span>
                  {showPill && (
                    <motion.div
                      layoutId="active-pill"
                      className="absolute inset-0 bg-white rounded-full shadow-[0_2px_10px_rgba(26,58,107,0.08)]"
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.8, opacity: 0 }}
                      transition={{ type: "spring", stiffness: 300, damping: 25, mass: 0.8 }}
                      style={{ originX: 0.5, originY: 0.5 }}
                    />
                  )}
                </Link>
              );
            })}

            {/* SECTORES DROPDOWN */}
            <div
              className="relative"
              onMouseEnter={() => setDropdownOpen(true)}
              onMouseLeave={() => setDropdownOpen(false)}
            >
              <button className="relative group px-4 py-2 rounded-full flex items-center gap-1">
                <span className={cn("relative z-10 text-sm font-bold flex items-center gap-1", showSectorPill ? "text-[#1a3a6b]" : "text-[#1a3a6b]/60 group-hover:text-[#1a3a6b]")}>
                  Sectores
                  <ChevronDown className={cn("w-3.5 h-3.5 transition-transform", dropdownOpen && "rotate-180 text-[#2eb8d4]")} />
                </span>
                {showSectorPill && (
                  <motion.div
                    layoutId="active-pill"
                    className="absolute inset-0 bg-white rounded-full shadow-[0_2px_10px_rgba(26,58,107,0.08)]"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 25, mass: 0.8 }}
                    style={{ originX: 0.5, originY: 0.5 }}
                  />
                )}
              </button>

              <AnimatePresence>
                {dropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 15 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 10 }}
                    className="absolute top-[120%] left-1/2 -translate-x-1/2 w-56 bg-white/90 backdrop-blur-2xl p-2 rounded-3xl border border-white/60 shadow-2xl"
                  >
                    {sectoresMenu.map((item) => (
                      <Link key={item.href} href={item.href} className="flex items-center gap-3 p-3 rounded-2xl hover:bg-[#e8f4fd] transition-colors group">
                        <div className="w-8 h-8 rounded-full bg-[#1a3a6b]/5 flex items-center justify-center group-hover:bg-white transition-colors">
                          <item.icon className="w-4 h-4 text-[#2eb8d4]" />
                        </div>
                        <span className="text-sm font-bold text-[#1a3a6b]">{item.label}</span>
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* RIGHT: Actions */}
          <div className="flex items-center gap-1.5 sm:gap-2 pr-1 shrink-0">
            {/* Vender / Cotizar Highlight Button */}
            <Link
              href="/contacto"
              className="hidden lg:flex items-center gap-1.5 bg-gradient-to-r from-[#2eb8d4] to-[#1a3a6b] text-white px-4 py-2.5 rounded-full text-xs font-black uppercase tracking-wide hover:shadow-lg hover:shadow-[#2eb8d4]/30 transition-all hover:-translate-y-0.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#e8f4fd]" /> Cotizar Ahora
            </Link>

            <Link
              href="/carrito"
              className="relative p-2.5 sm:p-3 rounded-full bg-white/40 hover:bg-white transition-colors text-[#1a3a6b] shadow-sm border border-white/50"
            >
              <ShoppingCart className="w-5 h-5" />
              <AnimatePresence>
                {itemCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                    className="absolute -top-1 -right-1 w-5 h-5 bg-[#ff4757] rounded-full text-white text-[10px] font-black flex items-center justify-center shadow-md shadow-[#ff4757]/40 ring-2 ring-white"
                  >
                    {itemCount > 9 ? "9+" : itemCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>

            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden p-2.5 sm:p-3 rounded-full bg-white/40 hover:bg-white text-[#1a3a6b] border border-white/50 shadow-sm"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </motion.nav>
      </div>

      {/* MOBILE MENU */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="fixed inset-0 z-[60] lg:hidden flex justify-center p-3 sm:p-4 pt-[90px]"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          >
            <div className="absolute inset-0 bg-[#1a3a6b]/35 backdrop-blur-md" onClick={() => setMobileOpen(false)} />
            <motion.div
              initial={{ y: -22, scale: 0.95, opacity: 0.8 }} animate={{ y: 0, scale: 1, opacity: 1 }} exit={{ y: -10, scale: 0.96, opacity: 0.9 }}
              transition={{ type: "spring", stiffness: 260, damping: 24 }}
              className="relative w-full max-w-sm bg-white/95 backdrop-blur-xl rounded-[2rem] shadow-2xl p-4 sm:p-5 border border-white space-y-2 h-fit"
            >
              <div className="flex justify-between items-center mb-4">
                <span className="font-black text-[#1a3a6b] text-lg px-2">Menú Principal</span>
                <button onClick={() => setMobileOpen(false)} className="p-2 bg-gray-100 rounded-full text-[#1a3a6b]">
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href} className="block px-4 py-3 bg-gray-50 hover:bg-[#e8f4fd] rounded-2xl text-base font-bold text-[#1a3a6b] transition-colors">{link.label}</Link>
              ))}
              <div className="w-full h-px bg-gray-100 my-2" />
              {sectoresMenu.map(sec => (
                <Link key={sec.href} href={sec.href} className="flex items-center gap-3 px-4 py-3 bg-gray-50 hover:bg-[#e8f4fd] rounded-2xl text-sm font-bold text-[#1a3a6b] transition-colors">
                  <sec.icon className="w-4 h-4 text-[#2eb8d4]" /> {sec.label}
                </Link>
              ))}
              <div className="pt-4">
                <Link onClick={() => setMobileOpen(false)} href="/contacto" className="w-full flex items-center justify-center gap-2 bg-[#2eb8d4] text-white py-3.5 rounded-2xl font-black uppercase text-sm shadow-lg shadow-[#2eb8d4]/30">
                  Cotizar / Llamar
                </Link>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

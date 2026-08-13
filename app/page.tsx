"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  Shield, Clock, Award, Users, Package, Home, Activity, ChevronRight, CheckCircle2,
  ShieldCheck, Truck, PackageCheck, HeartPulse, Building2, ShoppingBag, ArrowRight
} from "lucide-react";
import FadeInWhenVisible from "@/components/animations/FadeInWhenVisible";
import { brands } from "@/data/brands";

const brandLogoById: Record<string, string> = {
  "3m": "https://qczoqkhgphlhomcscnsk.supabase.co/storage/v1/object/public/logosmarcas/3mlogo.png",
  ambiderm: "https://qczoqkhgphlhomcscnsk.supabase.co/storage/v1/object/public/logosmarcas/ambidermlogo.jpg",
  bd: "https://qczoqkhgphlhomcscnsk.supabase.co/storage/v1/object/public/logosmarcas/LOGO-bd.png",
  "b-braun": "https://qczoqkhgphlhomcscnsk.supabase.co/storage/v1/object/public/logosmarcas/logobbrown.webp",
  covidien: "https://qczoqkhgphlhomcscnsk.supabase.co/storage/v1/object/public/logosmarcas/covidienlogo.webp",
  respifix: "https://qczoqkhgphlhomcscnsk.supabase.co/storage/v1/object/public/logosmarcas/respifix-logov2.webp",
};

export default function HomePage() {
  return (
    <div className="-mt-[96px] overflow-x-hidden">
      <HeroSection />
      <StatsBar />
      <PromocionesSection />
      <CategoriasSection />
      <TopDestacadosSection />
      <TopMarcasSection />
      <SectoresSection />
      <SobreNosotrosSection />
    </div>
  );
}

// ─────────────────────────────────────────────
// HERO
// ─────────────────────────────────────────────
function HeroSection() {
  return (
    <section className="relative min-h-[88svh] sm:min-h-screen flex items-center overflow-hidden">
      {/* Hero background image — full bleed to top */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/fondooficial.png"
          alt="Insumos médicos Vital Life"
          fill
          priority
          className="object-cover object-[80%_center] brightness-[0.95] contrast-110 saturate-110"
          quality={95}
        />
        {/* Gradient overlay to ensure text readability *EVERYWHERE* */}
        <div className="absolute inset-0 bg-gradient-to-r from-white/82 via-white/48 to-transparent sm:via-white/35 sm:to-transparent" />
        <div className="hero-aurora absolute inset-0" />
        <div className="hero-grid absolute inset-0" />
        {/* Extra layer of blur behind the text container only */}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-[120px] sm:pt-[132px] pb-16 sm:pb-20 lg:pb-28 w-full">
        <div className="grid lg:grid-cols-2 gap-12 sm:gap-16 items-center">
          {/* LEFT — Copy */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative max-w-3xl"
          >
            {/* Pill badge */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="inline-flex items-center gap-2 px-4 py-2 mb-8 bg-white/70 backdrop-blur-md rounded-2xl shadow-[0_8px_30px_rgb(26,58,107,0.1)] border border-white"
            >
              <span className="w-2.5 h-2.5 rounded-full bg-[#ff4757] animate-pulse" />
              <span className="text-[11px] font-black text-[#1a3a6b] tracking-widest uppercase">
                VENTA MUNDIAL · MAYOREO Y MENUDEO
              </span>
            </motion.div>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-[#1a3a6b] leading-[1.04] mb-6 drop-shadow-sm text-balance">
              Cotiza y compra <br className="hidden sm:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2eb8d4] to-[#1a3a6b]">al mejor precio</span>
            </h1>

            <p className="text-[#1a3a6b]/80 font-bold text-base sm:text-lg leading-relaxed mb-9 sm:mb-10 max-w-xl drop-shadow-sm">
              Cotiza al instante más de 20 marcas líderes. Envíos veloces a todo México, precios por volumen y atención certificada 24/7.
            </p>

            <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3 sm:gap-4 relative z-20 max-w-xl">
              <Link
                href="/insumos"
                className="bg-gradient-to-r from-[#ff4757] to-[#e84118] text-white px-6 sm:px-8 py-4 rounded-2xl font-black hover:shadow-2xl hover:shadow-[#ff4757]/40 hover:-translate-y-1 transition-all duration-300 uppercase text-sm tracking-wide flex items-center justify-center gap-2 min-h-12"
              >
                Comprar ahora <ChevronRight className="w-5 h-5" />
              </Link>
              <Link
                href="/insumos"
                className="bg-white/80 backdrop-blur-md px-6 sm:px-8 py-4 rounded-2xl text-[#1a3a6b] font-black border border-white hover:bg-white hover:shadow-xl hover:shadow-[#1a3a6b]/10 transition-all duration-300 flex items-center justify-center gap-2 uppercase tracking-wide text-sm min-h-12"
              >
                <ShoppingBag className="w-5 h-5" /> Ver Catálogo
              </Link>
              <Link
                href="/contacto"
                className="bg-white/80 backdrop-blur-md px-6 sm:px-8 py-4 rounded-2xl text-[#1a3a6b] font-black border border-white hover:bg-white hover:shadow-xl hover:shadow-[#1a3a6b]/10 transition-all duration-300 flex items-center justify-center gap-2 uppercase tracking-wide text-sm min-h-12"
              >
                Escríbenos
              </Link>
            </div>

            {/* Trust row */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-x-6 gap-y-4 mt-8 sm:mt-10 pt-7 sm:pt-8 border-t border-[#1a3a6b]/20"
            >
              {[
                { label: "+20 Marcas", sub: "distribuidas" },
                { label: "Mayoreo", sub: "disponible" },
                { label: "Envíos", sub: "a todo México" },
              ].map((item) => (
                <div key={item.label} className="min-w-[120px]">
                  <div className="font-black text-[#1a3a6b] text-lg leading-none">{item.label}</div>
                  <div className="text-[#1a3a6b]/70 text-xs font-bold mt-1">{item.sub}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* RIGHT — Static Logo column */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="hidden lg:flex justify-end items-start relative lg:-mt-60 lg:mr-72"
          >
            <div className="relative w-[200px] h-[200px] xl:w-[240px] xl:h-[240px] flex items-center justify-center">
              <Image
                src="/vitalife-logo.png"
                alt="Vital Life"
                fill
                className="object-cover scale-[2]"
                sizes="(max-width: 1280px) 200px, 240px"
                priority
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────
// STATS BAR
// ─────────────────────────────────────────────
function StatsBar() {
  const stats = [
    { icon: Shield, label: "Confianza certificada", value: "100%" },
    { icon: Clock, label: "Disponibilidad", value: "24/7" },
    { icon: Award, label: "Profesionales", value: "50+" },
    { icon: Users, label: "Pacientes atendidos", value: "1,200+" },
  ];
  return (
    <section className="relative py-6 z-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="liquid-glass grid grid-cols-2 lg:grid-cols-4 divide-x divide-white/30">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="flex flex-col sm:flex-row items-center gap-3 px-6 py-5"
            >
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#1a3a6b] to-[#2eb8d4] flex items-center justify-center shadow-lg flex-shrink-0">
                <stat.icon className="w-5 h-5 text-white" />
              </div>
              <div className="text-center sm:text-left">
                <div className="font-black text-[#1a3a6b] text-2xl leading-none">{stat.value}</div>
                <div className="text-[#1a3a6b]/55 text-xs font-medium mt-0.5">{stat.label}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────
// PROMOCIONES
// ─────────────────────────────────────────────
function PromocionesSection() {
  const promos = [
    {
      title: "Guantes de Nitrilo",
      subtitle: "Caja 100 pzs",
      oldPrice: 245,
      newPrice: 189,
      badge: "-23%",
      slug: "guantes-nitrilo-100pcs",
      image: "https://qczoqkhgphlhomcscnsk.supabase.co/storage/v1/object/public/VITALIFE/guante-de-nitrilo_ambiderm.png",
      color: "from-[#ff4757] to-[#e84118]",
    },
    {
      title: "Gel Antibacterial",
      subtitle: "500ml",
      oldPrice: 120,
      newPrice: 85,
      badge: "-29%",
      slug: "gel-antibacterial",
      image: "https://qczoqkhgphlhomcscnsk.supabase.co/storage/v1/object/public/VITALIFE/catalog/gel-antibacterial.webp",
      color: "from-[#2eb8d4] to-[#1a8fa8]",
    },
    {
      title: "Jeringas 5ml",
      subtitle: "Paquete 10 pzs",
      oldPrice: 89,
      newPrice: 65,
      badge: "-27%",
      slug: "jeringas-5ml-10pcs",
      image: "https://qczoqkhgphlhomcscnsk.supabase.co/storage/v1/object/public/VITALIFE/jeringas_sensimedical.png",
      color: "from-[#1a3a6b] to-[#2251a3]",
    },
  ];

  return (
    <section className="py-20 relative overflow-hidden bg-gradient-to-br from-[#fff5f5] via-white to-[#f0fbfd]">
      {/* Decorative blobs */}
      <div className="ambient-blob w-[400px] h-[400px] top-[-100px] left-[-100px] bg-[rgba(255,71,87,0.08)]" />
      <div className="ambient-blob w-[300px] h-[300px] bottom-[-50px] right-[-50px] bg-[rgba(46,184,212,0.08)]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <FadeInWhenVisible>
          <div className="text-center mb-14">
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-[#ff4757]/10 text-[#ff4757] rounded-full text-xs font-black uppercase tracking-widest mb-4">
              <span className="w-2 h-2 bg-[#ff4757] rounded-full animate-pulse" />
              Ofertas por tiempo limitado
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-[#1a3a6b] mt-3">
              Promociones <span className="text-[#ff4757]">Especiales</span>
            </h2>
            <p className="text-[#1a3a6b]/55 mt-3 max-w-lg mx-auto text-base">
              Aprovecha descuentos exclusivos en insumos médicos. Precios válidos hasta agotar existencias.
            </p>
          </div>
        </FadeInWhenVisible>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {promos.map((promo, i) => (
            <FadeInWhenVisible key={promo.title} delay={i * 0.12}>
              <motion.div
                whileHover={{ y: -8, scale: 1.01 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="relative bg-white rounded-[2rem] p-6 sm:p-7 border border-gray-100 shadow-[0_20px_50px_-15px_rgba(26,58,107,0.12)] overflow-hidden group"
              >
                {/* Discount ribbon */}
                <div className="absolute top-0 right-0">
                  <div className={`bg-gradient-to-br ${promo.color} text-white text-xs font-black px-4 py-2 rounded-bl-2xl rounded-tr-[2rem] shadow-lg`}>
                    {promo.badge}
                  </div>
                </div>

                {/* Decorative circle */}
                <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-gradient-to-br from-[#2eb8d4]/5 to-transparent group-hover:scale-110 transition-transform duration-500" />

                <div className="relative z-10">
                  <Link
                    href={`/productos/${promo.slug}`}
                    className="relative mb-6 block h-40 overflow-hidden rounded-2xl bg-white"
                    aria-label={`Ver ${promo.title}`}
                  >
                    <Image
                      src={promo.image}
                      alt={promo.title}
                      fill
                      className="object-contain p-3 transition-transform duration-300 group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  </Link>

                  <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">INSUMOS MÉDICOS</div>
                  <h3 className="font-black text-[#1a3a6b] text-xl mb-1 group-hover:text-[#2eb8d4] transition-colors">{promo.title}</h3>
                  <p className="text-gray-500 text-sm mb-5">{promo.subtitle}</p>

                  <div className="flex items-end gap-3 mb-6">
                    <span className="text-3xl font-black text-[#ff4757]">${promo.newPrice}</span>
                    <span className="text-lg text-gray-400 line-through font-medium mb-1">${promo.oldPrice}</span>
                  </div>

                  <Link
                    href={`/productos/${promo.slug}`}
                    className="flex items-center justify-center gap-2 w-full py-3.5 bg-gradient-to-r from-[#1a3a6b] to-[#2251a3] text-white rounded-2xl text-sm font-black hover:shadow-xl hover:shadow-[#1a3a6b]/20 hover:-translate-y-0.5 transition-all duration-300"
                  >
                    <ShoppingBag className="w-4 h-4" /> Comprar ahora
                  </Link>
                </div>
              </motion.div>
            </FadeInWhenVisible>
          ))}
        </div>

        <FadeInWhenVisible delay={0.3}>
          <div className="mt-12 text-center">
            <Link
              href="/insumos"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl border-2 border-[#1a3a6b]/15 text-[#1a3a6b] font-bold hover:bg-[#1a3a6b] hover:text-white hover:border-[#1a3a6b] transition-all duration-300 hover:shadow-2xl hover:shadow-[#1a3a6b]/10 glass-card"
            >
              Ver todas las promociones
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </FadeInWhenVisible>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────
// SECTORES
// ─────────────────────────────────────────────
function SectoresSection() {
  const cards = [
    {
      icon: Package,
      title: "Insumos Médicos",
      desc: "Distribuidores autorizados de las mejores marcas médicas. +20 marcas y +500 referencias en almacén.",
      features: ["Productos certificados", "Entrega el mismo día", "Compra con carrito"],
      href: "/insumos",
      gradient: "from-[#1a3a6b] to-[#2251a3]",
    },
    {
      icon: Activity,
      title: "Enfermería y Fisioterapia",
      desc: "Atención domiciliaria, rehabilitación física y cuidado personalizado para tu recuperación.",
      features: ["Atención domiciliaria", "Rehabilitación física", "Cuidado personalizado"],
      href: "/enfermeria",
      gradient: "from-[#1a6b5a] to-[#2eb89a]",
    },
  ];

  return (
    <section className="py-24 lg:py-32 relative overflow-hidden">
      <div className="ambient-blob w-[400px] h-[400px] bottom-[-100px] right-[-100px] bg-[rgba(46,184,212,0.10)]" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <FadeInWhenVisible>
          <div className="text-center mb-16">
            <span className="inline-flex items-center gap-2 glass-card px-4 py-1.5 text-xs font-bold text-[#2eb8d4] uppercase tracking-widest mb-4">
              <span className="w-1.5 h-1.5 bg-[#2eb8d4] rounded-full" />
              Nuestros Servicios
            </span>
            <h2 className="text-4xl sm:text-5xl font-black text-[#1a3a6b] mt-4">
              Soluciones integrales
              <br />
              <span className="shimmer-text">para cada necesidad</span>
            </h2>
          </div>
        </FadeInWhenVisible>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {cards.map((card, i) => (
            <FadeInWhenVisible key={card.title} delay={i * 0.12}>
              <motion.div
                whileHover={{ y: -8, scale: 1.01 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="glass-card overflow-hidden flex flex-col h-full group"
              >
                {/* Gradient banner */}
                <div className={`bg-gradient-to-br ${card.gradient} p-6 relative overflow-hidden`}>
                  <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-white/10 blur-sm" />
                  <div className="relative z-10 flex items-center justify-between">
                    <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center shadow-lg">
                      <card.icon className="w-7 h-7 text-white" />
                    </div>
                    <ChevronRight className="w-5 h-5 text-white/60 group-hover:text-white group-hover:translate-x-1 transition-all" />
                  </div>
                </div>

                <div className="p-7 flex flex-col flex-1">
                  <h3 className="font-black text-[#1a3a6b] text-xl mb-3">{card.title}</h3>
                  <p className="text-[#1a3a6b]/60 text-sm leading-relaxed mb-5 flex-1">{card.desc}</p>
                  <ul className="space-y-2.5 mb-6">
                    {card.features.map((f) => (
                      <li key={f} className="flex items-center gap-2.5 text-sm text-[#1a3a6b]/75 font-medium">
                        <CheckCircle2 className="w-4 h-4 text-[#2eb8d4] flex-shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={card.href}
                    className="inline-flex items-center gap-1.5 text-[#1a3a6b] text-sm font-bold hover:text-[#2eb8d4] transition-colors"
                  >
                    Conocer más <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </motion.div>
            </FadeInWhenVisible>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────
// SOBRE NOSOTROS
// ─────────────────────────────────────────────
function SobreNosotrosSection() {
  const pillars = [
    {
      icon: HeartPulse,
      title: "Calidez en el servicio",
      desc: "Atendemos a cada persona con empatía, respeto y un trato verdaderamente humano.",
    },
    {
      icon: Award,
      title: "Equipo multidisciplinario",
      desc: "Médicos, enfermeros, fisioterapeutas y nutriólogos certificados trabajando juntos.",
    },
    {
      icon: Building2,
      title: "Instalaciones de primer nivel",
      desc: "Espacios diseñados para el bienestar físico y emocional de nuestros pacientes.",
    },
  ];

  return (
    <section className="py-24 lg:py-32 relative overflow-hidden">
      {/* Deeper bg for this section */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#1a3a6b]/5 via-transparent to-[#2eb8d4]/5" />
      <div className="ambient-blob w-[500px] h-[500px] top-0 left-0 bg-[rgba(26,58,107,0.06)]" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeInWhenVisible>
          <div className="text-center mb-16">
            <span className="inline-flex items-center gap-2 glass-card px-4 py-1.5 text-xs font-bold text-[#2eb8d4] uppercase tracking-widest mb-4">
              <span className="w-1.5 h-1.5 bg-[#2eb8d4] rounded-full" />
              Sobre Nosotros
            </span>
            <h2 className="text-4xl sm:text-5xl font-black text-[#1a3a6b] mt-4">
              ¿Por qué elegir <span className="shimmer-text">Vital Life</span>?
            </h2>
            <p className="text-[#1a3a6b]/55 mt-4 max-w-xl mx-auto text-lg">
              Más de 10 años ofreciendo servicios médicos con calidad, calidez y compromiso en León, Gto.
            </p>
          </div>
        </FadeInWhenVisible>

        <div className="grid md:grid-cols-3 gap-8 mb-14">
          {pillars.map((p, i) => (
            <FadeInWhenVisible key={p.title} delay={i * 0.12}>
              <motion.div
                whileHover={{ y: -6 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="liquid-glass p-8 text-center"
              >
                <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-br from-[#1a3a6b]/5 to-[#2eb8d4]/10 flex items-center justify-center mb-5 animate-float shadow-inner" style={{ animationDelay: `${i * 0.6}s` }}>
                  <p.icon className="w-8 h-8 text-[#1a3a6b]" />
                </div>
                <h3 className="font-black text-[#1a3a6b] text-lg mb-3">{p.title}</h3>
                <p className="text-[#1a3a6b]/60 text-sm leading-relaxed">{p.desc}</p>
              </motion.div>
            </FadeInWhenVisible>
          ))}
        </div>

        <FadeInWhenVisible delay={0.3}>
          <div className="text-center">
            <Link
              href="/nosotros"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl border-2 border-[#1a3a6b]/20 text-[#1a3a6b] font-bold hover:bg-[#1a3a6b] hover:text-white hover:border-[#1a3a6b] transition-all duration-300 hover:shadow-2xl hover:shadow-[#1a3a6b]/20 glass-card"
            >
              Conocer más sobre nosotros
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </FadeInWhenVisible>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────
// TOP DESTACADOS (FOCUS ON SALES)
// ─────────────────────────────────────────────
function TopDestacadosSection() {
  const destacadas = [
    { title: "Guantes de Nitrilo", cat: "Protección", price: "Cotizar por volumen", icon: ShieldCheck, imgId: 1 },
    { title: "Jeringas 3ml BD", cat: "Aplicación", price: "Cotizar por volumen", icon: HeartPulse, imgId: 2 },
    { title: "Solución Salina 1000ml", cat: "Fluidos", price: "Cotizar por volumen", icon: Activity, imgId: 3 },
    { title: "Apósitos Tegaderm", cat: "Curación", price: "Cotizar por volumen", icon: CheckCircle2, imgId: 4 },
  ];

  return (
    <section className="py-20 bg-white relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <span className="inline-flex items-center gap-2 px-3 py-1 bg-[#ff4757]/10 text-[#ff4757] rounded-full text-xs font-black uppercase tracking-widest mb-3">
              <span className="w-1.5 h-1.5 bg-[#ff4757] rounded-full animate-pulse" />
              Más Vendidos
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#1a3a6b]">
              Productos <span className="text-[#2eb8d4]">Destacados</span>
            </h2>
          </div>
          <Link href="/insumos" className="inline-flex items-center gap-2 text-[#1a3a6b] font-bold hover:text-[#2eb8d4] transition-colors group">
            Ver catálogo completo <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {destacadas.map((prod, i) => (
            <motion.div
              key={prod.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -8 }}
              className="bg-white rounded-3xl p-5 border border-gray-100 shadow-[0_8px_30px_-12px_rgba(26,58,107,0.12)] group relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#2eb8d4]/5 to-transparent rounded-bl-[100px] -z-10 transition-transform group-hover:scale-110" />
              
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#1a3a6b]/5 to-[#1a3a6b]/10 flex items-center justify-center mb-6">
                <prod.icon className="w-8 h-8 text-[#1a3a6b]" />
              </div>
              
              <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{prod.cat}</div>
              <h3 className="font-black text-[#1a3a6b] text-lg leading-tight mb-2 group-hover:text-[#2eb8d4] transition-colors">{prod.title}</h3>
              <div className="text-sm font-bold text-[#ff4757] mb-5">{prod.price}</div>
              
              <Link href="/contacto" className="flex items-center justify-center gap-2 w-full py-3 bg-[#1a3a6b]/5 hover:bg-[#2eb8d4] text-[#1a3a6b] hover:text-white rounded-xl text-sm font-bold transition-all duration-300">
                <ShoppingBag className="w-4 h-4" /> Solicitar
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────
// TOP MARCAS
// ─────────────────────────────────────────────
function TopMarcasSection() {
  const displayBrands = brands.slice(0, 6); // Grab the first 6 brands

  return (
    <section className="py-16 md:py-24 relative overflow-hidden bg-gray-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-black text-[#1a3a6b]">
            Trabajamos con las <span className="shimmer-text">mejores marcas</span>
          </h2>
          <p className="text-[#1a3a6b]/55 mt-3 max-w-xl mx-auto">
            Garantizamos la calidad y seguridad de todos nuestros insumos con distribuidores oficiales y certificados.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
          {displayBrands.map((b, i) => (
            <motion.div
              key={b.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ scale: 1.05 }}
              className="bg-white rounded-2xl p-6 flex flex-col items-center justify-center gap-3 border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-[#2eb8d4]/10 transition-all duration-300 group cursor-pointer"
            >
              <Link href={`/insumos/${b.id}`} className="absolute inset-0 z-10" aria-label={`Ver marca ${b.name}`} />
              <div className="relative h-16 w-32 shrink-0">
                {brandLogoById[b.id] ? (
                  <Image
                    src={brandLogoById[b.id]}
                    alt={`Logo ${b.name}`}
                    fill
                    sizes="128px"
                    className="object-contain"
                  />
                ) : (
                  <div className={`h-14 w-14 rounded-full bg-gradient-to-br ${b.gradient} flex items-center justify-center shadow-lg mx-auto`}>
                    <span className="text-white font-black text-sm">{b.name.slice(0, 3)}</span>
                  </div>
                )}
              </div>
              <div className="text-center">
                <div className="text-sm font-black text-[#1a3a6b] group-hover:text-[#2eb8d4] transition-colors">{b.name}</div>
                <div className="text-[10px] font-bold text-gray-400 mt-0.5">{b.families.length} Líneas</div>
              </div>
            </motion.div>
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <Link href="/insumos" className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[#1a3a6b] to-[#2251a3] text-white px-8 py-4 rounded-2xl font-black shadow-lg shadow-[#1a3a6b]/20 hover:shadow-xl hover:shadow-[#2eb8d4]/30 hover:-translate-y-1 transition-all duration-300">
            Explorar todas las marcas <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────
// CATEGORIAS PRINCIPALES
// ─────────────────────────────────────────────
function CategoriasSection() {
  const categorias = [
    { name: "Equipo Quirúrgico", img: "/equipo-quirurgico.png", href: "/insumos?cat=equipo-quirurgico" },
    { name: "Diagnóstico", img: "/diagnostico.png", href: "/insumos?cat=diagnostico" },
    { name: "Guantes", img: "/guantes.png", href: "/insumos?cat=guantes" },
    { name: "Material de Curación", img: "/material-curacion.png", href: "/insumos?cat=material-curacion" },
    { name: "Sondas y Catéteres", img: "/sondas-cateteres.png", href: "/insumos?cat=sondas" },
    { name: "Vías IV", img: "/vias-iv.png", href: "/insumos?cat=vias-iv" },
    { name: "Rehabilitación", img: "/rehabilitacion.png", href: "/insumos?cat=rehabilitacion" },
    { name: "Ventilación", img: "/ventilacion.png", href: "/insumos?cat=ventilacion" },
    { name: "Misceláneos", img: "/miscelaneos.png", href: "/insumos?cat=miscelaneos" },
  ];

  return (
    <section className="py-20 relative bg-[#f8fafc] overflow-hidden border-t-2 border-white">
      <div className="ambient-blob w-[500px] h-[500px] bottom-0 right-[-100px] bg-[rgba(46,184,212,0.06)]" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-14">
          <span className="inline-flex items-center gap-2 px-3 py-1 bg-[#1a3a6b]/5 text-[#1a3a6b] rounded-full text-xs font-black uppercase tracking-widest mb-3">
            <span className="w-1.5 h-1.5 bg-[#ff4757] rounded-full animate-pulse" />
            Explora por línea
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-[#1a3a6b]">
            Categorías <span className="text-[#2eb8d4]">Principales</span>
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6 auto-rows-fr">
          {categorias.map((cat, i) => {
            const isLarge = i === 0 || i === 3; // Make some items span larger
            return (
              <motion.div
                key={cat.name}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className={`${isLarge ? "col-span-2 row-span-2" : "col-span-1 row-span-1"} relative group rounded-[2rem] overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-[#2eb8d4]/30 transition-all duration-500 min-h-[160px] sm:min-h-[200px] flex`}
              >
                <Link href={cat.href} className="absolute inset-0 z-20" aria-label={"Navegar a " + cat.name} />
                <Image
                  src={cat.img}
                  alt={cat.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1a3a6b]/80 via-[#1a3a6b]/10 to-transparent opacity-70 group-hover:opacity-100 transition-opacity" />
                <div className="absolute bottom-0 left-0 right-0 p-5 flex items-end justify-between z-10 translate-y-2 group-hover:translate-y-0 transition-transform">
                  <h3 className={`text-white font-black leading-tight drop-shadow-md ${isLarge ? 'text-2xl' : 'text-lg'}`}>{cat.name}</h3>
                  <div className="w-8 h-8 rounded-full bg-[#ff4757] text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all transform scale-50 group-hover:scale-100 shrink-0">
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

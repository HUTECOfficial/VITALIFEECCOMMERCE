"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  Shield, Clock, Award, Users, Activity, ChevronRight, CheckCircle2,
  ShieldCheck, HeartPulse, Building2, ShoppingBag, ArrowRight, Sparkles, Timer, BadgePercent
} from "lucide-react";
import FadeInWhenVisible from "@/components/animations/FadeInWhenVisible";
import IntrinsicImage from "@/components/ui/IntrinsicImage";
import { homepageBrandLogos, homepageCategoryBrandImageById } from "@/data/visualAssets";
import { categoryLabels } from "@/data/products";
import { useSiteContent } from "@/hooks/useSiteContent";
import { formatPrice } from "@/lib/utils";
import type { SiteContentSection } from "@/data/siteContent";
import type { Product } from "@/types";

export default function HomePage() {
  const content = useSiteContent("homepage");

  return (
    <div className="-mt-[96px] overflow-x-hidden">
      <HeroSection content={content.hero} />
      <StatsBar />
      <PromocionesSection
        featuredPromotion={content.featuredPromotion}
        promotions={[content.promotion1, content.promotion2, content.promotion3]}
      />
      <TopDestacadosSection content={content.featuredProductsHeader} />
      <CategoriasSection />
      <TopMarcasSection />
      <SectoresSection />
      <SobreNosotrosSection />
    </div>
  );
}

// ─────────────────────────────────────────────
// HERO
// ─────────────────────────────────────────────
function HeroSection({ content }: { content: SiteContentSection }) {
  const image = String(content.image);
  const eyebrow = String(content.eyebrow);
  const title = String(content.title);
  const highlightedTitle = String(content.highlightedTitle);
  const description = String(content.description);
  const primaryButtonLabel = String(content.primaryButtonLabel);
  const primaryButtonLink = String(content.primaryButtonLink);
  const secondaryButtonLabel = String(content.secondaryButtonLabel);
  const secondaryButtonLink = String(content.secondaryButtonLink);
  const contactButtonLabel = String(content.contactButtonLabel);
  const contactButtonLink = String(content.contactButtonLink);

  return (
    <section className="relative min-h-[88svh] sm:min-h-screen flex items-center overflow-hidden">
      {/* Hero background image — full bleed to top */}
      <div className="absolute inset-0 z-0">
        <Image
          src={image}
          alt={title}
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
        <div className="flex items-center">
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
                {eyebrow}
              </span>
            </motion.div>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-[#1a3a6b] leading-[1.04] mb-6 drop-shadow-sm text-balance">
              {title} <br className="hidden sm:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2eb8d4] to-[#1a3a6b]">{highlightedTitle}</span>
            </h1>

            <p className="text-[#1a3a6b]/80 font-bold text-base sm:text-lg leading-relaxed mb-9 sm:mb-10 max-w-xl drop-shadow-sm">
              {description}
            </p>

            <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3 sm:gap-4 relative z-20 max-w-xl">
              <Link
                href={primaryButtonLink}
                className="bg-gradient-to-r from-[#ff4757] to-[#e84118] text-white px-6 sm:px-8 py-4 rounded-2xl font-black hover:shadow-2xl hover:shadow-[#ff4757]/40 hover:-translate-y-1 transition-all duration-300 uppercase text-sm tracking-wide flex items-center justify-center gap-2 min-h-12"
              >
                {primaryButtonLabel} <ChevronRight className="w-5 h-5" />
              </Link>
              <Link
                href={secondaryButtonLink}
                className="bg-white/80 backdrop-blur-md px-6 sm:px-8 py-4 rounded-2xl text-[#1a3a6b] font-black border border-white hover:bg-white hover:shadow-xl hover:shadow-[#1a3a6b]/10 transition-all duration-300 flex items-center justify-center gap-2 uppercase tracking-wide text-sm min-h-12"
              >
                <ShoppingBag className="w-5 h-5" /> {secondaryButtonLabel}
              </Link>
              <Link
                href={contactButtonLink}
                className="bg-white/80 backdrop-blur-md px-6 sm:px-8 py-4 rounded-2xl text-[#1a3a6b] font-black border border-white hover:bg-white hover:shadow-xl hover:shadow-[#1a3a6b]/10 transition-all duration-300 flex items-center justify-center gap-2 uppercase tracking-wide text-sm min-h-12"
              >
                {contactButtonLabel}
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
function PromocionesSection({
  featuredPromotion,
  promotions,
}: {
  featuredPromotion: SiteContentSection;
  promotions: SiteContentSection[];
}) {
  const featuredEnabled = Boolean(featuredPromotion.enabled);
  const promoColors = [
    { gradient: "from-[#ff5263] to-[#d92f4f]", glow: "bg-[#ff5263]", soft: "from-[#ff5263]/20 to-[#ff8e55]/5" },
    { gradient: "from-[#2ed0d7] to-[#148ba9]", glow: "bg-[#2ed0d7]", soft: "from-[#2ed0d7]/20 to-[#7ce7d4]/5" },
    { gradient: "from-[#4877df] to-[#173c78]", glow: "bg-[#4877df]", soft: "from-[#4877df]/20 to-[#2eb8d4]/5" },
  ];
  const promos = promotions.map((promotion, index) => ({
    enabled: Boolean(promotion.enabled),
    title: String(promotion.title),
    subtitle: String(promotion.subtitle),
    oldPrice: Number(promotion.oldPrice),
    newPrice: Number(promotion.newPrice),
    badge: String(promotion.badge),
    link: String(promotion.link),
    image: String(promotion.image),
    color: promoColors[index],
  })).filter((promotion) => promotion.enabled);

  if (!featuredEnabled && promos.length === 0) return null;

  return (
    <section className="relative overflow-hidden bg-[#071a34] py-24 text-white lg:py-32">
      {/* Decorative blobs */}
      <div className="ambient-blob left-[-140px] top-[-160px] h-[460px] w-[460px] bg-[rgba(46,184,212,0.16)]" />
      <div className="ambient-blob bottom-[-180px] right-[-100px] h-[480px] w-[480px] bg-[rgba(255,82,99,0.13)]" />
      <div className="absolute inset-0 opacity-30 [background-image:linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] [background-size:54px_54px]" />
      <div className="absolute left-1/2 top-0 h-px w-2/3 -translate-x-1/2 bg-gradient-to-r from-transparent via-[#5de2eb]/60 to-transparent" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <FadeInWhenVisible>
          <div className="mb-12 grid items-end gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:mb-16">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-[#5de2eb]/25 bg-[#5de2eb]/10 px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-[#71e5ed]">
                <Sparkles className="h-4 w-4" /> Ofertas Vital Life
              </span>
              <h2 className="mt-5 max-w-3xl text-4xl font-black leading-[0.98] sm:text-5xl lg:text-7xl">
                Más cuidado para ti. <span className="bg-gradient-to-r from-[#67e2ea] to-[#86f0c3] bg-clip-text text-transparent">Menos en el precio.</span>
              </h2>
            </div>
            <div className="max-w-md lg:justify-self-end">
              <p className="text-base leading-relaxed text-white/60 sm:text-lg">
                Productos esenciales seleccionados con descuentos especiales para cuidar tu salud y tu presupuesto.
              </p>
              <div className="mt-5 inline-flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3 text-sm font-semibold text-white/80 backdrop-blur-sm">
                <Timer className="h-5 w-5 text-[#ff6675]" /> Disponibles hasta agotar existencias
              </div>
            </div>
          </div>
        </FadeInWhenVisible>

        {featuredEnabled && (
          <FadeInWhenVisible>
            <Link
              href={String(featuredPromotion.link)}
              className="group relative isolate mb-16 block overflow-hidden rounded-[2.5rem] border border-white/15 bg-[linear-gradient(125deg,#123a70_0%,#176994_54%,#2eb8d4_130%)] shadow-[0_35px_90px_-35px_rgba(46,184,212,0.55)] transition-all duration-500 hover:-translate-y-1 hover:border-white/25 focus:outline-none focus-visible:ring-4 focus-visible:ring-[#65e2eb]/50"
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_45%,rgba(122,238,227,0.38),transparent_27%),radial-gradient(circle_at_10%_0%,rgba(255,255,255,0.13),transparent_35%)]" />
              <div className="absolute -right-20 -top-24 h-96 w-96 rounded-full border border-white/10 bg-white/[0.04] transition-transform duration-700 group-hover:scale-110" />
              <div className="absolute -bottom-48 right-1/4 h-96 w-96 rounded-full border border-white/10" />
              <div className="absolute left-0 top-0 h-full w-1.5 bg-gradient-to-b from-[#ff6675] via-[#ffb65c] to-[#74e5cb]" />

              <div className="relative z-10 grid min-h-[430px] items-center gap-10 px-7 py-10 sm:px-10 lg:grid-cols-[1.05fr_0.95fr] lg:px-16 lg:py-12">
                <div className="max-w-xl">
                  <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-[11px] font-black uppercase tracking-[0.18em] text-white backdrop-blur-sm">
                    <span className="h-2 w-2 animate-pulse rounded-full bg-[#ff6b78] shadow-[0_0_14px_rgba(255,107,120,0.9)]" />
                    {String(featuredPromotion.eyebrow)}
                  </span>
                  <h3 className="max-w-xl text-4xl font-black leading-[1.02] text-white sm:text-5xl lg:text-6xl">
                    {String(featuredPromotion.title)} <span className="text-[#9ff4df]">{String(featuredPromotion.highlightedTitle)}</span>
                  </h3>
                  <p className="mt-5 max-w-lg text-base leading-relaxed text-white/70 sm:text-lg">
                    {String(featuredPromotion.description)}
                  </p>
                  <span className="mt-7 inline-flex items-center gap-3 rounded-2xl bg-white px-5 py-3.5 text-sm font-black uppercase tracking-wide text-[#123a70] shadow-xl shadow-[#071a34]/20 transition-all group-hover:bg-[#eaffff] group-hover:shadow-2xl">
                    {String(featuredPromotion.buttonLabel)} <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </div>

                <div className="relative mx-auto w-full max-w-[470px]">
                  <div className="absolute inset-8 rounded-full bg-[#77e5df]/30 blur-3xl" />
                  <IntrinsicImage
                    src={String(featuredPromotion.image)}
                    alt={String(featuredPromotion.title)}
                    sizes="(max-width: 1024px) 80vw, 470px"
                    fixedAspectRatio={16 / 9}
                    className="object-contain mix-blend-multiply drop-shadow-[0_28px_28px_rgba(5,27,60,0.4)] transition-transform duration-700 group-hover:scale-105 group-hover:-rotate-1"
                  />
                  <span className="absolute -right-1 -top-5 z-20 flex h-20 w-20 rotate-6 items-center justify-center rounded-[1.75rem] border-4 border-white/30 bg-[#ff5263] text-xl font-black text-white shadow-2xl shadow-[#ff5263]/35 sm:-right-4 sm:h-24 sm:w-24 sm:text-2xl">
                    {String(featuredPromotion.badge)}
                  </span>
                </div>
              </div>
            </Link>
          </FadeInWhenVisible>
        )}

        {promos.length > 0 && (
          <>
            <FadeInWhenVisible>
              <div className="mb-9 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                <div>
                  <span className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-[#ff7180]">
                    <BadgePercent className="h-4 w-4" /> Promociones activas
                  </span>
                  <h3 className="mt-2 text-3xl font-black text-white sm:text-4xl">Elige tu oferta favorita</h3>
                </div>
                <p className="max-w-md text-sm leading-relaxed text-white/50 sm:text-right">Precios especiales en productos seleccionados. Compra en línea de forma rápida y segura.</p>
              </div>
            </FadeInWhenVisible>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {promos.map((promo, i) => (
                <FadeInWhenVisible key={promo.title} delay={i * 0.12}>
                  <motion.div
                    whileHover={{ y: -10 }}
                    transition={{ type: "spring", stiffness: 280, damping: 20 }}
                    className="group relative h-full overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.065] p-5 shadow-[0_24px_55px_-25px_rgba(0,0,0,0.65)] backdrop-blur-sm sm:p-6"
                  >
                    {/* Discount ribbon */}
                    <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${promo.color.gradient}`} />
                    <div className="absolute right-4 top-4 z-20">
                      <div className={`rounded-full bg-gradient-to-br ${promo.color.gradient} px-4 py-2 text-xs font-black text-white shadow-lg`}>
                        {promo.badge} OFF
                      </div>
                    </div>

                    {/* Decorative circle */}
                    <div className={`absolute -right-20 -top-20 h-56 w-56 rounded-full bg-gradient-to-br ${promo.color.soft} blur-2xl transition-transform duration-700 group-hover:scale-125`} />

                    <div className="relative z-10 flex h-full flex-col">
                      <Link
                        href={promo.link}
                        className="relative mb-6 block overflow-hidden rounded-[1.5rem]"
                        aria-label={`Ver ${promo.title}`}
                      >
                        <IntrinsicImage
                          src={promo.image}
                          alt={promo.title}
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          fixedAspectRatio={16 / 9}
                          className="object-contain transition-transform duration-500 group-hover:scale-105"
                        />
                      </Link>

                      <div className="mb-2 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.18em] text-white/40">
                        <span className={`h-2 w-2 rounded-full ${promo.color.glow}`} /> Insumos médicos
                      </div>
                      <h3 className="text-2xl font-black text-white transition-colors group-hover:text-[#79e4eb]">{promo.title}</h3>
                      <p className="mt-1 text-sm text-white/50">{promo.subtitle}</p>

                      <div className="my-6 flex items-end gap-3">
                        <span className="text-4xl font-black tracking-tight text-white">{formatPrice(promo.newPrice)}</span>
                        <span className="mb-1 text-base font-medium text-white/35 line-through">{formatPrice(promo.oldPrice)}</span>
                      </div>

                      <Link
                        href={promo.link}
                        className={`mt-auto flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r ${promo.color.gradient} py-3.5 text-sm font-black text-white shadow-lg transition-all duration-300 hover:brightness-110 hover:shadow-xl`}
                      >
                        <ShoppingBag className="h-4 w-4" /> Comprar ahora
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
                  className="inline-flex items-center gap-2 rounded-2xl border border-white/15 bg-white/[0.06] px-8 py-4 font-bold text-white backdrop-blur-sm transition-all duration-300 hover:border-[#63dfe8]/40 hover:bg-[#63dfe8]/10 hover:text-[#86edf2]"
                >
                  Ver catálogo completo
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </FadeInWhenVisible>
          </>
        )}
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────
// SECTORES
// ─────────────────────────────────────────────
function SectoresSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#071a3d] via-[#123f73] to-[#167d99] py-24 lg:py-32">
      <div className="ambient-blob w-[400px] h-[400px] bottom-[-100px] right-[-100px] bg-[rgba(99,223,232,0.18)]" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <FadeInWhenVisible>
          <div className="text-center mb-16">
            <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-[#86edf2] backdrop-blur-sm">
              <span className="w-1.5 h-1.5 bg-[#2eb8d4] rounded-full" />
              Nuestros Servicios
            </span>
            <h2 className="mt-4 text-4xl font-black text-white sm:text-5xl">
              Soluciones integrales
              <br />
              <span className="text-[#86edf2]">para cada necesidad</span>
            </h2>
          </div>
        </FadeInWhenVisible>

        <FadeInWhenVisible delay={0.12}>
          <motion.div
            whileHover={{ y: -8, scale: 1.01 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="max-w-5xl mx-auto"
          >
            <Link
              href="/enfermeria"
              className="group relative block min-h-[420px] overflow-hidden rounded-[2rem] border border-white/70 shadow-[0_24px_60px_-20px_rgba(26,107,90,0.35)] focus:outline-none focus-visible:ring-4 focus-visible:ring-[#2eb89a]/40 sm:min-h-[360px]"
            >
              <Image
                src="/enfermeria-fisioterapia-banner.png"
                alt="Especialista apoyando a una paciente en rehabilitación física a domicilio"
                fill
                sizes="(max-width: 1024px) 100vw, 1024px"
                className="object-cover object-[68%_center] transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#063f39]/95 via-[#0b6559]/82 to-[#0b6559]/20 sm:via-[#0b6559]/62 sm:to-transparent" />
              <div className="relative z-10 flex min-h-[420px] max-w-xl flex-col justify-center p-8 text-white sm:min-h-[360px] sm:p-12">
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/30 bg-white/15 backdrop-blur-sm shadow-lg">
                  <Activity className="h-7 w-7" />
                </div>
                <p className="mb-3 text-xs font-black uppercase tracking-[0.2em] text-[#9ff4df]">Atención especializada</p>
                <h3 className="mb-4 text-3xl font-black leading-tight sm:text-4xl">Enfermería y Fisioterapia</h3>
                <p className="mb-7 max-w-md text-sm leading-relaxed text-white/85 sm:text-base">
                  Atención domiciliaria, rehabilitación física y renta de equipo médico para tu recuperación.
                </p>
                <ul className="mb-8 grid gap-2 text-sm font-bold sm:grid-cols-3 sm:gap-3">
                  {["Atención domiciliaria", "Rehabilitación física", "Renta de equipo médico"].map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-white/95">
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-[#9ff4df]" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <span className="inline-flex w-fit items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-black text-[#0b6559] shadow-lg transition-transform group-hover:translate-x-1">
                  Conocer más <ChevronRight className="h-4 w-4" />
                </span>
              </div>
            </Link>
          </motion.div>
        </FadeInWhenVisible>
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
function TopDestacadosSection({ content }: { content: SiteContentSection }) {
  const [featuredProducts, setFeaturedProducts] = useState<Product[] | null>(null);
  const fallbackProducts = [
    {
      title: "Guantes de Nitrilo",
      cat: "Protección",
      price: "Cotizar por volumen",
      slug: "guantes-nitrilo-100pcs",
      quoteOnly: true,
      icon: ShieldCheck,
      image: "https://qczoqkhgphlhomcscnsk.supabase.co/storage/v1/object/public/VITALIFE/guante-de-nitrilo_ambiderm.png",
    },
    {
      title: "Jeringas 3ml BD",
      cat: "Aplicación",
      price: "Cotizar por volumen",
      slug: "jeringa-3ml-21x32-c-100-ambiderm-amb043",
      quoteOnly: true,
      icon: HeartPulse,
      image: "https://qczoqkhgphlhomcscnsk.supabase.co/storage/v1/object/public/VITALIFE/catalog/jeringa-3ml-21x32-c-100-ambiderm-amb043.webp?v=ambiderm-official-20260801",
    },
    {
      title: "Solución Salina 1000ml",
      cat: "Fluidos",
      price: "Cotizar por volumen",
      slug: "solucion-cs-iny-0-9-1000ml-pisa003",
      quoteOnly: true,
      icon: Activity,
      image: "https://qczoqkhgphlhomcscnsk.supabase.co/storage/v1/object/public/VITALIFE/catalog/solucion-cs-iny-0-9-1000ml-pisa003.webp",
    },
    {
      title: "Apósitos Tegaderm",
      cat: "Curación",
      price: "Cotizar por volumen",
      slug: "tegaderm-aposito-10x12-c-50-1626-3m021",
      quoteOnly: true,
      icon: CheckCircle2,
      image: "https://qczoqkhgphlhomcscnsk.supabase.co/storage/v1/object/public/VITALIFE/catalog/tegaderm-aposito-10x12-c-50-1626-3m021.webp",
    },
  ];

  useEffect(() => {
    let active = true;
    fetch("/api/products", { cache: "no-store" })
      .then((response) => {
        if (!response.ok) throw new Error("No se pudieron cargar los productos destacados");
        return response.json();
      })
      .then((value: unknown) => {
        if (!Array.isArray(value)) throw new Error("La respuesta de productos no es válida");
        if (active) setFeaturedProducts((value as Product[]).filter((product) => Boolean(product.featured)).slice(0, 4));
      })
      .catch(() => undefined);
    return () => {
      active = false;
    };
  }, []);

  const icons = [ShieldCheck, HeartPulse, Activity, CheckCircle2];
  const destacadas = featuredProducts === null ? fallbackProducts : featuredProducts.map((product, index) => ({
    title: product.name,
    cat: categoryLabels[product.category],
    price: Boolean(product.quoteOnly) ? "Cotizar por volumen" : formatPrice(Number(product.price)),
    slug: product.slug,
    quoteOnly: Boolean(product.quoteOnly),
    icon: icons[index],
    image: product.image,
  }));

  return (
    <section className="py-20 bg-white relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <span className="inline-flex items-center gap-2 px-3 py-1 bg-[#ff4757]/10 text-[#ff4757] rounded-full text-xs font-black uppercase tracking-widest mb-3">
              <span className="w-1.5 h-1.5 bg-[#ff4757] rounded-full animate-pulse" />
              {String(content.eyebrow)}
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#1a3a6b]">
              {String(content.title)} <span className="text-[#2eb8d4]">{String(content.highlightedTitle)}</span>
            </h2>
          </div>
          <Link href={String(content.link)} className="inline-flex items-center gap-2 text-[#1a3a6b] font-bold hover:text-[#2eb8d4] transition-colors group">
            {String(content.linkLabel)} <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
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
              className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-[0_8px_30px_-12px_rgba(26,58,107,0.12)]"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#2eb8d4]/5 to-transparent rounded-bl-[100px] -z-10 transition-transform group-hover:scale-110" />

              <IntrinsicImage
                src={prod.image}
                alt={prod.title}
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                fixedAspectRatio={16 / 9}
                className="object-contain transition-transform duration-500 group-hover:scale-105"
              >
                <div className="absolute left-5 top-5 flex h-12 w-12 items-center justify-center rounded-2xl border border-white/70 bg-white/85 shadow-sm backdrop-blur-sm">
                  <prod.icon className="h-6 w-6 text-[#1a3a6b]" />
                </div>
              </IntrinsicImage>

              <div className="flex flex-1 flex-col p-5">
                <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{prod.cat}</div>
                <h3 className="font-black text-[#1a3a6b] text-lg leading-tight mb-2 group-hover:text-[#2eb8d4] transition-colors">{prod.title}</h3>
                <div className="text-sm font-bold text-[#ff4757] mb-5">{prod.price}</div>

                <Link href={`/productos/${prod.slug}`} className="mt-auto flex w-full items-center justify-center gap-2 rounded-xl bg-[#1a3a6b]/5 py-3 text-sm font-bold text-[#1a3a6b] transition-all duration-300 hover:bg-[#2eb8d4] hover:text-white">
                  <ShoppingBag className="w-4 h-4" /> {prod.quoteOnly ? "Solicitar" : "Comprar"}
                </Link>
              </div>
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

        <div
          className="overflow-hidden"
          style={{ maskImage: "linear-gradient(to right, transparent, black 5%, black 95%, transparent)", WebkitMaskImage: "linear-gradient(to right, transparent, black 5%, black 95%, transparent)" }}
          aria-label="Marcas disponibles"
        >
          <motion.div
            className="flex w-max"
            animate={{ x: ["0%", "-50%"] }}
            transition={{ duration: 36, repeat: Infinity, ease: "linear" }}
          >
            {[0, 1].map((copy) => (
              <div key={copy} className="flex shrink-0 gap-5 pr-5 sm:gap-6 sm:pr-6" aria-hidden={copy === 1}>
                {homepageBrandLogos.map((brand) => (
                  <div key={`${copy}-${brand.id}`} className="w-[150px] shrink-0 sm:w-[180px]">
                    <IntrinsicImage
                      src={brand.src}
                      alt={`Logo ${brand.name}`}
                      sizes="(max-width: 640px) 150px, 180px"
                      fallbackAspectRatio={8 / 5}
                      wrapperClassName="rounded-2xl shadow-sm"
                    />
                  </div>
                ))}
              </div>
            ))}
          </motion.div>
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
    { name: "Equipo Quirúrgico", brand: "Ambiderm", img: homepageCategoryBrandImageById.quirurgico, href: "/insumos?brand=Ambiderm" },
    { name: "Diagnóstico", brand: "AMSA", img: homepageCategoryBrandImageById.diagnostico, href: "/insumos?brand=AMSA" },
    { name: "Guantes", brand: "Nipro", img: homepageCategoryBrandImageById.guantes, href: "/insumos?brand=Nipro" },
    { name: "Material de Curación", brand: "PiSA", img: homepageCategoryBrandImageById.curacion, href: "/insumos?brand=PISA" },
    { name: "Sondas y Catéteres", brand: "Atramat", img: homepageCategoryBrandImageById["sondas-cateteres"], href: "/insumos?brand=Atramat" },
    { name: "Vías IV", brand: "Edigar", img: homepageCategoryBrandImageById["terapia-iv"], href: "/insumos?brand=Edigar" },
    { name: "Rehabilitación", brand: "BD", img: homepageCategoryBrandImageById.rehabilitacion, href: "/insumos?brand=BD" },
    { name: "Ventilación", brand: "Vizcarra", img: homepageCategoryBrandImageById.respiratorio, href: "/insumos?brand=Vizcarra" },
    { name: "Misceláneos", brand: "Protec", img: homepageCategoryBrandImageById["atencion-paciente"], href: "/insumos?brand=Protec" },
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
                  alt={`${cat.brand} · ${cat.name}`}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                />

              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

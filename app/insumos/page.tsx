"use client";

import { useState, useMemo, useRef, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import {
  Hand, Wind, Droplets, Bandage, TestTube, Stethoscope,
  Dumbbell, Package2, Scissors, Syringe, Pill, Trash2,
  Shield, ShieldCheck, Award, Truck, UserCheck, ShoppingCart, ArrowRight,
} from "lucide-react";
import { brands, getBrandsByCategory, getTotalProducts } from "@/data/brands";
import { categoryLabels, products as localProducts } from "@/data/products";
import { brandCategoryToProductCategories, catalogCategoryBySlug, catalogCategoryOrder } from "@/data/catalogCategories";
import type { Brand } from "@/data/brands";
import type { Product } from "@/types";
import { formatPrice } from "@/lib/utils";
import { useClientCartCount } from "@/store/cartStore";
import { ShoppingCartButton } from "@/components/ui/ShoppingCartButton";
import { StockIndicator } from "@/components/ui/StockIndicator";
import { getProductNameParts } from "@/lib/product-name";

/* ── Category visual config ───────────────────────────── */
interface CatConfig { icon: LucideIcon; iconColor: string; iconBg: string; desc: string; img: string }

const catCfg: Record<Product["category"], CatConfig> = {
  guantes: {
    icon: Hand, iconColor: "text-[#1a3a6b]", iconBg: "bg-[#dbeeff]",
    desc: "Guantes estériles y no estériles de la más alta calidad.",
    img: "/guantes.png",
  },
  respiratorio: {
    icon: Wind, iconColor: "text-[#0e7490]", iconBg: "bg-[#cffafe]",
    desc: "Soluciones completas para soporte respiratorio.",
    img: "/ventilacion.png",
  },
  "terapia-iv": {
    icon: Droplets, iconColor: "text-[#1a3a6b]", iconBg: "bg-[#dbeeff]",
    desc: "Catéteres, cánulas y accesorios para terapia intravenosa.",
    img: "/vias-iv.png",
  },
  curacion: {
    icon: Bandage, iconColor: "text-[#2eb8d4]", iconBg: "bg-[#e0f7fa]",
    desc: "Todo lo necesario para el cuidado y curación de heridas.",
    img: "/material-curacion.png",
  },
  "sondas-cateteres": {
    icon: TestTube, iconColor: "text-[#1a3a6b]", iconBg: "bg-[#dbeeff]",
    desc: "Sondas y catéteres para diversas aplicaciones médicas.",
    img: "/sondas-cateteres.png",
  },
  diagnostico: {
    icon: Stethoscope, iconColor: "text-[#0e7490]", iconBg: "bg-[#cffafe]",
    desc: "Equipos y accesorios para diagnóstico confiable y preciso.",
    img: "/diagnostico.png",
  },
  rehabilitacion: {
    icon: Dumbbell, iconColor: "text-[#2eb8d4]", iconBg: "bg-[#e0f7fa]",
    desc: "Productos para apoyo en procesos de rehabilitación.",
    img: "/rehabilitacion.png",
  },
  "atencion-paciente": {
    icon: Package2, iconColor: "text-[#1a3a6b]", iconBg: "bg-[#dbeeff]",
    desc: "Artículos para higiene, comodidad y atención diaria del paciente.",
    img: "/miscelaneos.png",
  },
  quirurgico: {
    icon: Scissors, iconColor: "text-[#0e7490]", iconBg: "bg-[#cffafe]",
    desc: "Instrumental y equipos para procedimientos quirúrgicos.",
    img: "/equipo-quirurgico.png",
  },
  jeringas: {
    icon: Syringe, iconColor: "text-[#1a3a6b]", iconBg: "bg-[#dbeeff]",
    desc: "Agujas, jeringas y sistemas de punción estériles.",
    img: "/vias-iv.png",
  },
  antisepticos: {
    icon: Shield, iconColor: "text-[#2eb8d4]", iconBg: "bg-[#e0f7fa]",
    desc: "Soluciones antisépticas y desinfectantes certificados.",
    img: "/material-curacion.png",
  },
  medicamentos: {
    icon: Pill, iconColor: "text-[#1a3a6b]", iconBg: "bg-[#dbeeff]",
    desc: "Medicamentos y fármacos para uso profesional bajo indicación médica.",
    img: "/diagnostico.png",
  },
  "proteccion-desechables": {
    icon: ShieldCheck, iconColor: "text-[#0e7490]", iconBg: "bg-[#cffafe]",
    desc: "Cubrebocas, batas, campos y otros insumos de protección.",
    img: "/miscelaneos.png",
  },
  residuos: {
    icon: Trash2, iconColor: "text-[#2eb8d4]", iconBg: "bg-[#e0f7fa]",
    desc: "Contenedores, bolsas RPBI y material para manejo seguro de residuos.",
    img: "/miscelaneos.png",
  },
};

const FEATURED: Product["category"] = "guantes";
const REST = catalogCategoryOrder.filter((category) => category !== FEATURED);

/* ─────────────────────────────────────────────────────── */
export default function InsumosPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white" />}>
      <InsumosContent />
    </Suspense>
  );
}

function InsumosContent() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<Product["category"] | null>(null);
  // Keep a complete local catalog ready for the first search. The Supabase
  // catalog replaces it in the background once it has been downloaded.
  const [allProducts, setAllProducts] = useState<Product[]>(localProducts);
  const brandsRef = useRef<HTMLDivElement>(null);
  const cartCount = useClientCartCount();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const q = searchParams.get("q");
    if (q) setSearch(q);
  }, [searchParams]);

  useEffect(() => {
    const categoryParam = searchParams.get("cat");
    const category = categoryParam ? catalogCategoryBySlug[categoryParam] : undefined;
    const timeoutId = setTimeout(() => {
      setActiveCategory(category ?? null);
      if (category) brandsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, category ? 120 : 0);
    return () => clearTimeout(timeoutId);
  }, [searchParams]);

  useEffect(() => {
    fetch("/api/products", { cache: "no-store" })
      .then((res) => {
        if (!res.ok) throw new Error("No se pudo cargar el catálogo");
        return res.json();
      })
      .then((data: Product[]) => {
        if (data?.length) setAllProducts(data);
      })
      // The local catalog remains searchable if the refresh fails.
      .catch(() => undefined);
  }, []);

  const quickProducts = useMemo(() => allProducts.filter((p) => p.inStock).slice(0, 12), [allProducts]);

  const categoryProducts = useMemo(() => {
    if (!activeCategory) return [];
    return allProducts.filter((product) => product.category === activeCategory);
  }, [activeCategory, allProducts]);

  const filteredBrands = useMemo(() => {
    let result = brands;
    if (activeCategory) result = result.filter((brand) => brandCategoryToProductCategories[brand.category].includes(activeCategory));
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (b) =>
          b.name.toLowerCase().includes(q) ||
          b.description.toLowerCase().includes(q) ||
          b.category.toLowerCase().includes(q) ||
          b.families.some(
            (f) =>
              f.name.toLowerCase().includes(q) ||
              f.items.some((i) => i.toLowerCase().includes(q))
          )
      );
    }
    return result;
  }, [search, activeCategory]);

  const filteredProducts = useMemo(() => {
    if (!search.trim()) return [];
    const q = search.toLowerCase();
    return allProducts.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        categoryLabels[p.category].toLowerCase().includes(q)
    );
  }, [search, allProducts]);

  function handleCategoryClick(cat: Product["category"]) {
    const nextCategory = activeCategory === cat ? null : cat;
    setActiveCategory(nextCategory);
    router.replace(nextCategory ? `/insumos?cat=${nextCategory}` : "/insumos", { scroll: false });
    setTimeout(
      () => brandsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }),
      120
    );
  }

  function clearFilters() {
    setActiveCategory(null);
    setSearch("");
    router.replace("/insumos", { scroll: false });
  }

  return (
    <div className="min-h-screen bg-white">
      {/* ══ HERO ══════════════════════════════════════════ */}
      <section
        className="relative overflow-hidden"
        style={{ background: "linear-gradient(145deg,#cce8f5 0%,#ddf0fb 35%,#eef7fd 65%,#f8fcff 100%)" }}
      >
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M33 10h14v23h23v14H47v23H33V47H10V33h23z' fill='%231a3a6b'/%3E%3C/svg%3E\")",
            backgroundSize: "80px",
          }}
        />
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 pt-14 pb-14 text-center">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }}
            className="max-w-lg mx-auto mb-8">
            <div className="bg-white rounded-2xl shadow-xl shadow-[#1a3a6b]/10 border border-gray-100 flex items-center gap-3 px-5 py-4">
              <svg className="w-5 h-5 text-[#2eb8d4] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
              </svg>
              <input type="text" placeholder="Buscar marca, producto o categoría..."
                value={search} onChange={(e) => setSearch(e.target.value)}
                className="flex-1 bg-transparent text-[#1a3a6b] placeholder-[#1a3a6b]/40 text-base outline-none font-medium" />
              {search && (
                <button onClick={() => setSearch("")} className="text-[#1a3a6b]/40 hover:text-[#1a3a6b] transition-colors text-lg leading-none">✕</button>
              )}
            </div>
          </motion.div>

          {/* Los resultados aparecen inmediatamente debajo de la lupa. */}
          <AnimatePresence>
            {search.trim() && (
              <ProductResultsSection
                filteredProducts={filteredProducts}
                onClear={clearFilters}
              />
            )}
          </AnimatePresence>

          <AnimatePresence>
            {search.trim() && (
              <BrandResultsSection
                filteredBrands={filteredBrands}
                title="Marcas relacionadas"
                onClear={clearFilters}
              />
            )}
          </AnimatePresence>

          <motion.p initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
            className="text-[#2eb8d4] font-bold text-sm uppercase tracking-[0.2em] mb-3">
            catálogo de
          </motion.p>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="text-5xl sm:text-6xl lg:text-7xl font-black text-[#1a3a6b] leading-tight mb-5">
            Insumos Médicos
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="text-lg text-[#1a3a6b]/65 max-w-xl mx-auto mb-10">
            Distribuidores autorizados de las mejores marcas médicas en México.
            Todos los productos disponibles para compra directa con carrito.
          </motion.p>
        </div>
      </section>

      {/* Las categorías aparecen después del encabezado y la búsqueda. */}
      <CategoryGrid
        activeCategory={activeCategory}
        onCategoryClick={handleCategoryClick}
      />

      {!search.trim() && (
        <>
          {/* ══ PRODUCT + BRAND RESULTS (category selection) ═════════════════ */}
          <div ref={brandsRef} />
          <AnimatePresence>
            {!search.trim() && activeCategory && (
              <>
                <ProductResultsSection
                  filteredProducts={categoryProducts}
                  onClear={clearFilters}
                  title={categoryLabels[activeCategory]}
                />
                <BrandResultsSection
                  filteredBrands={filteredBrands}
                  title={`Marcas de ${categoryLabels[activeCategory]}`}
                  onClear={clearFilters}
                />
              </>
            )}
          </AnimatePresence>

          {!activeCategory && (
            <>
              {/* ══ QUICK SHOP ═════════════════════════════════════ */}
              <section id="catalogo-productos" className="bg-white py-10 sm:py-12 px-4 sm:px-6 border-y border-[#1a3a6b]/10">
            <div className="max-w-6xl mx-auto">
              <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
                <div>
                  <p className="text-[#2eb8d4] font-bold text-xs uppercase tracking-[0.2em] mb-2">Compra rápida</p>
                  <h2 className="text-2xl sm:text-3xl font-black text-[#1a3a6b]">Agrega al carrito en un clic</h2>
                  <p className="text-[#1a3a6b]/60 text-sm mt-1">Experiencia optimizada para móvil y desktop.</p>
                </div>
                <Link
                  href="/carrito"
                  className="inline-flex items-center gap-2 self-start sm:self-auto text-sm font-bold text-[#1a3a6b] border border-[#1a3a6b]/20 rounded-xl px-4 py-2 hover:bg-[#e8f4fd] transition-colors"
                >
                  Ver carrito ({cartCount}) <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                {quickProducts.map((product, i) => (
                  <motion.article
                    key={product.id}
                    initial={{ opacity: 0, y: 14 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.05 }}
                    className="rounded-2xl border border-[#1a3a6b]/10 bg-white p-4 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all"
                  >
                    <Link href={`/productos/${product.slug}`} className="block relative h-40 rounded-xl overflow-hidden bg-white mb-4">
                      <Image src={product.image} alt={product.name} fill className="object-contain p-3" sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" />
                    </Link>
                    <p className="text-[11px] uppercase tracking-wide font-bold text-[#2eb8d4] mb-1">{categoryLabels[product.category]}</p>
                    <Link href={`/productos/${product.slug}`}>
                      <h3 className="font-black text-[#1a3a6b] text-base leading-tight hover:text-[#2eb8d4] transition-colors">{getProductNameParts(product.name).title}</h3>
                    </Link>
                    {(product.presentation || getProductNameParts(product.name).presentation) && (
                      <p className="mt-1 mb-2 text-[11px] font-bold text-[#1a3a6b]/60"><span className="mr-1 uppercase tracking-wide text-[#2eb8d4]">Presentación</span>{product.presentation || getProductNameParts(product.name).presentation}</p>
                    )}
                    <p className="text-xs text-[#1a3a6b]/60 line-clamp-2 min-h-9 mb-3">{product.description}</p>
                    <div className="flex items-center justify-between mb-3">
                      {!product.quoteOnly && <span className="text-[#1a3a6b] font-black text-lg">{formatPrice(product.price)}</span>}
                      <StockIndicator quantity={product.stockQuantity} inStock={product.inStock} compact />
                    </div>
                    <ShoppingCartButton product={product} showStock={false} />
                  </motion.article>
                ))}
              </div>
            </div>
          </section>
            </>
          )}
        </>
      )}

      {/* ══ TRUST BAR ═════════════════════════════════════ */}
      <section className="bg-white border-t border-gray-100 py-8 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { Icon: Award, title: "Marcas autorizadas", sub: "Trabajamos con los mejores", color: "text-[#1a3a6b]", bg: "bg-[#dbeeff]" },
              { Icon: Truck, title: "Envíos seguros", sub: "A todo México", color: "text-[#0e7490]", bg: "bg-[#cffafe]" },
              { Icon: UserCheck, title: "Asesoría experta", sub: "Atención personalizada", color: "text-[#2eb8d4]", bg: "bg-[#e0f7fa]" },
              { Icon: ShoppingCart, title: "Carrito de compras", sub: "Compra fácil y segura", color: "text-[#1a3a6b]", bg: "bg-[#dbeeff]" },
            ].map((item, i) => (
              <motion.div key={item.title} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }} className="flex items-center gap-3">
                <div className={`w-11 h-11 rounded-xl ${item.bg} flex items-center justify-center shrink-0`}>
                  <item.Icon className={`w-5 h-5 ${item.color}`} />
                </div>
                <div>
                  <p className="font-bold text-[#1a3a6b] text-sm">{item.title}</p>
                  <p className="text-gray-500 text-xs">{item.sub}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

interface CategoryGridProps {
  activeCategory: Product["category"] | null;
  onCategoryClick: (category: Product["category"]) => void;
}

function CategoryGrid({ activeCategory, onCategoryClick }: CategoryGridProps) {
  return (
    <section className="bg-[#eef7fd] py-8 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            onClick={() => onCategoryClick(FEATURED)}
            className={`md:row-span-2 relative rounded-3xl overflow-hidden cursor-pointer group border-2 transition-all duration-300 ${
              activeCategory === FEATURED
                ? "border-[#2eb8d4] shadow-xl shadow-[#2eb8d4]/30"
                : "border-transparent hover:shadow-xl"
            }`}
            style={{ minHeight: 420 }}
          >
            <Image src={catCfg[FEATURED].img} alt={FEATURED} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1a3a6b]/90 via-[#1a3a6b]/35 to-transparent" />
            <div className="absolute top-4 left-4">
              <span className="inline-flex items-center gap-1.5 bg-yellow-400 text-[#1a3a6b] text-xs font-black px-3 py-1.5 rounded-full shadow-lg">
                <Award className="w-3.5 h-3.5" /> Destacado
              </span>
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30">
                  <Hand className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-3xl font-black text-white">Guantes</h3>
              </div>
              <p className="text-white/80 text-sm mb-4 leading-relaxed">Guantes estériles y no estériles de la más alta calidad.</p>
              <div className="flex flex-wrap gap-2 mb-5">
                {getBrandsByCategory("Guantes").map((brand) => (
                  <span key={brand.id} className="bg-white/20 backdrop-blur-sm text-white text-xs font-bold px-2.5 py-1 rounded-lg border border-white/30 uppercase tracking-wide">
                    {brand.name}
                  </span>
                ))}
              </div>
              <button
                onClick={(event) => { event.stopPropagation(); onCategoryClick(FEATURED); }}
                className="inline-flex items-center gap-2 bg-white text-[#1a3a6b] text-sm font-bold px-5 py-2.5 rounded-xl hover:bg-[#e8f4fd] transition-colors shadow-lg"
              >
                Ver productos →
              </button>
            </div>
          </motion.div>

          {REST.slice(0, 6).map((cat, i) => (
            <RegularCard
              key={cat}
              cat={cat}
              config={catCfg[cat]}
              active={activeCategory === cat}
              onClick={() => onCategoryClick(cat)}
              delay={0.05 + i * 0.04}
            />
          ))}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {REST.slice(6).map((cat, i) => (
            <CompactCard
              key={cat}
              cat={cat}
              config={catCfg[cat]}
              active={activeCategory === cat}
              onClick={() => onCategoryClick(cat)}
              delay={0.12 + i * 0.04}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Sub-components ─────────────────────────────────────── */
interface CardProps {
  cat: Product["category"];
  config: CatConfig;
  active: boolean;
  onClick: () => void;
  delay: number;
}

function RegularCard({ cat, config, active, onClick, delay }: CardProps) {
  const Icon = config.icon;
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }}
      onClick={onClick}
      className={`relative rounded-2xl overflow-hidden bg-white cursor-pointer group border-2 transition-all duration-300 hover:shadow-lg ${
        active ? "border-[#2eb8d4] shadow-lg shadow-[#2eb8d4]/25" : "border-transparent hover:border-[#2eb8d4]/40"
      }`}
      style={{ minHeight: 155 }}>
      {/* Product image — right side peek */}
      <div className="absolute right-0 top-0 bottom-0 w-32 pointer-events-none">
        <Image src={config.img} alt={categoryLabels[cat]} fill className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-white via-white/65 to-transparent" />
      </div>
      <div className="relative z-10 p-4">
        <div className={`w-10 h-10 rounded-xl ${config.iconBg} flex items-center justify-center mb-3`}>
          <Icon className={`w-5 h-5 ${config.iconColor}`} />
        </div>
        <h3 className="font-black text-[#1a3a6b] text-base leading-tight mb-1">{categoryLabels[cat]}</h3>
        <p className="text-[#1a3a6b]/55 text-xs leading-relaxed mb-3 max-w-[62%]">{config.desc}</p>
        <span className="inline-flex items-center text-[#2eb8d4] text-xs font-bold gap-1 group-hover:gap-2 transition-all duration-200">
          Ver productos →
        </span>
      </div>
      {active && <div className="absolute top-2.5 right-2.5 w-2.5 h-2.5 rounded-full bg-[#2eb8d4] animate-pulse shadow-sm" />}
    </motion.div>
  );
}

function CompactCard({ cat, config, active, onClick, delay }: CardProps) {
  const Icon = config.icon;
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }}
      onClick={onClick}
      className={`relative rounded-2xl overflow-hidden bg-white cursor-pointer group border-2 transition-all duration-300 hover:shadow-md ${
        active ? "border-[#2eb8d4] shadow-md shadow-[#2eb8d4]/25" : "border-transparent hover:border-[#2eb8d4]/40"
      }`}>
      {/* Small image peek */}
      <div className="absolute bottom-0 right-0 w-16 h-16 pointer-events-none opacity-60">
        <Image src={config.img} alt={categoryLabels[cat]} fill className="object-cover rounded-tl-xl" />
        <div className="absolute inset-0 bg-gradient-to-br from-white/90 to-transparent" />
      </div>
      <div className="relative z-10 p-4">
        <div className={`w-9 h-9 rounded-xl ${config.iconBg} flex items-center justify-center mb-2`}>
          <Icon className={`w-4 h-4 ${config.iconColor}`} />
        </div>
        <h3 className="font-black text-[#1a3a6b] text-sm leading-tight">{categoryLabels[cat]}</h3>
        <span className="block text-[#2eb8d4] text-[10px] font-bold mt-2 group-hover:translate-x-0.5 transition-transform">
          Ver →
        </span>
      </div>
      {active && <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#2eb8d4] animate-pulse" />}
    </motion.div>
  );
}

interface ProductResultsSectionProps {
  filteredProducts: Product[];
  onClear?: () => void;
  title?: string;
}

interface BrandResultsSectionProps {
  filteredBrands: Brand[];
  title: string;
  onClear?: () => void;
}

function ProductResultsSection({ filteredProducts, onClear, title }: ProductResultsSectionProps) {
  const heading = title || "Productos encontrados";
  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.35 }}
      className="bg-white py-12 px-4 sm:px-6 border-t border-gray-100 text-left"
    >
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-black text-[#1a3a6b]">{heading}</h2>
            <p className="text-[#1a3a6b]/55 text-sm mt-1">
              {filteredProducts.length} producto{filteredProducts.length !== 1 ? "s" : ""} encontrado{filteredProducts.length !== 1 ? "s" : ""}
            </p>
          </div>
          {onClear && (
            <button
              onClick={onClear}
              className="text-sm text-[#1a3a6b]/50 hover:text-[#1a3a6b] transition-colors border border-[#1a3a6b]/20 rounded-xl px-4 py-2 hover:bg-gray-50"
            >
              ✕ Limpiar
            </button>
          )}
        </div>
        {filteredProducts.length === 0 ? (
          <div className="rounded-3xl bg-[#f0f8ff] p-16 text-center">
            <Stethoscope className="w-14 h-14 text-[#2eb8d4]/40 mx-auto mb-4" />
            <p className="text-[#1a3a6b] font-semibold text-lg">Sin productos</p>
            <p className="text-[#1a3a6b]/50 text-sm mt-1">Intenta con otro término o categoría</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {filteredProducts.map((product, i) => (
              <motion.article
                key={product.id}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="rounded-2xl border border-[#1a3a6b]/10 bg-white p-4 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all"
              >
                <Link href={`/productos/${product.slug}`} className="block relative h-40 rounded-xl overflow-hidden bg-white mb-4">
                  <Image src={product.image} alt={product.name} fill className="object-contain p-3" sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" />
                </Link>
                <p className="text-[11px] uppercase tracking-wide font-bold text-[#2eb8d4] mb-1">{categoryLabels[product.category]}</p>
                <Link href={`/productos/${product.slug}`}>
                  <h3 className="font-black text-[#1a3a6b] text-base leading-tight hover:text-[#2eb8d4] transition-colors">{getProductNameParts(product.name).title}</h3>
                </Link>
                {(product.presentation || getProductNameParts(product.name).presentation) && (
                  <p className="mt-1 mb-2 text-[11px] font-bold text-[#1a3a6b]/60"><span className="mr-1 uppercase tracking-wide text-[#2eb8d4]">Presentación</span>{product.presentation || getProductNameParts(product.name).presentation}</p>
                )}
                <p className="text-xs text-[#1a3a6b]/60 line-clamp-2 min-h-9 mb-3">{product.description}</p>
                <div className="flex items-center justify-between mb-3">
                  {!product.quoteOnly && <span className="text-[#1a3a6b] font-black text-lg">{formatPrice(product.price)}</span>}
                  <StockIndicator quantity={product.stockQuantity} inStock={product.inStock} compact />
                </div>
                <div className="flex gap-2">
                  <ShoppingCartButton product={product} showStock={false} />
                  <Link
                    href={`/productos/${product.slug}`}
                    className="inline-flex items-center justify-center text-xs font-bold text-[#1a3a6b] border border-[#1a3a6b]/20 rounded-xl px-3 py-2 hover:bg-[#e8f4fd] transition-colors shrink-0"
                  >
                    Ver detalle
                  </Link>
                </div>
              </motion.article>
            ))}
          </div>
        )}
      </div>
    </motion.section>
  );
}


function BrandResultsSection({ filteredBrands, title, onClear }: BrandResultsSectionProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.35 }}
      className="bg-white py-12 px-4 sm:px-6 border-t border-gray-100 text-left"
    >
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-black text-[#1a3a6b]">{title}</h2>
            <p className="text-[#1a3a6b]/55 text-sm mt-1">
              {filteredBrands.length} marca{filteredBrands.length !== 1 ? "s" : ""} encontrada{filteredBrands.length !== 1 ? "s" : ""}
            </p>
          </div>
          {onClear && (
            <button
              onClick={onClear}
              className="text-sm text-[#1a3a6b]/50 hover:text-[#1a3a6b] transition-colors border border-[#1a3a6b]/20 rounded-xl px-4 py-2 hover:bg-gray-50"
            >
              ✕ Limpiar
            </button>
          )}
        </div>
        {filteredBrands.length === 0 ? (
          <div className="rounded-3xl bg-[#f0f8ff] p-16 text-center">
            <Stethoscope className="w-14 h-14 text-[#2eb8d4]/40 mx-auto mb-4" />
            <p className="text-[#1a3a6b] font-semibold text-lg">Sin resultados</p>
            <p className="text-[#1a3a6b]/50 text-sm mt-1">Intenta con otro término o categoría</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredBrands.map((brand, i) => (
              <motion.div
                key={brand.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className="rounded-2xl bg-white border border-gray-100 p-5 hover:-translate-y-1 transition-all duration-200 hover:shadow-lg hover:border-[#2eb8d4]/30"
              >
                <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${brand.gradient} flex items-center justify-center mb-4 shadow-sm`}>
                  <span className="text-white font-black text-xs">{brand.name.slice(0, 2)}</span>
                </div>
                <h3 className="font-black text-[#1a3a6b] text-lg">{brand.name}</h3>
                <p className="text-[#1a3a6b]/55 text-sm mt-1 mb-5 leading-relaxed line-clamp-2">{brand.description}</p>
                <div className="flex items-center justify-between pt-3 border-t border-gray-50">
                  <span className="text-xs text-[#2eb8d4] font-bold">{getTotalProducts(brand)} productos</span>
                  <div className="flex gap-2">
                    <Link
                      href={`/insumos/${brand.id}`}
                      className="text-xs text-[#1a3a6b] font-bold border border-[#1a3a6b]/20 rounded-lg px-3 py-1.5 hover:bg-[#e8f4fd] transition-colors"
                    >
                      Ver detalle
                    </Link>
                    <Link
                      href={`/insumos/${brand.id}`}
                      className="text-xs bg-[#1a3a6b] text-white rounded-lg px-3 py-1.5 hover:bg-[#2eb8d4] transition-colors font-bold"
                    >
                      Ver productos →
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </motion.section>
  );
}

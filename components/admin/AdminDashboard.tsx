"use client";

import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { BarChart3, Boxes, DollarSign, LogOut, Pencil, Plus, Trash2, TrendingDown, TrendingUp, X } from "lucide-react";
import type { Product } from "@/types";
import type { ProductMetrics } from "@/lib/admin-products";
import { formatPrice } from "@/lib/utils";
import { categoryLabels } from "@/data/products";

type ProductForm = {
  id?: string;
  name: string;
  slug: string;
  category: Product["category"];
  price: string;
  description: string;
  image: string;
  stockQuantity: string;
  sizes: string;
  colors: string;
  featured: boolean;
  quoteOnly: boolean;
};

const blankForm: ProductForm = {
  name: "", slug: "", category: "medicamentos", price: "0", description: "", image: "", stockQuantity: "0", sizes: "", colors: "", featured: false, quoteOnly: true,
};

function toForm(product: Product): ProductForm {
  return {
    id: product.id, name: product.name, slug: product.slug, category: product.category, price: String(product.price), description: product.description,
    image: product.image, stockQuantity: String(product.stockQuantity ?? 0), sizes: product.sizes?.join(", ") ?? "", colors: product.colors?.join(", ") ?? "", featured: product.featured ?? false, quoteOnly: product.quoteOnly ?? false,
  };
}

function MetricCard({ icon: Icon, label, value, tone = "navy" }: { icon: typeof Boxes; label: string; value: string; tone?: "navy" | "teal" | "green" }) {
  const colors = { navy: "bg-[#1a3a6b]", teal: "bg-[#2eb8d4]", green: "bg-emerald-500" };
  return <article className="rounded-2xl border border-white bg-white/85 p-5 shadow-sm"><div className={`mb-4 flex h-10 w-10 items-center justify-center rounded-xl text-white ${colors[tone]}`}><Icon className="h-5 w-5" /></div><p className="text-xs font-bold uppercase tracking-wide text-[#1a3a6b]/50">{label}</p><p className="mt-1 text-2xl font-black text-[#1a3a6b]">{value}</p></article>;
}

export default function AdminDashboard({ products: initialProducts, metricsByProductId, totalRevenue, totalUnitsSold }: { products: Product[]; metricsByProductId: Record<string, ProductMetrics>; totalRevenue: number; totalUnitsSold: number }) {
  const router = useRouter();
  const [products, setProducts] = useState(initialProducts);
  const [form, setForm] = useState<ProductForm | null>(null);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const ranked = useMemo(() => products.map((product) => ({ product, metrics: metricsByProductId[product.id] ?? { unitsSold: 0, revenue: 0 } })).sort((a, b) => b.metrics.unitsSold - a.metrics.unitsSold), [products, metricsByProductId]);
  const best = ranked[0];

  async function logout() {
    await fetch("/api/admin/auth/logout", { method: "POST" });
    router.replace("/admin/login");
    router.refresh();
  }

  async function remove(product: Product) {
    if (!window.confirm(`¿Eliminar “${product.name}”? El historial de ventas se conserva.`)) return;
    const response = await fetch(`/api/admin/products/${product.id}`, { method: "DELETE" });
    if (!response.ok) return setError("No se pudo eliminar el producto.");
    setProducts((current) => current.filter((item) => item.id !== product.id));
    router.refresh();
  }

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!form) return;
    setSaving(true); setError("");
    const payload = { ...form, price: Number(form.price), stockQuantity: Number(form.stockQuantity), sizes: form.sizes.split(",").map((size) => size.trim()).filter(Boolean), colors: form.colors.split(",").map((color) => color.trim()).filter(Boolean) };
    const response = await fetch(form.id ? `/api/admin/products/${form.id}` : "/api/admin/products", { method: form.id ? "PATCH" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    const result = await response.json();
    if (!response.ok) { setError(result.error || "No se pudo guardar el producto."); setSaving(false); return; }
    const saved = { ...result, inStock: result.in_stock, stockQuantity: result.stock_quantity, quoteOnly: result.quote_only } as Product;
    setProducts((current) => form.id ? current.map((product) => product.id === saved.id ? saved : product) : [...current, saved].sort((a, b) => a.name.localeCompare(b.name)));
    setForm(null); setSaving(false); router.refresh();
  }

  return (
    <section className="min-h-screen bg-[#eef7fd] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="mb-7 flex flex-col gap-4 rounded-3xl bg-[#1a3a6b] p-6 text-white shadow-xl sm:flex-row sm:items-center sm:justify-between">
          <div><p className="text-xs font-black uppercase tracking-[0.2em] text-[#8ae6f5]">CMS interno</p><h1 className="mt-1 text-3xl font-black">Control del catálogo</h1><p className="mt-1 text-sm text-white/70">Productos, inventario y desempeño de ventas.</p></div>
          <div className="flex gap-2"><button onClick={() => { setError(""); setForm(blankForm); }} className="inline-flex items-center gap-2 rounded-xl bg-[#2eb8d4] px-4 py-3 font-bold hover:bg-white hover:text-[#1a3a6b]"><Plus className="h-4 w-4" />Nuevo producto</button><button onClick={logout} className="rounded-xl border border-white/25 p-3 hover:bg-white/10" aria-label="Cerrar sesión"><LogOut className="h-5 w-5" /></button></div>
        </header>

        {error && <div className="mb-5 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">{error}</div>}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"><MetricCard icon={Boxes} label="Productos activos" value={String(products.length)} /><MetricCard icon={BarChart3} label="Unidades vendidas" value={String(totalUnitsSold)} tone="teal" /><MetricCard icon={DollarSign} label="Ingresos cobrados" value={formatPrice(totalRevenue)} tone="green" /><MetricCard icon={TrendingUp} label="Más vendido" value={best ? best.product.name : "Sin ventas"} /></div>

        <div className="mt-6 grid gap-4 lg:grid-cols-2"><article className="rounded-2xl bg-white p-5 shadow-sm"><div className="flex items-center gap-2 text-[#1a3a6b]"><TrendingUp className="h-5 w-5 text-[#2eb8d4]" /><h2 className="font-black">Productos más vendidos</h2></div><Ranking entries={ranked.slice(0, 5)} /></article><article className="rounded-2xl bg-white p-5 shadow-sm"><div className="flex items-center gap-2 text-[#1a3a6b]"><TrendingDown className="h-5 w-5 text-amber-500" /><h2 className="font-black">Menor movimiento</h2></div><Ranking entries={[...ranked].sort((a, b) => a.metrics.unitsSold - b.metrics.unitsSold).slice(0, 5)} /></article></div>

        <article className="mt-6 overflow-hidden rounded-2xl bg-white shadow-sm"><div className="flex items-center justify-between border-b border-[#1a3a6b]/10 px-5 py-4"><div><h2 className="font-black text-[#1a3a6b]">Catálogo</h2><p className="text-xs text-[#1a3a6b]/50">Edita precio, imagen, existencias y datos de venta.</p></div><span className="rounded-full bg-[#e8f4fd] px-3 py-1 text-xs font-bold text-[#1a3a6b]">{products.length} productos</span></div><div className="overflow-x-auto"><table className="w-full min-w-[820px] text-left text-sm"><thead className="bg-[#f7fbfe] text-xs uppercase tracking-wide text-[#1a3a6b]/50"><tr><th className="px-5 py-3">Producto</th><th className="px-4 py-3">Stock</th><th className="px-4 py-3">Vendidas</th><th className="px-4 py-3">Ingresos</th><th className="px-4 py-3">Precio</th><th className="px-5 py-3 text-right">Acciones</th></tr></thead><tbody>{products.map((product) => { const metrics = metricsByProductId[product.id] ?? { unitsSold: 0, revenue: 0 }; return <tr key={product.id} className="border-t border-[#1a3a6b]/5 hover:bg-[#f8fcff]"><td className="px-5 py-4"><p className="font-bold text-[#1a3a6b]">{product.name}</p><p className="mt-0.5 text-xs text-[#1a3a6b]/50">{categoryLabels[product.category]} · {product.slug}</p></td><td className="px-4 py-4"><span className={`rounded-full px-2.5 py-1 text-xs font-bold ${product.inStock ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"}`}>{product.stockQuantity ?? 0} u.</span></td><td className="px-4 py-4 font-bold text-[#1a3a6b]">{metrics.unitsSold}</td><td className="px-4 py-4 text-[#1a3a6b]/70">{formatPrice(metrics.revenue)}</td><td className="px-4 py-4 font-bold text-[#1a3a6b]">{product.quoteOnly ? "Cotizar" : formatPrice(product.price)}</td><td className="px-5 py-4"><div className="flex justify-end gap-2"><button onClick={() => { setError(""); setForm(toForm(product)); }} className="rounded-lg p-2 text-[#1a3a6b] hover:bg-[#e8f4fd]" aria-label={`Editar ${product.name}`}><Pencil className="h-4 w-4" /></button><button onClick={() => remove(product)} className="rounded-lg p-2 text-rose-600 hover:bg-rose-50" aria-label={`Eliminar ${product.name}`}><Trash2 className="h-4 w-4" /></button></div></td></tr>; })}</tbody></table></div></article>
      </div>

      {form && <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#071a3d]/45 p-4 backdrop-blur-sm"><form onSubmit={save} className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl"><div className="mb-5 flex items-center justify-between"><div><p className="text-xs font-black uppercase tracking-[0.18em] text-[#2eb8d4]">Catálogo</p><h2 className="text-2xl font-black text-[#1a3a6b]">{form.id ? "Editar producto" : "Nuevo producto"}</h2></div><button type="button" onClick={() => setForm(null)} className="rounded-full bg-slate-100 p-2 text-[#1a3a6b]"><X className="h-5 w-5" /></button></div><div className="grid gap-4 sm:grid-cols-2"><Field label="Nombre" value={form.name} onChange={(value) => setForm({ ...form, name: value })} required /><Field label="Slug (URL)" value={form.slug} onChange={(value) => setForm({ ...form, slug: value })} /><label className="block text-sm font-bold text-[#1a3a6b]">Categoría<select value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value as Product["category"] })} className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2.5 font-normal outline-none focus:border-[#2eb8d4]">{Object.entries(categoryLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label><Field label="Precio (MXN)" type="number" min="0" step="0.01" value={form.price} onChange={(value) => setForm({ ...form, price: value })} required /><Field label="Unidades en existencia" type="number" min="0" step="1" value={form.stockQuantity} onChange={(value) => setForm({ ...form, stockQuantity: value })} required /><Field label="Imagen (URL o ruta /public)" value={form.image} onChange={(value) => setForm({ ...form, image: value })} /><label className="sm:col-span-2 block text-sm font-bold text-[#1a3a6b]">Descripción<textarea value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} rows={3} className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2.5 font-normal outline-none focus:border-[#2eb8d4]" /></label><Field label="Variantes (separadas por coma)" value={form.sizes} onChange={(value) => setForm({ ...form, sizes: value })} /><div className="flex flex-col justify-end gap-2 pb-1"><label className="flex items-center gap-2 text-sm font-bold text-[#1a3a6b]"><input type="checkbox" checked={form.quoteOnly} onChange={(event) => setForm({ ...form, quoteOnly: event.target.checked })} />Solo cotización</label><label className="flex items-center gap-2 text-sm font-bold text-[#1a3a6b]"><input type="checkbox" checked={form.featured} onChange={(event) => setForm({ ...form, featured: event.target.checked })} />Producto destacado</label></div></div><div className="mt-6 flex justify-end gap-3"><button type="button" onClick={() => setForm(null)} className="rounded-xl px-4 py-3 font-bold text-[#1a3a6b] hover:bg-slate-100">Cancelar</button><button disabled={saving} className="rounded-xl bg-[#1a3a6b] px-5 py-3 font-bold text-white hover:bg-[#2eb8d4] disabled:opacity-60">{saving ? "Guardando…" : "Guardar producto"}</button></div></form></div>}
    </section>
  );
}

function Ranking({ entries }: { entries: { product: Product; metrics: ProductMetrics }[] }) {
  return <ol className="mt-4 space-y-2">{entries.map(({ product, metrics }, index) => <li key={product.id} className="flex items-center gap-3 rounded-xl bg-[#f8fcff] px-3 py-2.5"><span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#e8f4fd] text-xs font-black text-[#1a3a6b]">{index + 1}</span><span className="min-w-0 flex-1 truncate text-sm font-bold text-[#1a3a6b]">{product.name}</span><span className="text-xs font-black text-[#2eb8d4]">{metrics.unitsSold} u.</span></li>)}</ol>;
}

function Field({ label, value, onChange, type = "text", ...props }: { label: string; value: string; onChange: (value: string) => void; type?: string; required?: boolean; min?: string; step?: string }) {
  return <label className="block text-sm font-bold text-[#1a3a6b]">{label}<input {...props} type={type} value={value} onChange={(event) => onChange(event.target.value)} className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2.5 font-normal outline-none focus:border-[#2eb8d4]" /></label>;
}

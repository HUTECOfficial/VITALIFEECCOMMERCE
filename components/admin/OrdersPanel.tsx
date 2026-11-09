"use client";

import { FormEvent, useMemo, useState } from "react";
import { Ban, Download, ExternalLink, LoaderCircle, MapPin, Package, RefreshCw, Search, Truck, X } from "lucide-react";
import type { AdminOrder } from "@/lib/admin-orders";
import type { ShippingOption } from "@/lib/envia";
import type { ShippingPackage } from "@/lib/shipping-settings";
import { formatPrice } from "@/lib/utils";

type Filter = "to_ship" | "shipped" | "paid" | "all";

const filters: { id: Filter; label: string; matches: (order: AdminOrder) => boolean }[] = [
  { id: "to_ship", label: "Por enviar", matches: (order) => order.status === "paid" && !order.trackingNumber },
  { id: "shipped", label: "Con guía", matches: (order) => Boolean(order.trackingNumber) },
  { id: "paid", label: "Pagados", matches: (order) => order.status === "paid" },
  { id: "all", label: "Todos", matches: () => true },
];

const statusStyles: Record<string, { label: string; className: string }> = {
  paid: { label: "Pagado", className: "bg-emerald-50 text-emerald-700" },
  pending: { label: "Pago pendiente", className: "bg-amber-50 text-amber-700" },
  payment_failed: { label: "Pago fallido", className: "bg-rose-50 text-rose-700" },
  refunded: { label: "Reembolsado", className: "bg-slate-100 text-slate-600" },
  expired: { label: "Expirado", className: "bg-slate-100 text-slate-600" },
};

function StatusBadge({ status }: { status: string }) {
  const style = statusStyles[status] ?? { label: status, className: "bg-slate-100 text-slate-600" };
  return <span className={`inline-block whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-bold ${style.className}`}>{style.label}</span>;
}

function formatDate(value: string | null) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleString("es-MX", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

function shortId(id: string) {
  return id.slice(0, 8).toUpperCase();
}

// El checkout guarda la dirección en un solo campo; se separa calle, número e interior para Envia.
function splitAddress(address: string) {
  const match = address.trim().match(/^(.+?)[\s,]+(?:#\s*|no\.?\s*|núm\.?\s*)?(\d+(?:-?[A-Za-z])?)((?:[\s,-]*(?:int\.?|interior|depto\.?|dpto\.?|-)\s*\S+)?)\s*$/i);
  if (!match) return { street: address.trim(), number: "", interior: "" };
  return { street: match[1].replace(/[\s,]+$/, ""), number: match[2], interior: match[3].replace(/^[\s,-]+/, "").trim() };
}

export default function OrdersPanel({ initialOrders, loadError, defaultPackage, enviaConfigured }: {
  initialOrders: AdminOrder[];
  loadError?: string;
  defaultPackage: ShippingPackage;
  enviaConfigured: boolean;
}) {
  const [orders, setOrders] = useState(initialOrders);
  const [filter, setFilter] = useState<Filter>("to_ship");
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = orders.find((order) => order.id === selectedId) ?? null;

  const counts = useMemo(
    () => Object.fromEntries(filters.map((item) => [item.id, orders.filter(item.matches).length])) as Record<Filter, number>,
    [orders]
  );
  const visibleOrders = useMemo(() => {
    const activeFilter = filters.find((item) => item.id === filter)!;
    const term = query.trim().toLowerCase();
    return orders.filter((order) => activeFilter.matches(order) && (!term || [
      order.id, `${order.firstName} ${order.lastName}`, order.phone, order.cp, order.city, order.trackingNumber ?? "",
    ].some((value) => value.toLowerCase().includes(term))));
  }, [orders, filter, query]);

  function replaceOrder(updated: AdminOrder) {
    setOrders((current) => current.map((order) => order.id === updated.id ? updated : order));
  }

  return (
    <article className="overflow-hidden rounded-2xl bg-white shadow-sm">
      <div className="flex flex-col gap-4 border-b border-[#1a3a6b]/10 px-5 py-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="font-black text-[#1a3a6b]">Pedidos</h2>
          <p className="text-xs text-[#1a3a6b]/50">Revisa cada pedido y genera su guía de Envia.com cuando esté pagado.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {filters.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setFilter(item.id)}
              aria-pressed={filter === item.id}
              className={`rounded-full px-3 py-1.5 text-xs font-bold transition ${filter === item.id ? "bg-[#1a3a6b] text-white" : "bg-[#e8f4fd] text-[#1a3a6b] hover:bg-[#d7ecf9]"}`}
            >
              {item.label} <span className="opacity-70">{counts[item.id]}</span>
            </button>
          ))}
          <label className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#1a3a6b]/45" />
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Cliente, C.P., guía…" aria-label="Buscar pedido" className="w-52 rounded-xl border border-[#1a3a6b]/15 py-2 pl-9 pr-3 text-sm outline-none focus:border-[#2eb8d4]" />
          </label>
        </div>
      </div>

      {loadError && <p className="m-5 rounded-xl bg-rose-50 p-3 text-sm font-semibold text-rose-700">{loadError}</p>}
      {!enviaConfigured && <p className="m-5 rounded-xl bg-amber-50 p-3 text-sm font-semibold text-amber-800">Falta configurar ENVIA_API_KEY en las variables de entorno; no se podrán cotizar ni generar guías.</p>}

      <div className="overflow-x-auto">
        <table className="w-full min-w-[960px] text-left text-sm">
          <thead className="bg-[#f7fbfe] text-xs uppercase tracking-wide text-[#1a3a6b]/50">
            <tr><th className="px-5 py-3">Pedido</th><th className="px-4 py-3">Cliente</th><th className="px-4 py-3">Destino</th><th className="px-4 py-3">Total</th><th className="px-4 py-3">Envío elegido</th><th className="px-4 py-3">Pago</th><th className="px-4 py-3">Guía</th><th className="px-5 py-3 text-right">Acciones</th></tr>
          </thead>
          <tbody>
            {visibleOrders.map((order) => (
              <tr key={order.id} className="border-t border-[#1a3a6b]/5 hover:bg-[#f8fcff]">
                <td className="px-5 py-3"><p className="font-mono font-bold text-[#1a3a6b]">#{shortId(order.id)}</p><p className="mt-0.5 text-xs text-[#1a3a6b]/50">{formatDate(order.createdAt)}</p></td>
                <td className="px-4 py-3"><p className="font-bold text-[#1a3a6b]">{order.firstName} {order.lastName}</p><p className="mt-0.5 text-xs text-[#1a3a6b]/50">{order.phone}</p></td>
                <td className="px-4 py-3 text-[#1a3a6b]/70">{order.city}{order.state ? `, ${order.state}` : ""}<p className="text-xs text-[#1a3a6b]/50">C.P. {order.cp}</p></td>
                <td className="px-4 py-3 font-bold text-[#1a3a6b]">{formatPrice(order.total)}</td>
                <td className="px-4 py-3 text-[#1a3a6b]/70">{order.shippingDescription ? <><p className="max-w-[200px] truncate">{order.shippingDescription}</p><p className="text-xs text-[#1a3a6b]/50">{formatPrice(order.shippingCost)}</p></> : <span className="text-xs text-[#1a3a6b]/40">Sin envío registrado</span>}</td>
                <td className="px-4 py-3"><StatusBadge status={order.status} /></td>
                <td className="px-4 py-3">{order.trackingNumber ? <span className="font-mono text-xs font-bold text-[#1a3a6b]">{order.trackingNumber}</span> : order.status === "paid" ? <span className="rounded-full bg-[#e8f4fd] px-2.5 py-1 text-xs font-bold text-[#1a3a6b]">Pendiente</span> : <span className="text-xs text-[#1a3a6b]/40">—</span>}</td>
                <td className="px-5 py-3 text-right">
                  <button type="button" onClick={() => setSelectedId(order.id)} className="inline-flex items-center gap-1.5 rounded-lg bg-[#e8f4fd] px-3 py-2 text-xs font-bold text-[#1a3a6b] hover:bg-[#d7ecf9]">
                    {order.status === "paid" && !order.trackingNumber ? <><Truck className="h-4 w-4" />Generar guía</> : "Ver detalle"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!visibleOrders.length && <p className="px-5 py-10 text-center text-sm text-[#1a3a6b]/50">{orders.length ? "No hay pedidos con este filtro." : "Todavía no hay pedidos."}</p>}
      </div>

      {selected && (
        <OrderDetail
          key={selected.id}
          order={selected}
          defaultPackage={defaultPackage}
          onUpdated={replaceOrder}
          onClose={() => setSelectedId(null)}
        />
      )}
    </article>
  );
}

function OrderDetail({ order, defaultPackage, onUpdated, onClose }: {
  order: AdminOrder;
  defaultPackage: ShippingPackage;
  onUpdated: (order: AdminOrder) => void;
  onClose: () => void;
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  async function cancel() {
    if (!window.confirm(`¿Cancelar la guía ${order.trackingNumber}? Envia te devolverá el saldo si la paquetería aún no la ha recolectado.`)) return;
    setBusy(true);
    setError("");
    setNotice("");
    try {
      const response = await fetch(`/api/admin/orders/${order.id}/label`, { method: "DELETE" });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "No se pudo cancelar la guía.");
      onUpdated(result.order);
      setNotice(result.balanceReturned ? "Guía cancelada. Envia regresó el saldo a tu cuenta." : "Guía cancelada.");
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "No se pudo cancelar la guía.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#071a3d]/45 p-4 backdrop-blur-sm">
      <div role="dialog" aria-modal="true" aria-labelledby="order-detail-title" className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[#2eb8d4]">Pedido #{shortId(order.id)}</p>
            <h2 id="order-detail-title" className="text-2xl font-black text-[#1a3a6b]">{order.firstName} {order.lastName}</h2>
            <p className="mt-1 flex flex-wrap items-center gap-2 text-xs text-[#1a3a6b]/60"><StatusBadge status={order.status} /> Creado {formatDate(order.createdAt)}{order.paidAt && ` · Pagado ${formatDate(order.paidAt)}`}</p>
          </div>
          <button type="button" onClick={onClose} disabled={busy} className="rounded-full bg-slate-100 p-2 text-[#1a3a6b] disabled:opacity-50" aria-label="Cerrar"><X className="h-5 w-5" /></button>
        </div>

        {error && <p role="alert" className="mb-4 rounded-xl bg-rose-50 p-3 text-sm font-semibold text-rose-700">{error}</p>}
        {notice && <p role="status" className="mb-4 rounded-xl bg-emerald-50 p-3 text-sm font-semibold text-emerald-700">{notice}</p>}

        <div className="grid gap-4 sm:grid-cols-2">
          <section className="rounded-2xl border border-[#1a3a6b]/10 bg-[#f8fcff] p-4">
            <h3 className="mb-2 flex items-center gap-2 font-black text-[#1a3a6b]"><MapPin className="h-4 w-4 text-[#2eb8d4]" />Entrega</h3>
            <p className="text-sm text-[#1a3a6b]">{order.address}</p>
            <p className="text-sm text-[#1a3a6b]/70">Col. {order.colonia}, {order.city}{order.state ? `, ${order.state}` : ""} · C.P. {order.cp}</p>
            <p className="mt-2 text-sm text-[#1a3a6b]/70">Tel. {order.phone}</p>
          </section>
          <section className="rounded-2xl border border-[#1a3a6b]/10 bg-[#f8fcff] p-4">
            <h3 className="mb-2 flex items-center gap-2 font-black text-[#1a3a6b]"><Package className="h-4 w-4 text-[#2eb8d4]" />Productos</h3>
            <ul className="space-y-1 text-sm">
              {order.items.map((item, index) => (
                <li key={index} className="flex justify-between gap-3 text-[#1a3a6b]">
                  <span className="min-w-0">{item.quantity} × {item.name}{[item.color, item.size].filter(Boolean).length ? <span className="text-xs text-[#1a3a6b]/50"> ({[item.color, item.size].filter(Boolean).join(" · ")})</span> : null}</span>
                  <span className="shrink-0 font-bold">{formatPrice(item.price * item.quantity)}</span>
                </li>
              ))}
            </ul>
            <dl className="mt-3 space-y-1 border-t border-[#1a3a6b]/10 pt-2 text-sm text-[#1a3a6b]/70">
              <div className="flex justify-between"><dt>Subtotal</dt><dd>{formatPrice(order.subtotal)}</dd></div>
              <div className="flex justify-between"><dt>IVA</dt><dd>{formatPrice(order.iva)}</dd></div>
              <div className="flex justify-between"><dt>Envío</dt><dd>{formatPrice(order.shippingCost)}</dd></div>
              <div className="flex justify-between font-black text-[#1a3a6b]"><dt>Total cobrado</dt><dd>{formatPrice(order.total)}</dd></div>
            </dl>
          </section>
        </div>

        <section className="mt-4 rounded-2xl border border-[#2eb8d4]/25 p-4">
          <h3 className="mb-1 flex items-center gap-2 font-black text-[#1a3a6b]"><Truck className="h-4 w-4 text-[#2eb8d4]" />Guía de envío</h3>
          {order.shippingDescription && <p className="mb-3 text-sm text-[#1a3a6b]/70">El cliente eligió <strong className="text-[#1a3a6b]">{order.shippingDescription}</strong> y pagó {formatPrice(order.shippingCost)}.</p>}

          {order.trackingNumber ? (
            <div className="space-y-3">
              <div className="grid gap-3 rounded-xl bg-[#f8fcff] p-3 text-sm sm:grid-cols-3">
                <div><p className="text-xs font-bold uppercase text-[#1a3a6b]/50">Número de guía</p><p className="font-mono font-bold text-[#1a3a6b]">{order.trackingNumber}</p></div>
                <div><p className="text-xs font-bold uppercase text-[#1a3a6b]/50">Paquetería</p><p className="font-bold capitalize text-[#1a3a6b]">{order.shippingCarrier} · {order.shippingService}</p></div>
                <div><p className="text-xs font-bold uppercase text-[#1a3a6b]/50">Costo en Envia</p><p className="font-bold text-[#1a3a6b]">{order.labelCost !== null ? formatPrice(order.labelCost) : "—"}</p></div>
              </div>
              <div className="flex flex-wrap gap-2">
                {order.labelUrl && <a href={order.labelUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-xl bg-[#1a3a6b] px-4 py-2.5 text-sm font-bold text-white hover:bg-[#2eb8d4]"><Download className="h-4 w-4" />Descargar etiqueta (PDF)</a>}
                {order.trackingUrl && <a href={order.trackingUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-xl bg-[#e8f4fd] px-4 py-2.5 text-sm font-bold text-[#1a3a6b] hover:bg-[#d7ecf9]"><ExternalLink className="h-4 w-4" />Rastrear envío</a>}
                <button type="button" onClick={cancel} disabled={busy} className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold text-rose-600 hover:bg-rose-50 disabled:opacity-60">{busy ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Ban className="h-4 w-4" />}Cancelar guía</button>
              </div>
              {order.labelCreatedAt && <p className="text-xs text-[#1a3a6b]/50">Generada {formatDate(order.labelCreatedAt)}.</p>}
            </div>
          ) : order.status === "paid" ? (
            <LabelForm order={order} defaultPackage={defaultPackage} busy={busy} setBusy={setBusy} onError={setError} onCreated={(updated) => { onUpdated(updated); setNotice("Guía generada. Descarga la etiqueta y pégala en el paquete."); }} />
          ) : (
            <p className="text-sm text-[#1a3a6b]/60">La guía se puede generar cuando el pago del pedido esté confirmado.</p>
          )}
        </section>
      </div>
    </div>
  );
}

function LabelForm({ order, defaultPackage, busy, setBusy, onError, onCreated }: {
  order: AdminOrder;
  defaultPackage: ShippingPackage;
  busy: boolean;
  setBusy: (busy: boolean) => void;
  onError: (message: string) => void;
  onCreated: (order: AdminOrder) => void;
}) {
  const initialAddress = splitAddress(order.address);
  const [destination, setDestination] = useState({
    name: `${order.firstName} ${order.lastName}`.trim(),
    phone: order.phone,
    email: "",
    street: initialAddress.street,
    number: initialAddress.number,
    district: order.colonia,
    city: order.city,
    postalCode: order.cp,
    reference: initialAddress.interior ? `Interior ${initialAddress.interior}` : "",
  });
  const [pkg, setPkg] = useState({
    content: defaultPackage.content,
    weight: String(defaultPackage.weight),
    length: String(defaultPackage.length),
    width: String(defaultPackage.width),
    height: String(defaultPackage.height),
  });
  const [options, setOptions] = useState<ShippingOption[] | null>(null);
  const [quoting, setQuoting] = useState(false);
  const [selectedId, setSelectedId] = useState(order.shippingCarrier && order.shippingService ? `${order.shippingCarrier}:${order.shippingService}` : "");
  const selectedOption = options?.find((option) => option.id === selectedId);
  const [carrier, service] = selectedId.split(":");

  function packagePayload() {
    return { content: pkg.content, weight: Number(pkg.weight), length: Number(pkg.length), width: Number(pkg.width), height: Number(pkg.height) };
  }

  async function quote() {
    setQuoting(true);
    onError("");
    try {
      const response = await fetch("/api/admin/shipping-quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cp: destination.postalCode, city: destination.city, colonia: destination.district, package: packagePayload() }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "No se pudo cotizar.");
      const quoted = result.options as ShippingOption[];
      setOptions(quoted);
      setSelectedId((current) => quoted.some((option) => option.id === current) ? current : quoted[0]?.id ?? "");
    } catch (reason) {
      onError(reason instanceof Error ? reason.message : "No se pudo cotizar.");
    } finally {
      setQuoting(false);
    }
  }

  async function generate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!carrier || !service) return onError("Cotiza y elige una paquetería antes de generar la guía.");
    const serviceLabel = selectedOption ? `${selectedOption.serviceName} (${formatPrice(selectedOption.price)})` : order.shippingDescription ?? `${carrier} ${service}`;
    if (!window.confirm(`Se generará la guía con ${serviceLabel}. Envia descontará el costo de tu saldo. ¿Continuar?`)) return;
    setBusy(true);
    onError("");
    try {
      const response = await fetch(`/api/admin/orders/${order.id}/label`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ carrier, service, destination, package: packagePayload() }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "No se pudo generar la guía.");
      onCreated(result.order);
    } catch (reason) {
      onError(reason instanceof Error ? reason.message : "No se pudo generar la guía.");
    } finally {
      setBusy(false);
    }
  }

  const setDest = (field: keyof typeof destination) => (value: string) => { setDestination((current) => ({ ...current, [field]: value })); };
  const setPack = (field: keyof typeof pkg) => (value: string) => { setPkg((current) => ({ ...current, [field]: value })); setOptions(null); };

  return (
    <form onSubmit={generate} className="space-y-4">
      <p className="text-xs text-[#1a3a6b]/60">Revisa la dirección: el checkout la guarda en un solo campo y aquí se separa automáticamente en calle y número.</p>
      <div className="grid gap-3 sm:grid-cols-6">
        <Input className="sm:col-span-3" label="Destinatario" value={destination.name} onChange={setDest("name")} required />
        <Input className="sm:col-span-3" label="Teléfono (10 dígitos)" value={destination.phone} onChange={setDest("phone")} required />
        <Input className="sm:col-span-4" label="Calle" value={destination.street} onChange={setDest("street")} required />
        <Input className="sm:col-span-2" label="Número" value={destination.number} onChange={setDest("number")} placeholder="S/N" />
        <Input className="sm:col-span-3" label="Colonia" value={destination.district} onChange={setDest("district")} required />
        <Input className="sm:col-span-2" label="Ciudad" value={destination.city} onChange={setDest("city")} required />
        <Input className="sm:col-span-1" label="C.P." value={destination.postalCode} onChange={(value) => { setDest("postalCode")(value); setOptions(null); }} required />
        <Input className="sm:col-span-3" label="Referencias (opcional)" value={destination.reference} onChange={setDest("reference")} placeholder="Entre calles, color de fachada…" />
        <Input className="sm:col-span-3" label="Correo (opcional)" type="email" value={destination.email} onChange={setDest("email")} placeholder="Para avisos de la paquetería" />
      </div>

      <div className="rounded-xl bg-[#f8fcff] p-3">
        <p className="mb-2 text-sm font-black text-[#1a3a6b]">Paquete</p>
        <div className="grid gap-3 sm:grid-cols-5">
          <Input className="sm:col-span-5" label="Contenido" value={pkg.content} onChange={setPack("content")} required />
          <Input label="Peso (kg)" type="number" min="0.01" step="0.01" value={pkg.weight} onChange={setPack("weight")} required />
          <Input label="Largo (cm)" type="number" min="0.1" step="0.1" value={pkg.length} onChange={setPack("length")} required />
          <Input label="Ancho (cm)" type="number" min="0.1" step="0.1" value={pkg.width} onChange={setPack("width")} required />
          <Input label="Alto (cm)" type="number" min="0.1" step="0.1" value={pkg.height} onChange={setPack("height")} required />
          <div className="flex items-end">
            <button type="button" onClick={quote} disabled={quoting || busy} className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#e8f4fd] px-3 py-2.5 text-sm font-bold text-[#1a3a6b] hover:bg-[#d7ecf9] disabled:opacity-60">
              {quoting ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}Cotizar
            </button>
          </div>
        </div>
      </div>

      {options ? (
        <div role="radiogroup" aria-label="Paqueterías disponibles" className="space-y-2">
          {options.map((option) => {
            const checked = option.id === selectedId;
            const isCustomerChoice = option.id === `${order.shippingCarrier}:${order.shippingService}`;
            return (
              <label key={option.id} className={`flex cursor-pointer items-center gap-3 rounded-xl border p-3 transition ${checked ? "border-[#2eb8d4] bg-[#e8f4fd] ring-1 ring-[#2eb8d4]" : "border-slate-200 hover:border-[#2eb8d4]/50"}`}>
                <input type="radio" name="labelOption" checked={checked} onChange={() => setSelectedId(option.id)} className="h-4 w-4 shrink-0 accent-[#1a3a6b]" />
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-bold text-[#1a3a6b]">{option.serviceName}{isCustomerChoice && <span className="ml-2 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-black uppercase text-emerald-700">Elegido por el cliente</span>}</span>
                  <span className="block text-xs text-[#1a3a6b]/60">{option.deliveryEstimate}</span>
                </span>
                <span className="shrink-0 text-sm font-black text-[#1a3a6b]">{formatPrice(option.price)}</span>
              </label>
            );
          })}
        </div>
      ) : (
        <p className="rounded-xl border border-dashed border-slate-200 p-3 text-sm text-[#1a3a6b]/60">
          {selectedId
            ? <>Se usará el servicio que eligió el cliente ({order.shippingDescription ?? selectedId}). Pulsa <strong>Cotizar</strong> si cambiaste las medidas o quieres usar otra paquetería.</>
            : <>Este pedido no tiene paquetería registrada. Pulsa <strong>Cotizar</strong> para elegir una.</>}
        </p>
      )}

      <div className="flex justify-end">
        <button disabled={busy || quoting || !selectedId} className="inline-flex items-center gap-2 rounded-xl bg-[#1a3a6b] px-5 py-3 font-bold text-white hover:bg-[#2eb8d4] disabled:opacity-60">
          {busy ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Truck className="h-4 w-4" />}
          {busy ? "Generando guía…" : "Generar guía"}
        </button>
      </div>
    </form>
  );
}

function Input({ label, value, onChange, className = "", type = "text", ...props }: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
  min?: string;
  step?: string;
}) {
  return (
    <label className={`block text-xs font-bold text-[#1a3a6b] ${className}`}>
      {label}
      <input {...props} type={type} value={value} onChange={(event) => onChange(event.target.value)} className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm font-normal outline-none focus:border-[#2eb8d4]" />
    </label>
  );
}

"use client";

import { FormEvent, useState } from "react";
import { LoaderCircle, MapPin, Package, Save, Truck } from "lucide-react";
import {
  LABEL_PRINT_SIZES,
  SHIPPING_CARRIERS,
  type LabelPrintSize,
  type ShippingAddress,
  type ShippingSettings,
} from "@/lib/shipping-settings";

type Feedback = { tone: "success" | "error"; message: string };
type PackageForm = Record<"content" | "weight" | "length" | "width" | "height", string>;

export default function ShippingSettingsPanel({ initialSettings, enviaStatus }: {
  initialSettings: ShippingSettings;
  enviaStatus: { configured: boolean; environment: "production" | "sandbox" };
}) {
  const [origin, setOrigin] = useState<ShippingAddress>(initialSettings.origin);
  const [carriers, setCarriers] = useState(initialSettings.carriers);
  const [pkg, setPkg] = useState<PackageForm>({
    content: initialSettings.package.content,
    weight: String(initialSettings.package.weight),
    length: String(initialSettings.package.length),
    width: String(initialSettings.package.width),
    height: String(initialSettings.package.height),
  });
  const [printSize, setPrintSize] = useState<LabelPrintSize>(initialSettings.printSize);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<Feedback | null>(null);

  const setOriginField = (field: keyof ShippingAddress) => (value: string) => { setOrigin((current) => ({ ...current, [field]: value })); setFeedback(null); };
  const setPkgField = (field: keyof PackageForm) => (value: string) => { setPkg((current) => ({ ...current, [field]: value })); setFeedback(null); };

  function toggleCarrier(id: string) {
    setCarriers((current) => current.includes(id) ? current.filter((carrier) => carrier !== id) : [...current, id]);
    setFeedback(null);
  }

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setFeedback(null);
    try {
      const response = await fetch("/api/admin/shipping-settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          origin,
          carriers,
          printSize,
          package: { content: pkg.content, weight: Number(pkg.weight), length: Number(pkg.length), width: Number(pkg.width), height: Number(pkg.height) },
        }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "No se pudo guardar la configuración.");
      setOrigin(result.settings.origin);
      setFeedback({ tone: "success", message: `Configuración guardada. Origen en ${result.stateName || result.settings.origin.state}. Las nuevas cotizaciones del checkout ya la usan.` });
    } catch (reason) {
      setFeedback({ tone: "error", message: reason instanceof Error ? reason.message : "No se pudo guardar la configuración." });
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={save} className="space-y-5">
      <article className="rounded-2xl bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 className="font-black text-[#1a3a6b]">Envíos con Envia.com</h2>
            <p className="text-xs text-[#1a3a6b]/50">Esta configuración se usa para cotizar en el checkout y para generar las guías de los pedidos.</p>
          </div>
          <div className="flex flex-wrap gap-2 text-xs font-bold">
            <span className={`rounded-full px-3 py-1 ${enviaStatus.configured ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"}`}>{enviaStatus.configured ? "API conectada" : "Falta ENVIA_API_KEY"}</span>
            <span className={`rounded-full px-3 py-1 ${enviaStatus.environment === "production" ? "bg-[#1a3a6b] text-white" : "bg-amber-50 text-amber-800"}`}>{enviaStatus.environment === "production" ? "Producción: guías reales" : "Modo pruebas (sandbox)"}</span>
          </div>
        </div>
        {enviaStatus.environment === "sandbox" && <p className="mt-3 rounded-xl bg-amber-50 p-3 text-xs text-amber-800">En modo pruebas las guías no son válidas para enviar paquetes. Para operar, cambia <code className="font-mono">ENVIA_ENV=production</code> y usa la API key de producción en las variables de entorno.</p>}
      </article>

      <article className="rounded-2xl bg-white p-5 shadow-sm">
        <h3 className="mb-1 flex items-center gap-2 font-black text-[#1a3a6b]"><MapPin className="h-4 w-4 text-[#2eb8d4]" />Dirección de origen (recolección)</h3>
        <p className="mb-4 text-xs text-[#1a3a6b]/50">Es donde la paquetería recoge los paquetes y aparece como remitente en la etiqueta. El estado se toma del código postal.</p>
        <div className="grid gap-3 sm:grid-cols-6">
          <Input className="sm:col-span-3" label="Nombre del remitente" value={origin.name} onChange={setOriginField("name")} required />
          <Input className="sm:col-span-3" label="Empresa" value={origin.company} onChange={setOriginField("company")} />
          <Input className="sm:col-span-3" label="Teléfono (10 dígitos)" value={origin.phone} onChange={setOriginField("phone")} required />
          <Input className="sm:col-span-3" label="Correo" type="email" value={origin.email} onChange={setOriginField("email")} />
          <Input className="sm:col-span-4" label="Calle" value={origin.street} onChange={setOriginField("street")} required />
          <Input className="sm:col-span-2" label="Número" value={origin.number} onChange={setOriginField("number")} />
          <Input className="sm:col-span-2" label="Colonia" value={origin.district} onChange={setOriginField("district")} required />
          <Input className="sm:col-span-2" label="Ciudad" value={origin.city} onChange={setOriginField("city")} required />
          <Input className="sm:col-span-2" label="Código postal" value={origin.postalCode} onChange={setOriginField("postalCode")} required />
          <Input className="sm:col-span-6" label="Referencias" value={origin.reference} onChange={setOriginField("reference")} placeholder="Entre calles, horario de recolección…" />
        </div>
      </article>

      <div className="grid gap-5 lg:grid-cols-2">
        <article className="rounded-2xl bg-white p-5 shadow-sm">
          <h3 className="mb-1 flex items-center gap-2 font-black text-[#1a3a6b]"><Truck className="h-4 w-4 text-[#2eb8d4]" />Paqueterías activas</h3>
          <p className="mb-4 text-xs text-[#1a3a6b]/50">Solo estas se cotizan en el checkout. Deben estar habilitadas en tu cuenta de Envia.</p>
          <div className="grid gap-2 sm:grid-cols-2">
            {SHIPPING_CARRIERS.map((carrier) => (
              <label key={carrier.id} className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 px-3 py-2.5 text-sm font-bold text-[#1a3a6b] has-[:checked]:border-[#2eb8d4] has-[:checked]:bg-[#e8f4fd]">
                <input type="checkbox" checked={carriers.includes(carrier.id)} onChange={() => toggleCarrier(carrier.id)} className="h-4 w-4 accent-[#1a3a6b]" />
                {carrier.label}
              </label>
            ))}
          </div>
          <label className="mt-4 block text-xs font-bold text-[#1a3a6b]">
            Formato de etiqueta
            <select value={printSize} onChange={(event) => { setPrintSize(event.target.value as LabelPrintSize); setFeedback(null); }} className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm font-normal outline-none focus:border-[#2eb8d4]">
              {LABEL_PRINT_SIZES.map((size) => <option key={size.id} value={size.id}>{size.label}</option>)}
            </select>
          </label>
        </article>

        <article className="rounded-2xl bg-white p-5 shadow-sm">
          <h3 className="mb-1 flex items-center gap-2 font-black text-[#1a3a6b]"><Package className="h-4 w-4 text-[#2eb8d4]" />Caja estándar</h3>
          <p className="mb-4 text-xs text-[#1a3a6b]/50">Medidas y peso con los que se cotiza en el checkout. Al generar cada guía puedes ajustarlos al paquete real.</p>
          <div className="grid gap-3 sm:grid-cols-4">
            <Input className="sm:col-span-4" label="Contenido declarado" value={pkg.content} onChange={setPkgField("content")} required />
            <Input label="Peso (kg)" type="number" min="0.01" step="0.01" value={pkg.weight} onChange={setPkgField("weight")} required />
            <Input label="Largo (cm)" type="number" min="0.1" step="0.1" value={pkg.length} onChange={setPkgField("length")} required />
            <Input label="Ancho (cm)" type="number" min="0.1" step="0.1" value={pkg.width} onChange={setPkgField("width")} required />
            <Input label="Alto (cm)" type="number" min="0.1" step="0.1" value={pkg.height} onChange={setPkgField("height")} required />
          </div>
        </article>
      </div>

      <div className="flex flex-col items-end gap-3">
        {feedback && <p role={feedback.tone === "error" ? "alert" : "status"} className={`w-full rounded-xl p-3 text-sm font-semibold ${feedback.tone === "success" ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"}`}>{feedback.message}</p>}
        <button disabled={saving} className="inline-flex items-center gap-2 rounded-xl bg-[#1a3a6b] px-5 py-3 font-bold text-white hover:bg-[#2eb8d4] disabled:opacity-60">
          {saving ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          {saving ? "Guardando…" : "Guardar configuración"}
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

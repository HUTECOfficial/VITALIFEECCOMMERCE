"use client";

import Image from "next/image";
import { FormEvent, useState } from "react";
import { ImageUp, Save } from "lucide-react";
import {
  siteContentDefinitions,
  siteContentPages,
  type AllSiteContent,
  type SiteContentFieldDefinition,
  type SiteContentPage,
  type SiteContentValue,
} from "@/data/siteContent";

type Feedback = { tone: "success" | "error"; message: string };

export default function SiteContentEditor({ initialContent }: { initialContent: AllSiteContent }) {
  const [activePage, setActivePage] = useState<SiteContentPage>(siteContentPages[0]);
  const [content, setContent] = useState(initialContent);
  const [saving, setSaving] = useState<string | null>(null);
  const [uploading, setUploading] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<Record<string, Feedback>>({});
  const pageDefinition = siteContentDefinitions[activePage];

  function updateField(section: string, field: string, value: SiteContentValue) {
    setContent((current) => ({
      ...current,
      [activePage]: {
        ...current[activePage],
        [section]: { ...current[activePage][section], [field]: value },
      },
    }));
    setFeedback((current) => {
      const next = { ...current };
      delete next[`${activePage}.${section}`];
      return next;
    });
  }

  async function saveSection(event: FormEvent<HTMLFormElement>, section: string) {
    event.preventDefault();
    const key = `${activePage}.${section}`;
    setSaving(key);
    setFeedback((current) => {
      const next = { ...current };
      delete next[key];
      return next;
    });
    try {
      const response = await fetch("/api/admin/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ page: activePage, section, content: content[activePage][section] }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "No se pudo guardar la sección.");
      setFeedback((current) => ({ ...current, [key]: { tone: "success", message: "Sección guardada correctamente." } }));
    } catch (reason) {
      setFeedback((current) => ({
        ...current,
        [key]: { tone: "error", message: reason instanceof Error ? reason.message : "No se pudo guardar la sección." },
      }));
    } finally {
      setSaving(null);
    }
  }

  async function uploadImage(section: string, field: string, file: File) {
    const fieldKey = `${activePage}.${section}.${field}`;
    const sectionKey = `${activePage}.${section}`;
    setUploading(fieldKey);
    setFeedback((current) => {
      const next = { ...current };
      delete next[sectionKey];
      return next;
    });
    try {
      const formData = new FormData();
      formData.set("image", file);
      const response = await fetch("/api/admin/uploads?scope=content", { method: "POST", body: formData });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "No se pudo subir la imagen.");
      updateField(section, field, result.url);
      setFeedback((current) => ({ ...current, [sectionKey]: { tone: "success", message: "Imagen cargada. Guarda la sección para publicar el cambio." } }));
    } catch (reason) {
      setFeedback((current) => ({
        ...current,
        [sectionKey]: { tone: "error", message: reason instanceof Error ? reason.message : "No se pudo subir la imagen." },
      }));
    } finally {
      setUploading(null);
    }
  }

  return (
    <section className="mt-6 rounded-3xl border border-white bg-white/90 p-4 shadow-sm sm:p-6" aria-labelledby="site-content-title">
      <div className="mb-5">
        <p className="text-xs font-black uppercase tracking-[0.18em] text-[#2eb8d4]">Contenido público</p>
        <h2 id="site-content-title" className="mt-1 text-2xl font-black text-[#1a3a6b]">Editor por página y sección</h2>
        <p className="mt-1 text-sm text-[#1a3a6b]/60">Cada tarjeta se guarda de forma independiente.</p>
      </div>

      <div className="mb-6 flex gap-2 overflow-x-auto pb-2" role="tablist" aria-label="Páginas del sitio">
        {siteContentPages.map((page) => (
          <button
            key={page}
            type="button"
            role="tab"
            aria-selected={activePage === page}
            aria-controls={`content-panel-${page}`}
            id={`content-tab-${page}`}
            onClick={() => setActivePage(page)}
            className={`shrink-0 rounded-xl px-4 py-2.5 text-sm font-bold transition-colors ${activePage === page ? "bg-[#1a3a6b] text-white" : "bg-[#e8f4fd] text-[#1a3a6b] hover:bg-[#d7ecf9]"}`}
          >
            {siteContentDefinitions[page].label}
          </button>
        ))}
      </div>

      <div id={`content-panel-${activePage}`} role="tabpanel" aria-labelledby={`content-tab-${activePage}`} className="grid gap-5 lg:grid-cols-2">
        {Object.entries(pageDefinition.sections).map(([section, sectionDefinition]) => {
          const sectionKey = `${activePage}.${section}`;
          const sectionFeedback = feedback[sectionKey];
          return (
            <form key={sectionKey} onSubmit={(event) => saveSection(event, section)} noValidate className="flex flex-col rounded-2xl border border-[#1a3a6b]/10 bg-[#f9fcfe] p-4 sm:p-5">
              <div className="mb-4 border-b border-[#1a3a6b]/10 pb-3">
                <h3 className="text-lg font-black text-[#1a3a6b]">{sectionDefinition.label}</h3>
                <p className="text-xs text-[#1a3a6b]/50">Sección: {section}</p>
              </div>
              <div className="grid flex-1 gap-4">
                {Object.entries(sectionDefinition.fields).map(([field, definition]) => (
                  <ContentField
                    key={field}
                    id={`content-${activePage}-${section}-${field}`}
                    definition={definition}
                    value={content[activePage][section][field]}
                    uploading={uploading === `${activePage}.${section}.${field}`}
                    onChange={(value) => updateField(section, field, value)}
                    onUpload={(file) => uploadImage(section, field, file)}
                  />
                ))}
              </div>
              <div className="mt-5 flex flex-col gap-3 border-t border-[#1a3a6b]/10 pt-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-h-5 text-sm font-semibold" aria-live="polite">
                  {sectionFeedback && <p role={sectionFeedback.tone === "error" ? "alert" : "status"} className={sectionFeedback.tone === "error" ? "text-rose-700" : "text-emerald-700"}>{sectionFeedback.message}</p>}
                </div>
                <button type="submit" disabled={saving === sectionKey || uploading?.startsWith(`${sectionKey}.`)} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#2eb8d4] px-4 py-2.5 text-sm font-black text-white transition-colors hover:bg-[#1a3a6b] disabled:cursor-not-allowed disabled:opacity-60">
                  <Save className="h-4 w-4" />
                  {saving === sectionKey ? "Guardando..." : "Guardar sección"}
                </button>
              </div>
            </form>
          );
        })}
      </div>
    </section>
  );
}

function ContentField({ id, definition, value, uploading, onChange, onUpload }: {
  id: string;
  definition: SiteContentFieldDefinition;
  value: SiteContentValue;
  uploading: boolean;
  onChange: (value: SiteContentValue) => void;
  onUpload: (file: File) => void;
}) {
  if (definition.type === "boolean") {
    return (
      <label htmlFor={id} className="flex min-h-11 items-center gap-3 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-bold text-[#1a3a6b]">
        <input id={id} type="checkbox" checked={Boolean(value)} onChange={(event) => onChange(event.target.checked)} className="h-5 w-5 rounded border-slate-300 accent-[#2eb8d4]" />
        {definition.label}
      </label>
    );
  }

  const sharedClass = "mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 font-normal text-[#1a3a6b] outline-none focus:border-[#2eb8d4] focus:ring-2 focus:ring-[#2eb8d4]/15";
  const stringValue = typeof value === "string" ? value : "";
  const canPreview = definition.type === "image" && (stringValue.startsWith("/") && !stringValue.startsWith("//") || /^https?:\/\//.test(stringValue));

  return (
    <label htmlFor={id} className="block text-sm font-bold text-[#1a3a6b]">
      {definition.label}
      {definition.type === "textarea" ? (
        <textarea id={id} value={stringValue} maxLength={definition.maxLength} rows={4} onChange={(event) => onChange(event.target.value)} className={`${sharedClass} resize-y`} />
      ) : (
        <input
          id={id}
          type={definition.type === "number" ? "number" : definition.type === "url" || definition.type === "image" ? "url" : "text"}
          value={definition.type === "number" ? Number(value) : stringValue}
          min={definition.min}
          max={definition.max}
          maxLength={definition.maxLength}
          step={definition.type === "number" ? "any" : undefined}
          onChange={(event) => onChange(definition.type === "number" ? Number(event.target.value) : event.target.value)}
          className={sharedClass}
        />
      )}
      {definition.type === "image" && (
        <span className="mt-2 grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
          {canPreview ? (
            <span className="relative block h-28 overflow-hidden rounded-xl border border-slate-200 bg-white">
              <Image src={stringValue} alt="Vista previa" fill sizes="320px" unoptimized className="object-contain p-2" />
            </span>
          ) : <span className="flex h-20 items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white text-xs font-medium text-slate-500">Sin vista previa</span>}
          <span className="relative inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-xl border border-[#1a3a6b]/15 bg-white px-4 py-2.5 text-sm font-bold text-[#1a3a6b] hover:bg-[#e8f4fd]">
            <ImageUp className="h-4 w-4" />{uploading ? "Subiendo..." : "Subir imagen"}
            <input type="file" accept="image/jpeg,image/png,image/webp" disabled={uploading} onChange={(event) => { const file = event.target.files?.[0]; if (file) onUpload(file); event.target.value = ""; }} className="absolute inset-0 cursor-pointer opacity-0" aria-label={`Subir ${definition.label.toLowerCase()}`} />
          </span>
        </span>
      )}
    </label>
  );
}

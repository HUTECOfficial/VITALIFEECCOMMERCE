"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { LockKeyhole, ShieldCheck } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    const response = await fetch("/api/admin/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    const result = await response.json();
    if (!response.ok) {
      setError(result.error || "No se pudo iniciar sesión.");
      setLoading(false);
      return;
    }
    router.replace("/admin");
    router.refresh();
  }

  return (
    <section className="min-h-[70vh] px-4 py-12 sm:py-20">
      <form onSubmit={handleSubmit} className="mx-auto max-w-md rounded-3xl border border-white/70 bg-white/80 p-7 shadow-2xl backdrop-blur-xl sm:p-9">
        <div className="mb-7 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#1a3a6b] text-white shadow-lg">
          <ShieldCheck className="h-7 w-7" />
        </div>
        <p className="text-xs font-black uppercase tracking-[0.2em] text-[#2eb8d4]">Vital Life</p>
        <h1 className="mt-2 text-3xl font-black text-[#1a3a6b]">Administración</h1>
        <p className="mt-2 text-sm text-[#1a3a6b]/60">Acceso exclusivo para gestionar el catálogo y consultar ventas.</p>
        <label className="mt-7 block text-sm font-bold text-[#1a3a6b]" htmlFor="password">Contraseña</label>
        <div className="mt-2 flex items-center gap-2 rounded-xl border border-[#1a3a6b]/15 bg-white px-3">
          <LockKeyhole className="h-4 w-4 text-[#2eb8d4]" />
          <input id="password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} required className="w-full bg-transparent py-3 outline-none" autoComplete="current-password" />
        </div>
        {error && <p className="mt-3 text-sm font-medium text-rose-600">{error}</p>}
        <button disabled={loading} className="mt-6 w-full rounded-xl bg-[#1a3a6b] px-5 py-3.5 font-bold text-white transition hover:bg-[#2eb8d4] disabled:cursor-wait disabled:opacity-60">
          {loading ? "Verificando…" : "Entrar al CMS"}
        </button>
      </form>
    </section>
  );
}

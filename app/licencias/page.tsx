"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import LicenseCard from "@/components/LicenseCard";
import { loadLicenses, removeLicense, saveLicenses, type StoredLicense } from "@/lib/licenseStore";

export default function LicensesPage() {
  const [list, setList] = useState<StoredLicense[] | null>(null);
  const [key, setKey] = useState("");
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  useEffect(() => setList(loadLicenses()), []);

  async function recover(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    const res = await fetch("/api/license/verify", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ key }) });
    const data = await res.json();
    if (!data.valid) return setMsg({ ok: false, text: "Esa llave no es válida. Revisa que la hayas copiado completa." });
    setList(saveLicenses([data.license]));
    setKey("");
    setMsg({ ok: true, text: "Licencia verificada y agregada." });
  }

  return (
    <div className="wrap py-12">
      <p className="label text-meta">Cuenta / licencias</p>
      <h1 className="h-lg mt-2">Mis licencias.</h1>
      <p className="mt-3 max-w-2xl text-meta">
        Aquí están las licencias que compraste desde este navegador. ¿Compraste en otro dispositivo? Pega tu llave abajo para recuperarla.
      </p>
      <div className="mt-8 space-y-4">
        {list === null ? (
          <p className="text-meta">Cargando…</p>
        ) : list.length ? (
          list.map((l) => <LicenseCard key={l.key} l={l} onRemove={() => setList(removeLicense(l.key))} />)
        ) : (
          <div className="border border-dashed border-line p-10 text-center">
            <p className="text-meta">Todavía no hay licencias en este navegador.</p>
            <Link href="/plugins" className="btn-primary mt-4">Ver el catálogo</Link>
          </div>
        )}
      </div>
      <form onSubmit={recover} className="mt-10 border border-line bg-surface p-5">
        <p className="label text-meta">Recuperar una licencia</p>
        <div className="mt-3 flex flex-col gap-2 sm:flex-row">
          <input className="input font-mono text-[13px]" placeholder="Pega tu llave de licencia" value={key} onChange={(e) => setKey(e.target.value)} />
          <button className="btn-outline" disabled={!key.includes(".")}>Verificar</button>
        </div>
        {msg && <p className={`mt-2 text-[13px] ${msg.ok ? "text-ok" : "text-coral"}`}>{msg.text}</p>}
      </form>
    </div>
  );
}

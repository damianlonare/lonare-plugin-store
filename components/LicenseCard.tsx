"use client";
import { useState } from "react";
import Link from "next/link";
import { getPlugin } from "@/lib/plugins";
import { downloadLicenseFile, type StoredLicense } from "@/lib/licenseStore";

const MONTHS = ["enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre"];
// Manual format: server (Cloudflare) and browser can disagree on Intl output, which breaks hydration.
const fmtDate = (sec: number) => { const d = new Date(sec * 1000); return `${d.getUTCDate()} de ${MONTHS[d.getUTCMonth()]} de ${d.getUTCFullYear()}`; };

const OS = [
  { id: "mac", label: "macOS (.pkg)" },
  { id: "win", label: "Windows (.exe)" },
  { id: "linux", label: "Linux (.tar.gz)" },
] as const;

export default function LicenseCard({ l, onRemove }: { l: StoredLicense; onRemove?: () => void }) {
  const p = getPlugin(l.slug);
  const [copied, setCopied] = useState(false);
  const name = p?.name ?? l.slug;
  const copy = async () => {
    try { await navigator.clipboard.writeText(l.key); setCopied(true); setTimeout(() => setCopied(false), 1500); } catch {}
  };
  const oses = OS.filter((o) => !p || p.platforms.includes(o.id === "mac" ? "macOS" : o.id === "win" ? "Windows" : "Linux"));
  return (
    <article className="border border-line bg-white">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line px-4 py-2">
        <span className="label text-meta">{l.serial}</span>
        <span className={`label ${l.demo ? "text-coral" : "text-ok"}`}>● {l.demo ? "Licencia de prueba" : "Perpetua · activa"}</span>
      </div>
      <div className="grid gap-6 p-4 md:grid-cols-12">
        <div className="md:col-span-4">
          <h3 className="text-xl font-semibold tracking-[-0.02em]">
            {p ? <Link href={`/plugins/${p.slug}`} className="hover:text-coral">{name}</Link> : name}
          </h3>
          <p className="mt-1 text-[13px] text-meta">v{p?.version} · {l.email}</p>
          <p className="text-[13px] text-meta">Emitida el {fmtDate(l.issued)}</p>
        </div>
        <div className="md:col-span-8">
          <p className="label mb-2 text-meta">Llave de licencia</p>
          <div className="flex">
            <code className="block min-w-0 flex-1 truncate border border-line bg-surface px-3 py-2 font-mono text-[12px]" title={l.key}>{l.key}</code>
            <button type="button" onClick={copy} className="label border border-l-0 border-ink px-3 text-ink hover:bg-ink hover:text-white">
              {copied ? "Copiada" : "Copiar"}
            </button>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            <button type="button" className="btn-outline px-3 py-2" onClick={() => downloadLicenseFile(l, name)}>Archivo de licencia</button>
            {oses.map((o) => (
              <a key={o.id} className="btn-primary px-3 py-2"
                href={`/api/download?os=${o.id}&key=${encodeURIComponent(l.key)}`}>
                ↓ {o.label}
              </a>
            ))}
            {onRemove && <button type="button" className="link ml-auto text-[13px]" onClick={onRemove}>Quitar de este navegador</button>}
          </div>
        </div>
      </div>
    </article>
  );
}

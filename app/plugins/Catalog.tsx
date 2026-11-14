"use client";
import { useMemo, useState } from "react";
import { CATEGORIES, PLUGINS, type Format, type Platform } from "@/lib/plugins";
import PluginCard from "@/components/PluginCard";

const FORMATS: Format[] = ["VST3", "AU", "CLAP", "AAX"];
const PLATFORMS: Platform[] = ["macOS", "Windows", "Linux"];
type Sort = "destacados" | "precio-asc" | "precio-desc" | "nombre";

function Toggle({ on, onClick, children }: { on: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button type="button" aria-pressed={on} onClick={onClick} className={on ? "chip-on" : "chip hover:border-ink"}>
      {children}
    </button>
  );
}

export default function Catalog() {
  const [cat, setCat] = useState<string | null>(null);
  const [fmt, setFmt] = useState<Format[]>([]);
  const [os, setOs] = useState<Platform[]>([]);
  const [q, setQ] = useState("");
  const [sort, setSort] = useState<Sort>("destacados");

  const list = useMemo(() => {
    const out = PLUGINS.filter((p) =>
      (!cat || p.category === cat) &&
      fmt.every((f) => p.formats.includes(f)) &&
      os.every((o) => p.platforms.includes(o)) &&
      (!q || `${p.name} ${p.tagline} ${p.category}`.toLowerCase().includes(q.toLowerCase())));
    if (sort === "precio-asc") out.sort((a, b) => a.price - b.price);
    if (sort === "precio-desc") out.sort((a, b) => b.price - a.price);
    if (sort === "nombre") out.sort((a, b) => a.name.localeCompare(b.name));
    if (sort === "destacados") out.sort((a, b) => Number(!!b.featured) - Number(!!a.featured));
    return out;
  }, [cat, fmt, os, q, sort]);

  const flip = <T,>(arr: T[], v: T) => (arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]);
  const any = cat || fmt.length || os.length || q;

  return (
    <div className="mt-8 grid gap-8 lg:grid-cols-12">
      <aside className="space-y-6 lg:col-span-3">
        <input className="input" placeholder="Buscar plugin…" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Buscar" />
        <div>
          <p className="label mb-2 text-meta">Tipo</p>
          <div className="flex flex-wrap gap-1">
            <Toggle on={!cat} onClick={() => setCat(null)}>Todos</Toggle>
            {CATEGORIES.map((c) => <Toggle key={c} on={cat === c} onClick={() => setCat(cat === c ? null : c)}>{c}</Toggle>)}
          </div>
        </div>
        <div>
          <p className="label mb-2 text-meta">Formato</p>
          <div className="flex flex-wrap gap-1">
            {FORMATS.map((f) => <Toggle key={f} on={fmt.includes(f)} onClick={() => setFmt(flip(fmt, f))}>{f}</Toggle>)}
          </div>
        </div>
        <div>
          <p className="label mb-2 text-meta">Sistema</p>
          <div className="flex flex-wrap gap-1">
            {PLATFORMS.map((o) => <Toggle key={o} on={os.includes(o)} onClick={() => setOs(flip(os, o))}>{o}</Toggle>)}
          </div>
        </div>
        {any ? (
          <button className="link text-[13px]" onClick={() => { setCat(null); setFmt([]); setOs([]); setQ(""); }}>Limpiar filtros</button>
        ) : null}
      </aside>
      <section className="lg:col-span-9">
        <div className="flex items-center justify-between border-b border-line pb-3">
          <p className="label text-meta">{list.length} {list.length === 1 ? "plugin" : "plugins"}</p>
          <label className="label flex items-center gap-2 text-meta">
            Ordenar
            <select className="border border-line bg-white px-2 py-1 font-sans text-[13px] normal-case tracking-normal text-body"
              value={sort} onChange={(e) => setSort(e.target.value as Sort)}>
              <option value="destacados">Destacados</option>
              <option value="precio-asc">Precio: menor a mayor</option>
              <option value="precio-desc">Precio: mayor a menor</option>
              <option value="nombre">Nombre</option>
            </select>
          </label>
        </div>
        {list.length ? (
          <div className="mt-6 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {list.map((p, i) => <PluginCard key={p.slug} plugin={p} index={i} />)}
          </div>
        ) : (
          <div className="mt-6 border border-dashed border-line p-10 text-center text-meta">
            Ningún plugin coincide con esos filtros.
          </div>
        )}
      </section>
    </div>
  );
}

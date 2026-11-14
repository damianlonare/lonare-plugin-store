"use client";
import { useMemo, useState } from "react";
import { CATEGORIES, CATEGORY_LABEL, getPlugins, type Category, type Format, type Platform } from "@/lib/plugins";
import PluginCard from "@/components/PluginCard";
import { useLang } from "@/components/LangProvider";

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
  const { lang, t } = useLang();
  const c = t.catalog;
  const [cat, setCat] = useState<Category | null>(null);
  const [fmt, setFmt] = useState<Format[]>([]);
  const [os, setOs] = useState<Platform[]>([]);
  const [q, setQ] = useState("");
  const [sort, setSort] = useState<Sort>("destacados");

  const list = useMemo(() => {
    const out = getPlugins(lang).filter((p) =>
      (!cat || p.category === cat) &&
      fmt.every((f) => p.formats.includes(f)) &&
      os.every((o) => p.platforms.includes(o)) &&
      (!q || `${p.name} ${p.tagline} ${CATEGORY_LABEL[p.category][lang]}`.toLowerCase().includes(q.toLowerCase())));
    if (sort === "precio-asc") out.sort((a, b) => a.price - b.price);
    if (sort === "precio-desc") out.sort((a, b) => b.price - a.price);
    if (sort === "nombre") out.sort((a, b) => a.name.localeCompare(b.name));
    if (sort === "destacados") out.sort((a, b) => Number(!!b.featured) - Number(!!a.featured));
    return out;
  }, [cat, fmt, os, q, sort, lang]);

  const flip = <T,>(arr: T[], v: T) => (arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]);
  const any = cat || fmt.length || os.length || q;

  return (
    <div className="mt-8 grid gap-8 lg:grid-cols-12">
      <aside className="space-y-6 lg:col-span-3">
        <input className="input" placeholder={c.search} value={q} onChange={(e) => setQ(e.target.value)} aria-label={c.search} />
        <div>
          <p className="label mb-2 text-meta">{c.type}</p>
          <div className="flex flex-wrap gap-1">
            <Toggle on={!cat} onClick={() => setCat(null)}>{c.all}</Toggle>
            {CATEGORIES.map((k) => <Toggle key={k} on={cat === k} onClick={() => setCat(cat === k ? null : k)}>{CATEGORY_LABEL[k][lang]}</Toggle>)}
          </div>
        </div>
        <div>
          <p className="label mb-2 text-meta">{c.format}</p>
          <div className="flex flex-wrap gap-1">
            {FORMATS.map((f) => <Toggle key={f} on={fmt.includes(f)} onClick={() => setFmt(flip(fmt, f))}>{f}</Toggle>)}
          </div>
        </div>
        <div>
          <p className="label mb-2 text-meta">{c.system}</p>
          <div className="flex flex-wrap gap-1">
            {PLATFORMS.map((o) => <Toggle key={o} on={os.includes(o)} onClick={() => setOs(flip(os, o))}>{o}</Toggle>)}
          </div>
        </div>
        {any ? (
          <button className="link text-[13px]" onClick={() => { setCat(null); setFmt([]); setOs([]); setQ(""); }}>{c.clear}</button>
        ) : null}
      </aside>
      <section className="lg:col-span-9">
        <div className="flex items-center justify-between border-b border-line pb-3">
          <p className="label text-meta">{list.length} {list.length === 1 ? t.card.plugin : t.card.plugins}</p>
          <label className="label flex items-center gap-2 text-meta">
            {c.sort}
            <select className="border border-line bg-white px-2 py-1 font-sans text-[13px] normal-case tracking-normal text-body"
              value={sort} onChange={(e) => setSort(e.target.value as Sort)}>
              {(Object.keys(c.sorts) as Sort[]).map((k) => <option key={k} value={k}>{c.sorts[k]}</option>)}
            </select>
          </label>
        </div>
        {list.length ? (
          <div className="mt-6 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {list.map((p, i) => <PluginCard key={p.slug} plugin={p} index={i} lang={lang} />)}
          </div>
        ) : (
          <div className="mt-6 border border-dashed border-line p-10 text-center text-meta">{c.empty}</div>
        )}
      </section>
    </div>
  );
}

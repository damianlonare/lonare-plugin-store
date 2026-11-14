import Link from "next/link";
import { BRAND, BUNDLE, CATEGORY_LABEL, getPlugins, usd } from "@/lib/plugins";
import { getDict } from "@/lib/lang";
import PluginArt from "@/components/PluginArt";
import PluginCard from "@/components/PluginCard";
import AddToCart from "@/components/AddToCart";

export default async function Home() {
  const { lang, t } = await getDict();
  const h = t.home;
  const plugins = getPlugins(lang);
  const flagship = plugins.find((p) => p.featured)!;
  const pct = BUNDLE.discount * 100;
  return (
    <>
      <section className="border-b border-line">
        <div className="wrap grid gap-10 py-14 md:grid-cols-12 md:py-20">
          <div className="md:col-span-7">
            <p className="label flex items-center gap-2 text-meta">
              <span className="inline-block h-1.5 w-1.5 bg-coral" /> {h.kicker(plugins.length)}
            </p>
            <h1 className="h-xl mt-6">
              {h.title[0]}<span className="text-coral">{h.title[1]}</span>{h.title[2]}
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-7 text-body/80">{h.sub}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/plugins" className="btn-primary">{h.ctaCatalog}</Link>
              <Link href={`/plugins/${flagship.slug}`} className="btn-outline">{h.ctaListen(flagship.name.split(" ")[0])}</Link>
            </div>
          </div>
          <div className="md:col-span-5">
            <div className="grid grid-cols-3 border border-line">
              {h.stats.map(([a, b], i) => (
                <div key={b} className={`p-4 ${i ? "border-l border-line" : ""}`}>
                  <p className={`font-display text-2xl font-bold ${i === 2 ? "text-coral" : "text-ink"}`}>{a}</p>
                  <p className="label mt-1 text-meta">{b}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 border border-line bg-surface p-4">
              <p className="label text-meta">{h.bundleLabel}</p>
              <p className="mt-1 font-display text-lg font-semibold text-ink">{h.bundle(BUNDLE.minItems, pct)}</p>
              <p className="text-[13px] text-meta">{h.bundleNote}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-line bg-surface">
        <div className="wrap grid items-center gap-10 py-14 md:grid-cols-2">
          <div className="border border-line"><PluginArt plugin={flagship} large /></div>
          <div>
            <p className="label text-coral">{h.featured} // {CATEGORY_LABEL[flagship.category][lang]}</p>
            <h2 className="h-lg mt-3">{flagship.name}</h2>
            <p className="mt-4 text-lg leading-7">{flagship.tagline}</p>
            <ul className="mt-6 divide-y divide-line border-y border-line">
              {flagship.features.slice(0, 3).map((f, i) => (
                <li key={f} className="flex gap-4 py-3">
                  <span className="label pt-1 text-coral">{String(i + 1).padStart(2, "0")}</span>{f}
                </li>
              ))}
            </ul>
            <div className="mt-6 flex flex-wrap items-center gap-4">
              <span className="font-display text-2xl font-bold text-ink">{usd(flagship.price)}</span>
              <AddToCart slug={flagship.slug} />
              <Link href={`/plugins/${flagship.slug}`} className="link">{h.details}</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="wrap py-14">
        <div className="flex flex-wrap items-end justify-between gap-4 border-b border-line pb-4">
          <h2 className="h-lg">{h.catalogTitle}</h2>
          <Link href="/plugins" className="link">{h.catalogAll}</Link>
        </div>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {plugins.slice(0, 6).map((p, i) => <PluginCard key={p.slug} plugin={p} index={i} lang={lang} />)}
        </div>
      </section>

      <section className="border-y border-line bg-surface">
        <div className="wrap py-14">
          <p className="label text-meta">{h.howLabel}</p>
          <h2 className="h-lg mt-2">{h.howTitle}</h2>
          <div className="mt-8 grid border border-line bg-white md:grid-cols-3">
            {h.how.map(([title, d], i) => (
              <div key={title} className={`p-6 ${i ? "border-t border-line md:border-l md:border-t-0" : ""}`}>
                <p className="font-display text-3xl font-bold text-coral">{String(i + 1).padStart(2, "0")}</p>
                <h3 className="h-md mt-3">{title}</h3>
                <p className="mt-2 text-meta">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="sobre" className="wrap grid gap-10 py-14 md:grid-cols-12">
        <div className="md:col-span-4">
          <p className="label text-meta">{h.aboutLabel}</p>
          <h2 className="h-lg mt-2">{BRAND.author}.</h2>
        </div>
        <div className="space-y-4 text-lg leading-7 md:col-span-8">
          <p>{h.about(BRAND.city[lang])}</p>
          <p className="text-meta">{h.about2}</p>
        </div>
      </section>

      <section id="faq" className="wrap pb-6">
        <div className="border-t border-line pt-10">
          <h2 className="h-lg">{h.faqTitle}</h2>
          <div className="mt-6 divide-y divide-line border-y border-line">
            {h.faq.map(([q, a]) => (
              <details key={q} className="group py-4">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-display text-lg font-semibold text-ink">
                  {q}<span className="text-coral group-open:rotate-45">+</span>
                </summary>
                <p className="mt-2 max-w-2xl text-meta">{a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

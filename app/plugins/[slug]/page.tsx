import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BUNDLE, CATEGORY_LABEL, getPlugin, getPlugins, usd } from "@/lib/plugins";
import { getDict } from "@/lib/lang";
import PluginArt from "@/components/PluginArt";
import PluginCard from "@/components/PluginCard";
import AddToCart from "@/components/AddToCart";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await getDict();
  const p = getPlugin((await params).slug, lang);
  return p ? { title: p.name, description: p.tagline } : {};
}

export default async function PluginPage({ params }: Props) {
  const { lang, t } = await getDict();
  const tp = t.product;
  const plugin = getPlugin((await params).slug, lang);
  if (!plugin) notFound();
  const others = getPlugins(lang).filter((p) => p.slug !== plugin.slug).slice(0, 3);
  const cat = CATEGORY_LABEL[plugin.category][lang];
  const pct = BUNDLE.discount * 100;
  const specs: [string, string][] = [
    [tp.specs.formats, plugin.formats.join(" · ")],
    [tp.specs.systems, plugin.platforms.join(" · ")],
    [tp.specs.latency, plugin.latency],
    [tp.specs.version, plugin.version],
    [tp.specs.license, tp.licenseVal],
    [tp.specs.activation, tp.activationVal],
  ];
  return (
    <>
      <div className="wrap pt-8">
        <nav className="label text-meta">
          <Link href="/plugins" className="hover:text-ink">{tp.catalog}</Link> / {cat} / <span className="text-ink">{plugin.name}</span>
        </nav>
      </div>
      <section className="wrap grid gap-10 py-8 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <div className="border border-line"><PluginArt plugin={plugin} large /></div>
          <div className="mt-6 border border-line">
            <div className="flex items-center justify-between border-b border-line px-4 py-2">
              <p className="label text-meta">{tp.listen}</p>
              <p className="label text-meta">{tp.beforeAfter}</p>
            </div>
            <div className="p-4 text-[13px] text-meta">{tp.audioNote(plugin.slug)}</div>
          </div>
        </div>
        <div className="lg:col-span-5">
          <p className="label text-coral">{cat}{plugin.isNew ? ` · ${tp.newTag}` : ""}</p>
          <h1 className="h-lg mt-2">{plugin.name}</h1>
          <p className="mt-4 text-lg leading-7">{plugin.tagline}</p>
          <div className="mt-6 border border-ink p-5">
            <div className="flex items-baseline justify-between">
              <span className="font-display text-3xl font-bold text-ink">{usd(plugin.price)}</span>
              <span className="label text-meta">{tp.oneTime}</span>
            </div>
            <div className="mt-4"><AddToCart slug={plugin.slug} full /></div>
            <p className="mt-3 text-[13px] text-meta">{tp.bundleNote(BUNDLE.minItems, pct)}</p>
          </div>
          <dl className="mt-6 divide-y divide-line border-y border-line">
            {specs.map(([k, v]) => (
              <div key={k} className="grid grid-cols-3 gap-4 py-2.5">
                <dt className="label pt-0.5 text-meta">{k}</dt>
                <dd className="col-span-2 text-[14px]">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>
      <section className="border-y border-line bg-surface">
        <div className="wrap grid gap-10 py-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <h2 className="h-md">{tp.what}</h2>
            <p className="mt-3 text-lg leading-7">{plugin.description}</p>
          </div>
          <ul className="grid gap-px bg-line md:col-span-7 sm:grid-cols-2">
            {plugin.features.map((f, i) => (
              <li key={f} className="bg-white p-5">
                <p className="label text-coral">{String(i + 1).padStart(2, "0")}</p>
                <p className="mt-2 font-display font-semibold text-ink">{f}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>
      <section className="wrap py-12">
        <h2 className="h-md">{tp.more}</h2>
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {others.map((p) => <PluginCard key={p.slug} plugin={p} lang={lang} />)}
        </div>
      </section>
    </>
  );
}

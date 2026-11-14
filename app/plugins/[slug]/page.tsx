import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BUNDLE, PLUGINS, getPlugin, usd } from "@/lib/plugins";
import PluginArt from "@/components/PluginArt";
import PluginCard from "@/components/PluginCard";
import AddToCart from "@/components/AddToCart";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return PLUGINS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const p = getPlugin((await params).slug);
  return p ? { title: p.name, description: p.tagline } : {};
}

export default async function PluginPage({ params }: Props) {
  const plugin = getPlugin((await params).slug);
  if (!plugin) notFound();
  const others = PLUGINS.filter((p) => p.slug !== plugin.slug).slice(0, 3);
  const specs: [string, string][] = [
    ["Formatos", plugin.formats.join(" · ")],
    ["Sistemas", plugin.platforms.join(" · ")],
    ["Latencia", plugin.latency],
    ["Versión", plugin.version],
    ["Licencia", "Perpetua · 3 computadoras"],
    ["Activación", "Offline, sin cuenta"],
  ];
  return (
    <>
      <div className="wrap pt-8">
        <nav className="label text-meta">
          <Link href="/plugins" className="hover:text-ink">Catálogo</Link> / {plugin.category} / <span className="text-ink">{plugin.name}</span>
        </nav>
      </div>
      <section className="wrap grid gap-10 py-8 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <div className="border border-line"><PluginArt plugin={plugin} large /></div>
          <div className="mt-6 border border-line">
            <div className="flex items-center justify-between border-b border-line px-4 py-2">
              <p className="label text-meta">Escúchalo</p>
              <p className="label text-meta">Antes / después</p>
            </div>
            <div className="p-4 text-[13px] text-meta">
              Aquí va tu demo de audio: sube un clip seco y uno procesado a <code className="font-mono text-body">public/audio/{plugin.slug}-dry.mp3</code> y{" "}
              <code className="font-mono text-body">-wet.mp3</code> y cambia este bloque por un reproductor.
            </div>
          </div>
        </div>
        <div className="lg:col-span-5">
          <p className="label text-coral">{plugin.category}{plugin.isNew ? " · Nuevo" : ""}</p>
          <h1 className="h-lg mt-2">{plugin.name}</h1>
          <p className="mt-4 text-lg leading-7">{plugin.tagline}</p>
          <div className="mt-6 border border-ink p-5">
            <div className="flex items-baseline justify-between">
              <span className="font-display text-3xl font-bold text-ink">{usd(plugin.price)}</span>
              <span className="label text-meta">Pago único</span>
            </div>
            <div className="mt-4"><AddToCart slug={plugin.slug} full /></div>
            <p className="mt-3 text-[13px] text-meta">
              Lleva {BUNDLE.minItems} plugins o más y ahorra {BUNDLE.discount * 100}% en todo el carrito.
            </p>
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
            <h2 className="h-md">Qué hace</h2>
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
        <h2 className="h-md">También te puede servir</h2>
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {others.map((p) => <PluginCard key={p.slug} plugin={p} />)}
        </div>
      </section>
    </>
  );
}

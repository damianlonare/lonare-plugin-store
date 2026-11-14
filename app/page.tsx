import Link from "next/link";
import { BRAND, BUNDLE, PLUGINS, usd } from "@/lib/plugins";
import PluginArt from "@/components/PluginArt";
import PluginCard from "@/components/PluginCard";
import AddToCart from "@/components/AddToCart";

const FAQ = [
  ["¿La licencia es para siempre?", "Sí. Pagas una vez y el plugin es tuyo, incluidas las actualizaciones de la misma versión mayor."],
  ["¿Necesito internet para activarlo?", "No. Tu llave de licencia se verifica dentro del plugin, sin conexión. Funciona en el estudio aunque no tengas internet."],
  ["¿En cuántas computadoras lo puedo usar?", "En hasta 3 computadoras tuyas al mismo tiempo, por ejemplo tu laptop y la del estudio."],
  ["¿Qué DAWs son compatibles?", "Cualquier DAW que cargue VST3, AU o CLAP: Ableton Live, FL Studio, Logic Pro, Bitwig, Reaper, Studio One y más."],
];

export default function Home() {
  const flagship = PLUGINS.find((p) => p.featured)!;
  return (
    <>
      <section className="border-b border-line">
        <div className="wrap grid gap-10 py-14 md:grid-cols-12 md:py-20">
          <div className="md:col-span-7">
            <p className="label flex items-center gap-2 text-meta">
              <span className="inline-block h-1.5 w-1.5 bg-coral" /> {PLUGINS.length} plugins · VST3 · AU · CLAP
            </p>
            <h1 className="h-xl mt-6">
              Plugins de audio hechos por <span className="text-coral">un productor</span>.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-7 text-body/80">
              Reverbs, saturadores y procesadores que uso en mis propias producciones. Pagas una vez,
              funcionan sin internet y se instalan en segundos en Mac y Windows.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/plugins" className="btn-primary">Ver el catálogo</Link>
              <Link href={`/plugins/${flagship.slug}`} className="btn-outline">Escuchar {flagship.name.split(" ")[0]}</Link>
            </div>
          </div>
          <div className="md:col-span-5">
            <div className="grid grid-cols-3 border border-line">
              {[["0 ms", "Latencia"], ["64-bit", "Audio"], ["Offline", "Licencia"]].map(([a, b], i) => (
                <div key={b} className={`p-4 ${i ? "border-l border-line" : ""}`}>
                  <p className={`font-display text-2xl font-bold ${i === 2 ? "text-coral" : "text-ink"}`}>{a}</p>
                  <p className="label mt-1 text-meta">{b}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 border border-line bg-surface p-4">
              <p className="label text-meta">Combo</p>
              <p className="mt-1 font-display text-lg font-semibold text-ink">
                Lleva {BUNDLE.minItems} o más y ahorra {BUNDLE.discount * 100}%.
              </p>
              <p className="text-[13px] text-meta">El descuento se aplica solo en el carrito.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-line bg-surface">
        <div className="wrap grid items-center gap-10 py-14 md:grid-cols-2">
          <div className="border border-line"><PluginArt plugin={flagship} large /></div>
          <div>
            <p className="label text-coral">Destacado // {flagship.category}</p>
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
              <Link href={`/plugins/${flagship.slug}`} className="link">Ver detalles</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="wrap py-14">
        <div className="flex flex-wrap items-end justify-between gap-4 border-b border-line pb-4">
          <h2 className="h-lg">El catálogo.</h2>
          <Link href="/plugins" className="link">Ver todos y filtrar</Link>
        </div>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {PLUGINS.slice(0, 6).map((p, i) => <PluginCard key={p.slug} plugin={p} index={i} />)}
        </div>
      </section>

      <section className="border-y border-line bg-surface">
        <div className="wrap py-14">
          <p className="label text-meta">Cómo funciona</p>
          <h2 className="h-lg mt-2">Compra, descarga, produce.</h2>
          <div className="mt-8 grid border border-line bg-white md:grid-cols-3">
            {[
              ["Compra", "Pagas con tarjeta, Apple Pay o Google Pay a través de Stripe."],
              ["Descarga", "Recibes el instalador y tu llave de licencia al instante, también por correo."],
              ["Activa", "Pega tu llave en el plugin una sola vez. Funciona sin internet desde ese momento."],
            ].map(([t, d], i) => (
              <div key={t} className={`p-6 ${i ? "border-t border-line md:border-l md:border-t-0" : ""}`}>
                <p className="font-display text-3xl font-bold text-coral">{String(i + 1).padStart(2, "0")}</p>
                <h3 className="h-md mt-3">{t}</h3>
                <p className="mt-2 text-meta">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="sobre" className="wrap grid gap-10 py-14 md:grid-cols-12">
        <div className="md:col-span-4">
          <p className="label text-meta">Sobre mí</p>
          <h2 className="h-lg mt-2">{BRAND.author}.</h2>
        </div>
        <div className="space-y-4 text-lg leading-7 md:col-span-8">
          <p>
            Soy productor y artista en {BRAND.city}. Grabo, mezclo y masterizo mis canciones como Lonare y produzco a otros artistas.
            También soy desarrollador de software, así que empecé a programar las herramientas que me faltaban en Ableton.
          </p>
          <p className="text-meta">
            Cada plugin de esta tienda lo uso en mis propias sesiones antes de publicarlo. Si algo no te funciona, escríbeme y lo arreglo.
          </p>
        </div>
      </section>

      <section id="faq" className="wrap pb-6">
        <div className="border-t border-line pt-10">
          <h2 className="h-lg">Preguntas frecuentes.</h2>
          <div className="mt-6 divide-y divide-line border-y border-line">
            {FAQ.map(([q, a]) => (
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

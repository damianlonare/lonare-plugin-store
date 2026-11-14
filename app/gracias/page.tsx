import type { Metadata } from "next";
import Link from "next/link";
import Stripe from "stripe";
import { issueLicense, readOrder, type License } from "@/lib/license";
import { DEMO_MODE } from "@/lib/config";
import { getPlugin, usd } from "@/lib/plugins";
import Delivered from "./Delivered";

export const metadata: Metadata = { title: "Pago confirmado", robots: { index: false } };
export const dynamic = "force-dynamic";

type Props = { searchParams: Promise<{ session_id?: string; demo?: string }> };

async function resolveOrder(q: { session_id?: string; demo?: string }) {
  if (q.session_id && process.env.STRIPE_SECRET_KEY) {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    const s = await stripe.checkout.sessions.retrieve(q.session_id);
    if (s.payment_status !== "paid") return { error: "Tu pago todavía no se confirma. Recarga en unos segundos." };
    return {
      id: s.id,
      email: s.customer_details?.email ?? s.customer_email ?? "",
      slugs: (s.metadata?.slugs ?? "").split(",").filter(Boolean),
      t: s.created,
      total: (s.amount_total ?? 0) / 100,
      demo: false,
    };
  }
  if (q.demo && DEMO_MODE) {
    const o = readOrder(q.demo);
    if (!o) return { error: "Este enlace de compra no es válido." };
    return { ...o, total: null, demo: true };
  }
  return { error: "No encontramos tu compra." };
}

export default async function Gracias({ searchParams }: Props) {
  const order = await resolveOrder(await searchParams);
  if ("error" in order)
    return (
      <div className="wrap py-16">
        <p className="label text-coral">Compra</p>
        <h1 className="h-lg mt-2">{order.error}</h1>
        <Link href="/carrito" className="btn-outline mt-8">Volver al carrito</Link>
      </div>
    );

  // Keys are deterministic per order + plugin, so reloading this page returns the same keys.
  const licenses: License[] = order.slugs.filter((s) => getPlugin(s)).map((slug) =>
    issueLicense({ p: slug, e: order.email, o: order.id, t: order.t, ...(order.demo ? { d: 1 as const } : {}) }));

  return (
    <div className="wrap py-12">
      <p className="label flex items-center gap-2 text-ok"><span className="inline-block h-1.5 w-1.5 bg-ok" /> Pago confirmado{order.demo ? " (demo)" : ""}</p>
      <h1 className="h-xl mt-4 max-w-3xl">
        {licenses.length === 1 ? "Tu plugin está listo." : `Tus ${licenses.length} plugins están listos.`}
      </h1>
      <p className="mt-4 max-w-2xl text-lg leading-7 text-body/80">
        Descarga el instalador y pega tu llave en el plugin la primera vez que lo abras. Las licencias se guardan en{" "}
        <Link href="/licencias" className="link">Mis licencias</Link> en este navegador
        {order.demo ? "." : ` y te llegan por correo a ${order.email}.`}
      </p>
      <div className="mt-6 flex flex-wrap gap-x-8 gap-y-2 border-y border-line py-3 text-[13px]">
        <span><span className="label text-meta">Pedido</span> <span className="font-mono">{order.id}</span></span>
        <span><span className="label text-meta">Correo</span> {order.email}</span>
        {order.total !== null && <span><span className="label text-meta">Total</span> {usd(order.total)}</span>}
      </div>
      <Delivered licenses={licenses.map((l) => ({
        key: l.key, serial: l.serial, slug: l.payload.p, email: l.payload.e, order: l.payload.o, issued: l.payload.t, demo: !!l.payload.d,
      }))} />
      <section className="mt-12 grid border border-line md:grid-cols-3">
        {[
          ["Instala", "Abre el instalador para tu sistema. Copia el plugin a la carpeta de VST3/AU/CLAP."],
          ["Abre tu DAW", "Vuelve a escanear plugins si no aparece. En Ableton: Preferencias → Plug-Ins → Volver a escanear."],
          ["Activa", "Pega tu llave o arrastra el archivo de licencia sobre el plugin. Listo, sin internet."],
        ].map(([t, d], i) => (
          <div key={t} className={`p-5 ${i ? "border-t border-line md:border-l md:border-t-0" : ""}`}>
            <p className="label text-coral">{String(i + 1).padStart(2, "0")}</p>
            <p className="mt-2 font-display text-lg font-semibold text-ink">{t}</p>
            <p className="mt-1 text-[14px] text-meta">{d}</p>
          </div>
        ))}
      </section>
    </div>
  );
}

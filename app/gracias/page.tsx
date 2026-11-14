import type { Metadata } from "next";
import Link from "next/link";
import Stripe from "stripe";
import { issueLicense, readOrder, type License } from "@/lib/license";
import { DEMO_MODE } from "@/lib/config";
import { getPlugin, usd } from "@/lib/plugins";
import { getDict } from "@/lib/lang";
import type { Dict } from "@/lib/i18n";
import Delivered from "./Delivered";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getDict();
  return { title: t.meta.paid, robots: { index: false } };
}

type Props = { searchParams: Promise<{ session_id?: string; demo?: string }> };

async function resolveOrder(q: { session_id?: string; demo?: string }, t: Dict) {
  if (q.session_id && process.env.STRIPE_SECRET_KEY) {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    const s = await stripe.checkout.sessions.retrieve(q.session_id);
    if (s.payment_status !== "paid") return { error: t.thanks.pending };
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
    if (!o) return { error: t.thanks.invalid };
    return { ...o, total: null, demo: true };
  }
  return { error: t.thanks.notFound };
}

export default async function Gracias({ searchParams }: Props) {
  const { t } = await getDict();
  const th = t.thanks;
  const order = await resolveOrder(await searchParams, t);
  if ("error" in order)
    return (
      <div className="wrap py-16">
        <p className="label text-coral">{th.label}</p>
        <h1 className="h-lg mt-2">{order.error}</h1>
        <Link href="/carrito" className="btn-outline mt-8">{th.back}</Link>
      </div>
    );

  // Keys are deterministic per order + plugin, so reloading this page returns the same keys.
  const licenses: License[] = order.slugs.filter((s) => getPlugin(s)).map((slug) =>
    issueLicense({ p: slug, e: order.email, o: order.id, t: order.t, ...(order.demo ? { d: 1 as const } : {}) }));

  return (
    <div className="wrap py-12">
      <p className="label flex items-center gap-2 text-ok"><span className="inline-block h-1.5 w-1.5 bg-ok" /> {th.confirmed}{order.demo ? th.demo : ""}</p>
      <h1 className="h-xl mt-4 max-w-3xl">{licenses.length === 1 ? th.one : th.many(licenses.length)}</h1>
      <p className="mt-4 max-w-2xl text-lg leading-7 text-body/80">
        {th.sub}<Link href="/licencias" className="link">{th.subLink}</Link>{th.subEnd}
        {order.demo ? "." : th.subEmail(order.email)}
      </p>
      <div className="mt-6 flex flex-wrap gap-x-8 gap-y-2 border-y border-line py-3 text-[13px]">
        <span><span className="label text-meta">{th.order}</span> <span className="font-mono">{order.id}</span></span>
        <span><span className="label text-meta">{th.email}</span> {order.email}</span>
        {order.total !== null && <span><span className="label text-meta">{th.total}</span> {usd(order.total)}</span>}
      </div>
      <Delivered licenses={licenses.map((l) => ({
        key: l.key, serial: l.serial, slug: l.payload.p, email: l.payload.e, order: l.payload.o, issued: l.payload.t, demo: !!l.payload.d,
      }))} />
      <section className="mt-12 grid border border-line md:grid-cols-3">
        {th.steps.map(([title, d], i) => (
          <div key={title} className={`p-5 ${i ? "border-t border-line md:border-l md:border-t-0" : ""}`}>
            <p className="label text-coral">{String(i + 1).padStart(2, "0")}</p>
            <p className="mt-2 font-display text-lg font-semibold text-ink">{title}</p>
            <p className="mt-1 text-[14px] text-meta">{d}</p>
          </div>
        ))}
      </section>
    </div>
  );
}

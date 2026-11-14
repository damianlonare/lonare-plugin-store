"use client";
import { useState } from "react";
import Link from "next/link";
import { useCart } from "@/components/CartProvider";
import PluginArt from "@/components/PluginArt";
import { BUNDLE, getPlugins, priceCart, usd } from "@/lib/plugins";
import { useLang } from "@/components/LangProvider";
import { DEMO_MODE } from "@/lib/config";

export default function CartPage() {
  const { slugs, remove, add, ready } = useCart();
  const { lang, t } = useLang();
  const c = t.cart;
  const pct = BUNDLE.discount * 100;
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const cart = priceCart(slugs, lang);
  const missing = Math.max(0, BUNDLE.minItems - cart.items.length);
  const suggestions = getPlugins(lang).filter((p) => !slugs.includes(p.slug)).slice(0, 3);

  async function checkout() {
    setBusy(true); setError(null);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slugs, email: email.trim() || undefined, lang }),
      });
      const data = await res.json();
      if (!res.ok || !data.url) throw new Error(data.error || c.error);
      window.location.href = data.url;
    } catch (e) {
      setError(e instanceof Error ? e.message : c.unexpected);
      setBusy(false);
    }
  }

  if (!ready) return <div className="wrap py-16 text-meta">{c.loading}</div>;

  if (!cart.items.length)
    return (
      <div className="wrap py-16">
        <p className="label text-meta">{c.label}</p>
        <h1 className="h-lg mt-2">{c.emptyTitle}</h1>
        <Link href="/plugins" className="btn-primary mt-8">{c.seeCatalog}</Link>
      </div>
    );

  return (
    <div className="wrap py-12">
      <p className="label text-meta">{c.label} / {cart.items.length} {cart.items.length === 1 ? t.card.plugin : t.card.plugins}</p>
      <h1 className="h-lg mt-2">{c.title}</h1>
      <div className="mt-8 grid gap-8 lg:grid-cols-12">
        <section className="lg:col-span-8">
          {missing > 0 ? (
            <div className="mb-4 border border-coral bg-white px-4 py-3 text-[14px]">
              {c.addMore(missing, pct)}
            </div>
          ) : (
            <div className="mb-4 border border-ok px-4 py-3 text-[14px] text-ok">{c.bundleOn(pct)}</div>
          )}
          <ul className="divide-y divide-line border border-line">
            {cart.items.map((p) => (
              <li key={p.slug} className="grid grid-cols-[96px_1fr_auto] items-center gap-4 p-4">
                <Link href={`/plugins/${p.slug}`} className="border border-line"><PluginArt plugin={p} /></Link>
                <div>
                  <Link href={`/plugins/${p.slug}`} className="font-display text-lg font-semibold text-ink hover:text-coral">{p.name}</Link>
                  <p className="text-[13px] text-meta">{c.perpetual} · {p.formats.join(" / ")}</p>
                  <button className="link mt-1 text-[13px]" onClick={() => remove(p.slug)}>{c.remove}</button>
                </div>
                <div className="text-right">
                  {cart.bundle && <p className="text-[13px] text-meta line-through">{usd(p.price)}</p>}
                  <p className="font-display text-lg font-bold text-ink">{usd(Math.round(p.price * cart.unitFactor * 100) / 100)}</p>
                </div>
              </li>
            ))}
          </ul>
          {suggestions.length > 0 && (
            <div className="mt-8">
              <p className="label mb-3 text-meta">{c.addToBundle}</p>
              <div className="grid gap-px border border-line bg-line sm:grid-cols-3">
                {suggestions.map((p) => (
                  <div key={p.slug} className="flex flex-col justify-between gap-3 bg-white p-4">
                    <div>
                      <p className="font-display font-semibold text-ink">{p.name}</p>
                      <p className="text-[13px] text-meta">{usd(p.price)}</p>
                    </div>
                    <button className="btn-outline px-3 py-2" onClick={() => add(p.slug)}>{c.add}</button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
        <aside className="lg:col-span-4">
          <div className="sticky top-6 border border-ink p-5">
            <p className="label text-meta">{c.summary}</p>
            <dl className="mt-4 space-y-2 text-[14px]">
              <div className="flex justify-between"><dt>{c.subtotal}</dt><dd>{usd(cart.subtotal)}</dd></div>
              {cart.bundle && <div className="flex justify-between text-ok"><dt>{c.bundle(pct)}</dt><dd>−{usd(cart.discount)}</dd></div>}
              <div className="flex items-baseline justify-between border-t border-line pt-3">
                <dt className="label">{c.total}</dt>
                <dd className="font-display text-3xl font-bold text-ink">{usd(cart.total)}</dd>
              </div>
            </dl>
            <label className="mt-5 block">
              <span className="label text-meta">{c.email}</span>
              <input type="email" className="input mt-1" placeholder={c.emailPh} value={email}
                onChange={(e) => setEmail(e.target.value)} autoComplete="email" />
            </label>
            <button className="btn-primary mt-4 w-full" onClick={checkout} disabled={busy || (DEMO_MODE && !email.includes("@"))}>
              {busy ? c.processing : DEMO_MODE ? c.payDemo : c.pay}
            </button>
            {error && <p className="mt-3 text-[13px] text-coral">{error}</p>}
            <p className="mt-3 text-[12px] leading-4 text-meta">
              {DEMO_MODE ? c.noteDemo : c.note}
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}

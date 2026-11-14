"use client";
import { useState } from "react";
import Link from "next/link";
import { useCart } from "@/components/CartProvider";
import PluginArt from "@/components/PluginArt";
import { BUNDLE, PLUGINS, priceCart, usd } from "@/lib/plugins";
import { DEMO_MODE } from "@/lib/config";

export default function CartPage() {
  const { slugs, remove, add, ready } = useCart();
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const cart = priceCart(slugs);
  const missing = Math.max(0, BUNDLE.minItems - cart.items.length);
  const suggestions = PLUGINS.filter((p) => !slugs.includes(p.slug)).slice(0, 3);

  async function checkout() {
    setBusy(true); setError(null);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slugs, email: email.trim() || undefined }),
      });
      const data = await res.json();
      if (!res.ok || !data.url) throw new Error(data.error || "No se pudo iniciar el pago.");
      window.location.href = data.url;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error inesperado.");
      setBusy(false);
    }
  }

  if (!ready) return <div className="wrap py-16 text-meta">Cargando carrito…</div>;

  if (!cart.items.length)
    return (
      <div className="wrap py-16">
        <p className="label text-meta">Carrito</p>
        <h1 className="h-lg mt-2">Tu carrito está vacío.</h1>
        <Link href="/plugins" className="btn-primary mt-8">Ver el catálogo</Link>
      </div>
    );

  return (
    <div className="wrap py-12">
      <p className="label text-meta">Carrito / {cart.items.length} {cart.items.length === 1 ? "plugin" : "plugins"}</p>
      <h1 className="h-lg mt-2">Tu carrito.</h1>
      <div className="mt-8 grid gap-8 lg:grid-cols-12">
        <section className="lg:col-span-8">
          {missing > 0 ? (
            <div className="mb-4 border border-coral bg-white px-4 py-3 text-[14px]">
              Agrega {missing} {missing === 1 ? "plugin más" : "plugins más"} y ahorra {BUNDLE.discount * 100}% en todo.
            </div>
          ) : (
            <div className="mb-4 border border-ok px-4 py-3 text-[14px] text-ok">Combo activo: {BUNDLE.discount * 100}% de descuento aplicado.</div>
          )}
          <ul className="divide-y divide-line border border-line">
            {cart.items.map((p) => (
              <li key={p.slug} className="grid grid-cols-[96px_1fr_auto] items-center gap-4 p-4">
                <Link href={`/plugins/${p.slug}`} className="border border-line"><PluginArt plugin={p} /></Link>
                <div>
                  <Link href={`/plugins/${p.slug}`} className="font-display text-lg font-semibold text-ink hover:text-coral">{p.name}</Link>
                  <p className="text-[13px] text-meta">Licencia perpetua · {p.formats.join(" / ")}</p>
                  <button className="link mt-1 text-[13px]" onClick={() => remove(p.slug)}>Quitar</button>
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
              <p className="label mb-3 text-meta">Agrega al combo</p>
              <div className="grid gap-px border border-line bg-line sm:grid-cols-3">
                {suggestions.map((p) => (
                  <div key={p.slug} className="flex flex-col justify-between gap-3 bg-white p-4">
                    <div>
                      <p className="font-display font-semibold text-ink">{p.name}</p>
                      <p className="text-[13px] text-meta">{usd(p.price)}</p>
                    </div>
                    <button className="btn-outline px-3 py-2" onClick={() => add(p.slug)}>+ Agregar</button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
        <aside className="lg:col-span-4">
          <div className="sticky top-6 border border-ink p-5">
            <p className="label text-meta">Resumen</p>
            <dl className="mt-4 space-y-2 text-[14px]">
              <div className="flex justify-between"><dt>Subtotal</dt><dd>{usd(cart.subtotal)}</dd></div>
              {cart.bundle && <div className="flex justify-between text-ok"><dt>Combo −{BUNDLE.discount * 100}%</dt><dd>−{usd(cart.discount)}</dd></div>}
              <div className="flex items-baseline justify-between border-t border-line pt-3">
                <dt className="label">Total</dt>
                <dd className="font-display text-3xl font-bold text-ink">{usd(cart.total)}</dd>
              </div>
            </dl>
            <label className="mt-5 block">
              <span className="label text-meta">Correo para tus licencias</span>
              <input type="email" className="input mt-1" placeholder="tu@correo.com" value={email}
                onChange={(e) => setEmail(e.target.value)} autoComplete="email" />
            </label>
            <button className="btn-primary mt-4 w-full" onClick={checkout} disabled={busy || (DEMO_MODE && !email.includes("@"))}>
              {busy ? "Procesando…" : DEMO_MODE ? "Pagar (demo)" : "Pagar con Stripe"}
            </button>
            {error && <p className="mt-3 text-[13px] text-coral">{error}</p>}
            <p className="mt-3 text-[12px] leading-4 text-meta">
              {DEMO_MODE
                ? "En la demo no se cobra nada: recibirás licencias de prueba al instante."
                : "Te llevamos a Stripe para pagar con tarjeta, Apple Pay o Google Pay. Recibirás tus licencias al terminar."}
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}

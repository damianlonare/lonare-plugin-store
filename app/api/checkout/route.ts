import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getPlugin, priceCart } from "@/lib/plugins";
import { DEMO_MODE, SITE_URL } from "@/lib/config";
import { signOrder } from "@/lib/license";

export async function POST(req: Request) {
  let body: { slugs?: unknown; email?: unknown };
  try { body = await req.json(); } catch { return NextResponse.json({ error: "Solicitud inválida." }, { status: 400 }); }

  const slugs = Array.isArray(body.slugs) ? [...new Set(body.slugs.filter((s): s is string => typeof s === "string" && !!getPlugin(s)))] : [];
  if (!slugs.length) return NextResponse.json({ error: "El carrito está vacío." }, { status: 400 });
  const email = typeof body.email === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email) ? body.email.toLowerCase() : undefined;
  const cart = priceCart(slugs);
  const origin = req.headers.get("origin") || SITE_URL;

  // Real (or Stripe test-mode) checkout whenever a Stripe key is configured.
  if (process.env.STRIPE_SECRET_KEY) {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: email,
      line_items: cart.items.map((p) => ({
        quantity: 1,
        price_data: {
          currency: "usd",
          unit_amount: Math.round(p.price * cart.unitFactor * 100),
          product_data: { name: p.name, description: `Licencia perpetua · v${p.version}`, metadata: { slug: p.slug } },
        },
      })),
      metadata: { slugs: slugs.join(",") },
      success_url: `${origin}/gracias?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/carrito`,
    });
    return NextResponse.json({ url: session.url });
  }

  if (!DEMO_MODE) return NextResponse.json({ error: "Pagos no configurados (falta STRIPE_SECRET_KEY)." }, { status: 500 });
  if (!email) return NextResponse.json({ error: "Escribe un correo válido." }, { status: 400 });

  const id = `demo_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
  return NextResponse.json({ url: `/gracias?demo=${encodeURIComponent(signOrder({ slugs, email, id, t: Math.floor(Date.now() / 1000) }))}` });
}

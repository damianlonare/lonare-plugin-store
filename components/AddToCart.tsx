"use client";
import Link from "next/link";
import { useCart } from "./CartProvider";
import { useLang } from "./LangProvider";

export default function AddToCart({ slug, full = false }: { slug: string; full?: boolean }) {
  const { has, add, ready } = useCart();
  const { t } = useLang();
  const w = full ? "w-full" : "";
  if (ready && has(slug))
    return <Link href="/carrito" className={`btn-outline ${w}`}>{t.card.inCart}</Link>;
  return (
    <button type="button" className={`btn-primary ${w}`} onClick={() => add(slug)} disabled={!ready}>
      {t.card.add}
    </button>
  );
}

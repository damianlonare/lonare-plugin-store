"use client";
import Link from "next/link";
import { useCart } from "./CartProvider";

export default function AddToCart({ slug, full = false }: { slug: string; full?: boolean }) {
  const { has, add, ready } = useCart();
  const w = full ? "w-full" : "";
  if (ready && has(slug))
    return <Link href="/carrito" className={`btn-outline ${w}`}>En el carrito → ver</Link>;
  return (
    <button type="button" className={`btn-primary ${w}`} onClick={() => add(slug)} disabled={!ready}>
      Agregar al carrito
    </button>
  );
}

"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "./CartProvider";
import { LangSwitch, useLang } from "./LangProvider";
import { BRAND } from "@/lib/plugins";

export default function Header() {
  const { slugs, ready } = useCart();
  const { t } = useLang();
  const path = usePathname();
  const NAV = [
    { href: "/plugins", label: t.nav.plugins },
    { href: "/licencias", label: t.nav.licenses },
    { href: "/#sobre", label: t.nav.about },
  ];
  return (
    <header className="border-b border-line bg-white">
      <div className="wrap flex h-16 items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2">
          <span className="inline-block h-2.5 w-2.5 bg-coral" aria-hidden />
          <span className="font-display text-lg font-bold tracking-[-0.03em] text-ink">{BRAND.name.toLowerCase()}.</span>
        </Link>
        <nav aria-label={t.nav.main} className="hidden items-center gap-8 md:flex">
          {NAV.map((n) => {
            const on = n.href !== "/#sobre" && path.startsWith(n.href);
            return (
              <Link key={n.href} href={n.href}
                className={`label border-b-2 py-1 ${on ? "border-coral text-ink" : "border-transparent text-meta hover:text-ink"}`}>
                {n.label}
              </Link>
            );
          })}
        </nav>
        <div className="flex items-center gap-2">
          <LangSwitch />
          <Link href="/carrito" className="label flex items-center gap-2 border border-ink px-3 py-2 text-ink hover:bg-ink hover:text-white">
            {t.nav.cart}
            <span className={`inline-flex h-5 min-w-5 items-center justify-center px-1 ${slugs.length ? "bg-coral text-white" : "bg-surface text-meta"}`}>
              {ready ? slugs.length : 0}
            </span>
          </Link>
        </div>
      </div>
      <nav aria-label={t.nav.main} className="wrap flex gap-6 overflow-x-auto border-t border-line py-2 md:hidden">
        {NAV.map((n) => (
          <Link key={n.href} href={n.href} className="label whitespace-nowrap text-meta">{n.label}</Link>
        ))}
      </nav>
    </header>
  );
}

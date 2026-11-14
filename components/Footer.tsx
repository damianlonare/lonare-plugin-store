"use client";
import Link from "next/link";
import { BRAND } from "@/lib/plugins";
import { useLang } from "./LangProvider";

export default function Footer() {
  const { lang, t } = useLang();
  return (
    <footer className="mt-24 border-t border-line bg-surface">
      <div className="wrap grid gap-10 py-12 md:grid-cols-4">
        <div className="md:col-span-2">
          <p className="font-display text-lg font-bold text-ink">{BRAND.name.toLowerCase()}.</p>
          <p className="mt-2 max-w-sm text-meta">{BRAND.tagline[lang]}</p>
        </div>
        <div>
          <p className="label text-meta">{t.footer.store}</p>
          <ul className="mt-3 space-y-2">
            <li><Link className="hover:text-coral" href="/plugins">{t.footer.catalog}</Link></li>
            <li><Link className="hover:text-coral" href="/carrito">{t.footer.cart}</Link></li>
            <li><Link className="hover:text-coral" href="/licencias">{t.footer.licenses}</Link></li>
          </ul>
        </div>
        <div>
          <p className="label text-meta">{t.footer.support}</p>
          <ul className="mt-3 space-y-2">
            <li><Link className="hover:text-coral" href="/#faq">{t.footer.faq}</Link></li>
            <li><a className="hover:text-coral" href="https://instagram.com/damianlonare" target="_blank" rel="noreferrer">Instagram</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-line">
        <div className="wrap flex flex-wrap justify-between gap-2 py-4 text-[12px] text-meta">
          <span>© 2026 {BRAND.name} · {BRAND.city[lang]}</span>
          <span className="label">{t.footer.stripe}</span>
        </div>
      </div>
    </footer>
  );
}

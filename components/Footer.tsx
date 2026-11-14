import Link from "next/link";
import { BRAND } from "@/lib/plugins";

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-line bg-surface">
      <div className="wrap grid gap-10 py-12 md:grid-cols-4">
        <div className="md:col-span-2">
          <p className="font-display text-lg font-bold text-ink">{BRAND.name.toLowerCase()}.</p>
          <p className="mt-2 max-w-sm text-meta">{BRAND.tagline}</p>
        </div>
        <div>
          <p className="label text-meta">Tienda</p>
          <ul className="mt-3 space-y-2">
            <li><Link className="hover:text-coral" href="/plugins">Catálogo</Link></li>
            <li><Link className="hover:text-coral" href="/carrito">Carrito</Link></li>
            <li><Link className="hover:text-coral" href="/licencias">Mis licencias</Link></li>
          </ul>
        </div>
        <div>
          <p className="label text-meta">Soporte</p>
          <ul className="mt-3 space-y-2">
            <li><Link className="hover:text-coral" href="/#faq">Preguntas frecuentes</Link></li>
            <li><a className="hover:text-coral" href="https://instagram.com/damianlonare" target="_blank" rel="noreferrer">Instagram</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-line">
        <div className="wrap flex flex-wrap justify-between gap-2 py-4 text-[12px] text-meta">
          <span>© {new Date().getFullYear()} {BRAND.name} · {BRAND.city}</span>
          <span className="label">Pagos seguros con Stripe</span>
        </div>
      </div>
    </footer>
  );
}

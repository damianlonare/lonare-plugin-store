import Link from "next/link";
export default function NotFound() {
  return (
    <div className="wrap py-24">
      <p className="label text-coral">Error 404</p>
      <h1 className="h-lg mt-2">Esta página no existe.</h1>
      <Link href="/plugins" className="btn-outline mt-8">Ir al catálogo</Link>
    </div>
  );
}

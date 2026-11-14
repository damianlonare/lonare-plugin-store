import type { Metadata } from "next";
import Catalog from "./Catalog";

export const metadata: Metadata = { title: "Catálogo" };

export default function Page() {
  return (
    <div className="wrap py-12">
      <p className="label text-meta">Catálogo / todos</p>
      <h1 className="h-lg mt-2">Catálogo de plugins.</h1>
      <p className="mt-3 max-w-2xl text-meta">Filtra por tipo, formato o sistema. Todos los precios son licencias perpetuas en dólares.</p>
      <Catalog />
    </div>
  );
}

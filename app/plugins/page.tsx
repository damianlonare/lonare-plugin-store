import type { Metadata } from "next";
import { getDict } from "@/lib/lang";
import Catalog from "./Catalog";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getDict();
  return { title: t.meta.catalog };
}

export default async function Page() {
  const { t } = await getDict();
  return (
    <div className="wrap py-12">
      <p className="label text-meta">{t.catalog.crumb}</p>
      <h1 className="h-lg mt-2">{t.catalog.title}</h1>
      <p className="mt-3 max-w-2xl text-meta">{t.catalog.sub}</p>
      <Catalog />
    </div>
  );
}

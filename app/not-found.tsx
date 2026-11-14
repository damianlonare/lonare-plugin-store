import Link from "next/link";
import { getDict } from "@/lib/lang";

export default async function NotFound() {
  const { t } = await getDict();
  return (
    <div className="wrap py-24">
      <p className="label text-coral">{t.notFound.label}</p>
      <h1 className="h-lg mt-2">{t.notFound.title}</h1>
      <Link href="/plugins" className="btn-outline mt-8">{t.notFound.cta}</Link>
    </div>
  );
}

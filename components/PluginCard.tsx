import Link from "next/link";
import type { Plugin } from "@/lib/plugins";
import { usd } from "@/lib/plugins";
import PluginArt from "./PluginArt";
import AddToCart from "./AddToCart";

export default function PluginCard({ plugin, index }: { plugin: Plugin; index?: number }) {
  return (
    <article className="group flex flex-col border border-line bg-white transition-colors hover:border-ink">
      <div className="flex items-center justify-between border-b border-line px-4 py-2">
        <span className="label text-meta">
          {index !== undefined ? `${String(index + 1).padStart(2, "0")} // ` : ""}{plugin.category}
        </span>
        {plugin.isNew && <span className="label text-coral">● Nuevo</span>}
      </div>
      <Link href={`/plugins/${plugin.slug}`} className="block"><PluginArt plugin={plugin} /></Link>
      <div className="flex flex-1 flex-col p-4">
        <h3 className="text-xl font-semibold tracking-[-0.02em]">
          <Link href={`/plugins/${plugin.slug}`} className="hover:text-coral">{plugin.name}</Link>
        </h3>
        <p className="mt-1 flex-1 text-[13px] leading-[18px] text-meta">{plugin.tagline}</p>
        <div className="mt-3 flex flex-wrap gap-1">
          {plugin.formats.map((f) => <span key={f} className="chip">{f}</span>)}
        </div>
        <div className="mt-4 flex items-center justify-between gap-3 border-t border-line pt-4">
          <span className="font-display text-xl font-bold text-ink">{usd(plugin.price)}</span>
          <AddToCart slug={plugin.slug} />
        </div>
      </div>
    </article>
  );
}

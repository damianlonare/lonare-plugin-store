"use client";
import { DEMO_MODE } from "@/lib/config";
import { useLang } from "./LangProvider";

/** Thin strip on top of every page while the store runs in demo mode.
 *  Turn it off by setting NEXT_PUBLIC_DEMO_MODE=false. */
export default function DemoBar() {
  const { t } = useLang();
  if (!DEMO_MODE) return null;
  return (
    <div role="region" aria-label={t.demo.pill} className="bg-ink text-white">
      <div className="wrap flex flex-wrap items-center justify-center gap-x-3 gap-y-1 py-2 text-center">
        <span className="label inline-flex items-center gap-2 text-coral-hover">
          <span className="inline-block h-1.5 w-1.5 bg-coral" aria-hidden /> {t.demo.pill}
        </span>
        <span className="text-[13px] leading-5 text-white/80">{t.demo.bar}</span>
        <a href="https://damianlonare.com" target="_blank" rel="noopener"
          className="hidden border border-white/25 px-2 py-0.5 text-[12px] text-white/80 hover:border-white hover:text-white sm:inline-block">
          {t.demo.by}
        </a>
      </div>
    </div>
  );
}

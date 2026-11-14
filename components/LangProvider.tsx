"use client";
import { createContext, useContext } from "react";
import { useRouter } from "next/navigation";
import { LANG_COOKIE, dict, type Dict, type Lang } from "@/lib/i18n";

const Ctx = createContext<{ lang: Lang; t: Dict }>({ lang: "es", t: dict("es") });

export function LangProvider({ lang, children }: { lang: Lang; children: React.ReactNode }) {
  return <Ctx.Provider value={{ lang, t: dict(lang) }}>{children}</Ctx.Provider>;
}

export const useLang = () => useContext(Ctx);

export function LangSwitch() {
  const { lang, t } = useLang();
  const router = useRouter();
  const set = (next: Lang) => {
    if (next === lang) return;
    document.cookie = `${LANG_COOKIE}=${next}; path=/; max-age=31536000; samesite=lax`;
    document.documentElement.lang = next;
    router.refresh();
  };
  return (
    <div role="group" aria-label={t.lang.label} className="flex border border-line">
      {(["es", "en"] as const).map((l) => (
        <button key={l} type="button" onClick={() => set(l)} aria-pressed={lang === l}
          className={`label px-2.5 py-2 ${lang === l ? "bg-ink text-white" : "bg-white text-meta hover:text-ink"}`}>
          {t.lang[l]}
        </button>
      ))}
    </div>
  );
}

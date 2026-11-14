"use client";
import { useEffect, useState } from "react";
import { useLang } from "./LangProvider";

const KEY = "lnr.demo-welcome";

/** One-time welcome toast (per browser session) explaining this is a showcase demo. */
export default function DemoToast() {
  const { t } = useLang();
  const [open, setOpen] = useState(false);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    let seen = false;
    try { seen = sessionStorage.getItem(KEY) === "1"; sessionStorage.setItem(KEY, "1"); } catch {}
    if (seen) return;
    const a = setTimeout(() => { setShown(true); requestAnimationFrame(() => setOpen(true)); }, 600);
    const b = setTimeout(() => setOpen(false), 9600);
    return () => { clearTimeout(a); clearTimeout(b); };
  }, []);

  if (!shown) return null;
  return (
    <div aria-live="polite" className="pointer-events-none fixed bottom-4 right-4 z-50 flex max-w-[calc(100vw-2rem)] justify-end">
      <div role="status"
        className={`pointer-events-auto flex w-[360px] max-w-full gap-3 border border-ink bg-ink p-4 text-white transition-all duration-300 ${open ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-2 opacity-0"}`}
        onTransitionEnd={() => { if (!open) setShown(false); }}>
        <span aria-hidden className="flex h-7 w-7 flex-none items-center justify-center bg-coral font-display text-sm font-bold">i</span>
        <div className="min-w-0 flex-1">
          <p className="font-display text-[15px] font-semibold">{t.demo.toastTitle}</p>
          <p className="mt-1 text-[13px] leading-[18px] text-white/75">{t.demo.toastBody}</p>
        </div>
        <button type="button" onClick={() => setOpen(false)} aria-label={t.demo.dismiss}
          className="flex-none self-start px-1 text-lg leading-none text-white/60 hover:text-white">×</button>
      </div>
    </div>
  );
}

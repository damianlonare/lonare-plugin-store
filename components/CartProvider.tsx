"use client";
import { createContext, useContext, useEffect, useState } from "react";

type Cart = {
  slugs: string[];
  add: (slug: string) => void;
  remove: (slug: string) => void;
  clear: () => void;
  has: (slug: string) => boolean;
  ready: boolean;
};

const Ctx = createContext<Cart | null>(null);
const KEY = "lnr.cart.v1";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [slugs, setSlugs] = useState<string[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const v = JSON.parse(localStorage.getItem(KEY) || "[]");
      if (Array.isArray(v)) setSlugs(v.filter((x) => typeof x === "string"));
    } catch {}
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try { localStorage.setItem(KEY, JSON.stringify(slugs)); } catch {}
  }, [slugs, ready]);

  const value: Cart = {
    slugs,
    ready,
    add: (s) => setSlugs((c) => (c.includes(s) ? c : [...c, s])),
    remove: (s) => setSlugs((c) => c.filter((x) => x !== s)),
    clear: () => setSlugs([]),
    has: (s) => slugs.includes(s),
  };
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCart() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useCart must be used inside CartProvider");
  return c;
}

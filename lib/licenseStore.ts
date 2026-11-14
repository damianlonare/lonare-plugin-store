"use client";
// Browser-side list of licenses the buyer has received (their "Mis licencias").
// The source of truth is the signed key itself; this is just a convenience copy.
export type StoredLicense = { key: string; serial: string; slug: string; email: string; order: string; issued: number; demo?: boolean };
const KEY = "lnr.licenses.v1";

export function loadLicenses(): StoredLicense[] {
  try { const v = JSON.parse(localStorage.getItem(KEY) || "[]"); return Array.isArray(v) ? v : []; } catch { return []; }
}
export function saveLicenses(add: StoredLicense[]) {
  const cur = loadLicenses();
  const merged = [...cur];
  for (const l of add) if (!merged.some((m) => m.key === l.key)) merged.push(l);
  try { localStorage.setItem(KEY, JSON.stringify(merged)); } catch {}
  return merged;
}
export function removeLicense(key: string) {
  const next = loadLicenses().filter((l) => l.key !== key);
  try { localStorage.setItem(KEY, JSON.stringify(next)); } catch {}
  return next;
}
export function downloadLicenseFile(l: StoredLicense, header: string) {
  const text = `${header}${l.key}
`;
  const url = URL.createObjectURL(new Blob([text], { type: "text/plain" }));
  const a = Object.assign(document.createElement("a"), { href: url, download: `${l.slug}.lnrlic` });
  a.click();
  URL.revokeObjectURL(url);
}

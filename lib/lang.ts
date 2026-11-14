import "server-only";
import { cookies, headers } from "next/headers";
import { LANG_COOKIE, dict, pickLang, type Lang } from "./i18n";

/** Language for this request: saved choice (cookie) → browser language → Spanish. */
export async function getLang(): Promise<Lang> {
  const [c, h] = await Promise.all([cookies(), headers()]);
  return pickLang(c.get(LANG_COOKIE)?.value, h.get("accept-language"));
}

export async function getDict() {
  const lang = await getLang();
  return { lang, t: dict(lang) };
}

import "server-only";
import crypto from "node:crypto";

/**
 * Offline license keys, signed with Ed25519.
 *
 * key = base64url(JSON payload) + "." + base64url(signature)
 *
 * Your plugin ships with the PUBLIC key and verifies the signature locally,
 * so it never needs to phone home. Only this server holds the PRIVATE key.
 */

export type LicensePayload = {
  v: 1;
  p: string; // plugin slug
  e: string; // buyer email
  o: string; // order id (Stripe session id or demo id)
  t: number; // issued at (unix seconds)
  d?: 1; // demo license — your plugin should reject these in release builds
};

export type License = {
  key: string;
  serial: string; // short human-friendly id shown in the UI
  payload: LicensePayload;
};

const b64u = (b: Buffer) => b.toString("base64url");

let devKey: crypto.KeyObject | null = null;

function privateKey(): crypto.KeyObject {
  const pem = process.env.LICENSE_PRIVATE_KEY;
  if (pem) return crypto.createPrivateKey(pem.includes("BEGIN") ? pem : Buffer.from(pem, "base64").toString());
  if (process.env.NEXT_PUBLIC_DEMO_MODE === "false") {
    throw new Error("LICENSE_PRIVATE_KEY is required when demo mode is off. Run `npm run keys`.");
  }
  // Demo fallback: a fixed, PUBLICLY KNOWN key so demo orders work across
  // serverless instances. Licenses signed with it carry d:1 and are worthless.
  if (!devKey) {
    const seed = crypto.createHash("sha256").update("lonare-audio-demo-key").digest();
    const der = Buffer.concat([Buffer.from("302e020100300506032b657004220420", "hex"), seed]);
    devKey = crypto.createPrivateKey({ key: der, format: "der", type: "pkcs8" });
    console.warn("[license] LICENSE_PRIVATE_KEY not set — using the demo signing key.");
  }
  return devKey;
}

function publicKey() {
  return crypto.createPublicKey(privateKey());
}

export function serialFor(key: string) {
  const h = crypto.createHash("sha256").update(key).digest("hex").toUpperCase();
  return `LNR-${h.slice(0, 4)}-${h.slice(4, 8)}-${h.slice(8, 12)}-${h.slice(12, 16)}`;
}

export function issueLicense(payload: Omit<LicensePayload, "v" | "t"> & { t?: number }): License {
  const full: LicensePayload = { v: 1, t: payload.t ?? Math.floor(Date.now() / 1000), ...payload } as LicensePayload;
  const body = Buffer.from(JSON.stringify(full));
  const sig = crypto.sign(null, body, privateKey());
  const key = `${b64u(body)}.${b64u(sig)}`;
  return { key, serial: serialFor(key), payload: full };
}

export function verifyLicense(key: string): LicensePayload | null {
  const [body, sig] = key.trim().split(".");
  if (!body || !sig) return null;
  try {
    const raw = Buffer.from(body, "base64url");
    const ok = crypto.verify(null, raw, publicKey(), Buffer.from(sig, "base64url"));
    return ok ? (JSON.parse(raw.toString()) as LicensePayload) : null;
  } catch {
    return null;
  }
}

/** Sign a short-lived demo order token so /gracias can't be forged with arbitrary items. */
export function signOrder(data: { slugs: string[]; email: string; id: string; t: number }) {
  const body = Buffer.from(JSON.stringify(data));
  return `${b64u(body)}.${b64u(crypto.sign(null, body, privateKey()))}`;
}

export function readOrder(token: string): { slugs: string[]; email: string; id: string; t: number } | null {
  const v = verifyLicense(token); // same envelope format
  return v as unknown as { slugs: string[]; email: string; id: string; t: number } | null;
}

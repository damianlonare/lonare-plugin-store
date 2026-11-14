// Verify a license key against the public key — the same check your plugin does.
//   npm run verify -- <license-key> [keys/license_public.pem]
import crypto from "node:crypto";
import fs from "node:fs";

const [key, pubPath = "keys/license_public.pem"] = process.argv.slice(2);
if (!key) { console.error("usage: npm run verify -- <license-key>"); process.exit(1); }
const pub = crypto.createPublicKey(fs.readFileSync(pubPath));
const [body, sig] = key.trim().split(".");
const raw = Buffer.from(body, "base64url");
const ok = crypto.verify(null, raw, pub, Buffer.from(sig, "base64url"));
console.log(ok ? "VALID" : "INVALID");
if (ok) console.log(JSON.parse(raw.toString()));
process.exit(ok ? 0 : 2);

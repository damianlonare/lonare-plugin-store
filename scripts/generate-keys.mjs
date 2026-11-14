// Generates the Ed25519 key pair for license signing.
//   npm run keys
// Put LICENSE_PRIVATE_KEY in .env.local / Vercel env (keep it secret!).
// Embed the PUBLIC key in your plugin to verify keys offline.
import crypto from "node:crypto";
import fs from "node:fs";

const { privateKey, publicKey } = crypto.generateKeyPairSync("ed25519");
const priv = privateKey.export({ type: "pkcs8", format: "pem" });
const pub = publicKey.export({ type: "spki", format: "pem" });
const rawPub = publicKey.export({ format: "der", type: "spki" }).subarray(-32);

fs.mkdirSync("keys", { recursive: true });
fs.writeFileSync("keys/license_private.pem", priv, { mode: 0o600 });
fs.writeFileSync("keys/license_public.pem", pub);

console.log("Saved keys/license_private.pem and keys/license_public.pem\n");
console.log("Add this line to .env.local:\n");
console.log(`LICENSE_PRIVATE_KEY=${Buffer.from(priv).toString("base64")}\n`);
console.log("Raw 32-byte public key (hex) for your plugin (e.g. JUCE + libsodium/monocypher):");
console.log(rawPub.toString("hex"));

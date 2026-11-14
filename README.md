# Lonare Audio — plugin store

Online store for Damian Lonare's VST3 / AU / CLAP plugins. Built from the Google Stitch
design ("Brutal Minimal Editorial") with Next.js 15, Tailwind and Stripe.

**v1 scope:** sells only my own plugins. Rent-to-own and the creator marketplace from the
Stitch mockups are left for later.

## Pages

| Route | What it is |
| --- | --- |
| `/` | Home: hero, featured plugin, catalog preview, how it works, about, FAQ |
| `/plugins` | Catalog with filters (type, format, OS), search and sorting |
| `/plugins/[slug]` | Product page with specs, features and add to cart |
| `/carrito` | Cart with the bundle discount (3+ plugins = 20% off) |
| `/gracias` | After payment: license keys + installer downloads |
| `/licencias` | "Mis licencias": licenses saved in this browser + recover by pasting a key |

## Run it

```bash
npm install
cp .env.example .env.local
npm run dev        # http://localhost:3000
```

With no env vars set, the store runs in **demo mode**: a black demo bar appears on top of
every page, checkout skips Stripe and issues test licenses flagged `d: 1`.

## Going live

1. **Stripe.** Put an `sk_test_…` key in `STRIPE_SECRET_KEY` and test with card `4242 4242 4242 4242`.
   With a key set, checkout goes through Stripe Checkout even while the demo bar is still showing.
2. **License keys.** Run `npm run keys` and copy `LICENSE_PRIVATE_KEY` into your env.
   `keys/` is git-ignored, so keep a backup of the private key somewhere safe: if you lose it,
   you can't issue keys that your shipped plugins will accept.
3. **Installers.** Upload them to a private bucket and set `INSTALLER_BASE_URL`.
   File names: `<slug>-mac.pkg`, `<slug>-win.exe`, `<slug>-linux.tar.gz`.
4. Set `NEXT_PUBLIC_DEMO_MODE=false`, then deploy.

## Deploy (Cloudflare Workers)

Deployed as the Worker `plugin-store-demo` via [OpenNext](https://opennext.js.org/cloudflare).
Config lives in `wrangler.jsonc` and `open-next.config.ts`.

- Cloudflare build command: `npm run build` (runs the OpenNext build, which runs `next build`)
- Cloudflare deploy command: `npx wrangler deploy`
- Local preview in the Workers runtime: `npm run preview`
- Plain Next.js build: `npm run build:next`

Put secrets (`STRIPE_SECRET_KEY`, `LICENSE_PRIVATE_KEY`) in the Worker's
**Settings → Variables and Secrets** as *secrets*. Non-secret vars can go in `wrangler.jsonc`.
If you rename the Worker, change both `name` and the `WORKER_SELF_REFERENCE` service in `wrangler.jsonc`.

## How licensing works

`key = base64url(payload) + "." + base64url(ed25519_signature)`

The payload is `{ v, p: plugin slug, e: email, o: order id, t: issued at, d?: demo }`.
The server signs it with the private key. **Your plugin embeds only the public key** and checks
the signature offline, so it never needs internet. In the plugin:

- reject keys whose `p` isn't that plugin's slug
- reject keys with `d: 1` in release builds

`npm run keys` prints the raw 32-byte public key in hex for C++ (e.g. JUCE + libsodium or monocypher).
`npm run verify -- <key>` does the same check from the terminal.

Keys are deterministic per order + plugin, so reloading `/gracias` shows the same keys.

## Languages (ES / EN)

Every page is available in Spanish and English. The **ES | EN** switch in the header saves the
choice in a `lnr_lang` cookie. First-time visitors get their browser's language (Spanish fallback).
UI text lives in `lib/i18n.ts`; plugin copy (tagline, description, features) has `es` and `en`
fields in `lib/plugins.ts`. Stripe Checkout opens in the same language.

## Demo toast

While demo mode is on, a one-time toast (once per browser session) explains the store is a
showcase demo. It's `components/DemoToast.tsx`, next to the demo bar in `components/DemoBar.tsx`.

## Editing the catalog

Everything is in `lib/plugins.ts`: names, copy (in both languages), prices, formats, bundle rule and brand name.
The plugins there are **placeholders** taken from the Stitch mockups. Swap in your real ones.
Cover art is generated from each plugin's `hue` until you add real screenshots.

## Next steps

- Stripe webhook (`checkout.session.completed`) to email the license keys
- Real audio demos (dry / wet player) on product pages
- Signed, expiring download URLs instead of a plain redirect
- Accounts, so licenses follow the buyer across devices
- Rent-to-own and the creator marketplace from the Stitch designs

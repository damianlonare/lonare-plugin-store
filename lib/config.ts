// Demo mode is ON unless NEXT_PUBLIC_DEMO_MODE is explicitly "false".
// In demo mode the checkout skips Stripe and issues test licenses.
export const DEMO_MODE = process.env.NEXT_PUBLIC_DEMO_MODE !== "false";
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

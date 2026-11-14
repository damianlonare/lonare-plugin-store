import type { Config } from "tailwindcss";

// Tokens from the Stitch "Brutal Minimal Editorial" DESIGN.md
export default {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    borderRadius: { none: "0", DEFAULT: "0", full: "9999px" },
    extend: {
      colors: {
        coral: { DEFAULT: "#D15B51", hover: "#E27C6A" },
        ink: "#0C0C0C",
        body: "#161616",
        meta: "#828282",
        line: "#BABABA",
        surface: "#F4F4F6",
        ok: "#006953",
      },
      fontFamily: {
        display: ['"Space Grotesk"', "system-ui", "sans-serif"],
        sans: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "ui-monospace", "monospace"],
      },
      maxWidth: { page: "1280px" },
    },
  },
  plugins: [],
} satisfies Config;

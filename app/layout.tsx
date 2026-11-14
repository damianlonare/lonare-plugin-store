import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "@fontsource/space-grotesk/500.css";
import "@fontsource/space-grotesk/600.css";
import "@fontsource/space-grotesk/700.css";
import "./globals.css";
import DemoBar from "@/components/DemoBar";
import DemoToast from "@/components/DemoToast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { CartProvider } from "@/components/CartProvider";
import { LangProvider } from "@/components/LangProvider";
import { BRAND } from "@/lib/plugins";
import { getDict } from "@/lib/lang";

// Every page depends on the visitor's language cookie.
export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const { lang, t } = await getDict();
  return {
    title: { default: `${BRAND.name} — ${t.meta.title}`, template: `%s · ${BRAND.name}` },
    description: BRAND.tagline[lang],
  };
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { lang } = await getDict();
  return (
    <html lang={lang} className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body>
        <LangProvider lang={lang}>
          <CartProvider>
            <DemoBar />
            <Header />
            <main>{children}</main>
            <Footer />
            <DemoToast />
          </CartProvider>
        </LangProvider>
      </body>
    </html>
  );
}

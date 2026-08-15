import type { Metadata, Viewport } from "next";
import { Syne, Hanken_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { site } from "@/content/site";

// Editorial-premium display face — characterful, gallery-grade, not a template.
const displayFont = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
});

const bodyFont = Hanken_Grotesk({
  variable: "--font-hanken",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const monoFont = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — ${site.role}`,
    template: `%s — ${site.name}`,
  },
  description: site.description,
  keywords: [
    "AI engineer",
    "agentic AI",
    "LLM systems",
    "AI automation",
    "full-stack",
    "MERN",
    "Next.js",
    site.name,
  ],
  authors: [{ name: site.name }],
  creator: site.name,
  openGraph: {
    type: "website",
    url: site.url,
    title: `${site.name} — ${site.role}`,
    description: site.description,
    siteName: site.name,
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} — ${site.role}`,
    description: site.description,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: "#0a0b0d",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${displayFont.variable} ${bodyFont.variable} ${monoFont.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-bg text-foreground">
        {/*
          Resilience: anime.js (hero) and Motion (scroll reveals) render initial
          `opacity:0` inline styles on the server. Without JS those would stay
          hidden, so force them visible when scripting is off.
        */}
        <noscript>
          <style>{`[style*="opacity:0"]{opacity:1 !important;transform:none !important;}`}</style>
        </noscript>
        {children}
      </body>
    </html>
  );
}

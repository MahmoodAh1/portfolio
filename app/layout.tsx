import type { Metadata } from "next";
import { Oswald, Archivo, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { site } from "@/content/site";

// Chiselled, architectural display face for the Dark-Knight headers.
const displayFont = Oswald({
  variable: "--font-oswald",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const bodyFont = Archivo({
  variable: "--font-archivo",
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

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${displayFont.variable} ${bodyFont.variable} ${monoFont.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-bg text-foreground selection:text-white">
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

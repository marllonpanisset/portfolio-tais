import type { Metadata } from "next";
import localFont from "next/font/local";

import { MotionProvider } from "@/components/motion/MotionProvider";
import { JsonLd } from "@/components/seo/JsonLd";
import { siteConfig } from "@/config/client-site";
import { personJsonLd, websiteJsonLd } from "@/lib/structured-data";
import "./globals.css";

/**
 * Global metadata provides default SEO information for all routes.
 *
 * Individual pages can override these values using generateMetadata(),
 * while keeping consistent defaults for search engines and social sharing.
 */
export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),

  applicationName: siteConfig.name,

  icons: {
    icon: "/perfil.jpg",
    shortcut: "/perfil.jpg",
    apple: "/perfil.jpg",
  },

  title: {
    default: siteConfig.title,
    template: `%s | ${siteConfig.name}`,
  },

  description: siteConfig.description,

  authors: [
    {
      name: siteConfig.author.name,
      url: siteConfig.author.url,
    },
  ],

  creator: siteConfig.author.name,

  publisher: siteConfig.name,

  alternates: {
    canonical: "/",
  },

  formatDetection: {
    address: false,
    email: false,
    telephone: false,
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },

  openGraph: {
    type: "website",
    url: siteConfig.url,
    title: siteConfig.title,
    description: siteConfig.description,
    locale: siteConfig.locale.replace("-", "_"),
    siteName: siteConfig.name,
  },

  twitter: {
    card: "summary",
    title: siteConfig.title,
    description: siteConfig.description,
  },
};

const spaceGrotesk = localFont({
  src: [
    {
      path: "./fonts/SpaceGrotesk/SpaceGrotesk-Medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "./fonts/SpaceGrotesk/SpaceGrotesk-Bold.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-display",
  display: "swap",
});

const inter = localFont({
  src: "./fonts/Inter/InterVariable.woff2",
  variable: "--font-body",
  display: "swap",
  preload: false,
  weight: "100 900",
});

const jetbrainsMono = localFont({
  src: [
    {
      path: "./fonts/JetBrainsMono/JetBrainsMono-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/JetBrainsMono/JetBrainsMono-Medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "./fonts/JetBrainsMono/JetBrainsMono-Bold.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-mono",
  display: "swap",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${spaceGrotesk.variable} ${inter.variable} ${jetbrainsMono.variable}`}
    >
      <body>
        <JsonLd data={personJsonLd()} />
        <JsonLd data={websiteJsonLd()} />

        <MotionProvider>
          {children}
        </MotionProvider>

      </body>
    </html>
  );
}

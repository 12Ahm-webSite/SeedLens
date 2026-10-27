import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '@/context/ThemeContext';

import { getSiteUrl } from '@/lib/siteUrl';

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  metadataBase: siteUrl ? new URL(siteUrl) : undefined,
  title: {
    default: 'SeedLens — مكتشف ومحلل بذور ماين كرافت | Minecraft Seed Intelligence',
    template: '%s | SeedLens',
  },
  description:
    'محرك استكشاف التجمعات الهيكلية والعواصم التجارية والمدن القديمة وغرف المحاكمة في ماين كرافت عبر محاكاة تضاريس قطعية وتكافؤ 64-بت للبيدروك والجافا.',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'SeedLens — Minecraft Seed Intelligence & Biome Analyzer',
    description:
      'Deterministic Minecraft seed analysis, 3D terrain landmarks, trial chambers discovery, and side-by-side comparison engine.',
    url: siteUrl || '/',
    siteName: 'SeedLens',
    locale: 'ar',
    alternateLocale: ['en'],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SeedLens — Minecraft Seed Intelligence',
    description:
      'Deterministic Minecraft seed analysis, 3D terrain landmarks, trial chambers discovery, and side-by-side comparison engine.',
  },
};

const softwareSchema = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'SeedLens',
  applicationCategory: 'GameApplication',
  operatingSystem: 'Web, Linux, Windows, macOS',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
  description:
    'High-performance Minecraft seed intelligence and GIS analyzer powered by a deterministic C99 biomes engine with 64-bit Bedrock & Java parity.',
  url: siteUrl || 'https://seedlens.app',
  softwareVersion: '4.3',
};

const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'SeedLens',
  url: siteUrl || 'https://seedlens.app',
  inLanguage: ['ar', 'en'],
  description:
    'Minecraft Seed Intelligence, Spatial Clustering, 3D Landmarks & Biome Discovery Engine.',
};

import { cairo, plusJakartaSans, jetbrainsMono } from './fonts';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="ar"
      dir="rtl"
      className={`h-full antialiased scroll-smooth ${cairo.variable} ${plusJakartaSans.variable} ${jetbrainsMono.variable}`}
    >
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-[#C8C8C8] dark:bg-[#121316] text-[#1E1E1E] dark:text-[#E2E8F0] transition-colors duration-200">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}

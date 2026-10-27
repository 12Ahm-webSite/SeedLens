import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { LanguageProvider } from '@/context/LanguageContext';
import { getSiteUrl } from '@/lib/siteUrl';
import type { Locale } from '@/lib/translations';

const siteUrl = getSiteUrl();

export function generateStaticParams() {
  return [{ locale: 'ar' }, { locale: 'en' }];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isEn = locale === 'en';

  const title = isEn
    ? 'SeedLens — Minecraft Seed Intelligence & Biome Analyzer'
    : 'SeedLens — مكتشف ومحلل بذور ماين كرافت | Minecraft Seed Intelligence';

  const description = isEn
    ? 'High-performance Minecraft seed intelligence and GIS analyzer powered by a deterministic C99 biomes engine with 64-bit Bedrock & Java parity.'
    : 'محرك استكشاف التجمعات الهيكلية والعواصم التجارية والمدن القديمة وغرف المحاكمة في ماين كرافت عبر محاكاة تضاريس قطعية وتكافؤ 64-بت للبيدروك والجافا.';

  return {
    title: {
      default: title,
      template: '%s | SeedLens',
    },
    description,
    alternates: {
      canonical: `/${locale}`,
      languages: {
        ar: '/ar',
        en: '/en',
        'x-default': '/',
      },
    },
    openGraph: {
      title,
      description,
      url: `${siteUrl || ''}/${locale}`,
      locale: isEn ? 'en_US' : 'ar_AR',
      alternateLocale: isEn ? ['ar_AR'] : ['en_US'],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (locale !== 'ar' && locale !== 'en') {
    notFound();
  }

  const validLocale = locale as Locale;

  return (
    <LanguageProvider initialLocale={validLocale}>
      <script
        dangerouslySetInnerHTML={{
          __html: `document.documentElement.lang="${validLocale}";document.documentElement.dir="${validLocale === 'ar' ? 'rtl' : 'ltr'}";`,
        }}
      />
      {children}
    </LanguageProvider>
  );
}

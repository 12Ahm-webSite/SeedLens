import type { Metadata } from 'next';
import './globals.css';
import { LanguageProvider } from '@/context/LanguageContext';
import { ThemeProvider } from '@/context/ThemeContext';

export const metadata: Metadata = {
  title: 'SeedLens — مكتشف ومحلل بذور ماين كرافت جافا | Minecraft Java Seed Intelligence',
  description:
    'محرك استكشاف التجمعات الهيكلية والعواصم التجارية والمدن القديمة في ماين كرافت جافا عبر محاكاة تضاريس قطعية وتصميم GUI كلاسيكي تكتيكي.',
  keywords: [
    'Minecraft',
    'Minecraft Seed',
    'بذور ماين كرافت',
    'محلل بذور ماين كرافت',
    'Seed Analyzer',
    'Minecraft Java 1.20.6',
    'Cubiomes',
    'Trading Metropolis',
    'Ancient City',
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl" className="h-full antialiased scroll-smooth">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className="min-h-full flex flex-col bg-[#C8C8C8] dark:bg-[#121316] text-[#1E1E1E] dark:text-[#E2E8F0] transition-colors duration-200">
        <LanguageProvider>
          <ThemeProvider>{children}</ThemeProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}

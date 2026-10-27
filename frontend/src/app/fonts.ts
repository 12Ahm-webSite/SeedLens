import localFont from 'next/font/local';

export const cairo = localFont({
  src: [
    {
      path: '../fonts/cairo-arabic.woff2',
      weight: '600 800',
      style: 'normal',
    },
    {
      path: '../fonts/cairo-latin.woff2',
      weight: '600 800',
      style: 'normal',
    },
  ],
  variable: '--font-cairo',
  display: 'swap',
});

export const plusJakartaSans = localFont({
  src: [
    {
      path: '../fonts/plus-jakarta-sans.woff2',
      weight: '500 700',
      style: 'normal',
    },
  ],
  variable: '--font-jakarta',
  display: 'swap',
});

export const jetbrainsMono = localFont({
  src: [
    {
      path: '../fonts/jetbrains-mono.woff2',
      weight: '500 700',
      style: 'normal',
    },
  ],
  variable: '--font-mono',
  display: 'swap',
});

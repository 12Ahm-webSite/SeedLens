import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const SUPPORTED_LOCALES = ['ar', 'en'] as const;
type SupportedLocale = (typeof SUPPORTED_LOCALES)[number];
const DEFAULT_LOCALE: SupportedLocale = 'ar';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Explicitly bypass API, Admin, internal Next.js paths, and static assets
  if (
    pathname.startsWith('/api') ||
    pathname.startsWith('/my-admin') ||
    pathname.startsWith('/_next') ||
    pathname === '/robots.txt' ||
    pathname === '/sitemap.xml' ||
    pathname === '/llms.txt' ||
    pathname === '/favicon.ico' ||
    /\.(png|jpg|jpeg|gif|webp|svg|ico|css|js|woff2|woff|ttf|map|json)$/i.test(pathname)
  ) {
    return NextResponse.next();
  }

  // 2. Resolve preferred locale from cookie or Accept-Language header
  const cookieLocale = request.cookies.get('seedlens_locale')?.value;
  let preferredLocale: SupportedLocale = DEFAULT_LOCALE;

  if (cookieLocale === 'en' || cookieLocale === 'ar') {
    preferredLocale = cookieLocale;
  } else {
    const acceptLang = request.headers.get('accept-language') || '';
    if (acceptLang.toLowerCase().includes('en') && !acceptLang.toLowerCase().includes('ar')) {
      preferredLocale = 'en';
    }
  }

  // 3. Handle root path "/" -> redirect to preferred locale subpath
  if (pathname === '/') {
    const url = request.nextUrl.clone();
    url.pathname = `/${preferredLocale}`;
    return NextResponse.redirect(url, 307);
  }

  // 4. Handle "/documentation" -> redirect to "/[locale]/documentation"
  if (pathname === '/documentation') {
    const url = request.nextUrl.clone();
    url.pathname = `/${preferredLocale}/documentation`;
    return NextResponse.redirect(url, 307);
  }

  // 5. Check if pathname starts with a supported locale
  const pathnameLocale = SUPPORTED_LOCALES.find(
    (loc) => pathname === `/${loc}` || pathname.startsWith(`/${loc}/`)
  );

  if (pathnameLocale) {
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-seedlens-locale', pathnameLocale);
    requestHeaders.set('x-seedlens-dir', pathnameLocale === 'ar' ? 'rtl' : 'ltr');

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  }

  // 6. Unknown prefix fallback (e.g. /fr, /de) -> redirect to default locale
  const url = request.nextUrl.clone();
  url.pathname = `/${DEFAULT_LOCALE}${pathname}`;
  return NextResponse.redirect(url, 307);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - my-admin (Admin panel)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt, llms.txt
     */
    '/((?!api|my-admin|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|llms.txt).*)',
  ],
};

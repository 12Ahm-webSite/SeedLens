import type { MetadataRoute } from 'next';
import { getSiteUrl } from '@/lib/siteUrl';

export default function robots(): MetadataRoute.Robots {
  const siteUrl = getSiteUrl();

  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/', '/ar', '/en', '/ar/documentation', '/en/documentation', '/llms.txt'],
        disallow: ['/api/'],
        // Note: /my-admin is intentionally omitted from Disallow so search engines
        // can fetch the route and read the X-Robots-Tag / meta noindex directive,
        // permanently removing it from search indexes without indexing an empty snippet.
      },
    ],
    sitemap: siteUrl ? `${siteUrl}/sitemap.xml` : undefined,
  };
}

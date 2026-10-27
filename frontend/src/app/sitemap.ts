import type { MetadataRoute } from 'next';
import { getSiteUrl } from '@/lib/siteUrl';

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = getSiteUrl();
  const lastModified = new Date();

  // Generates absolute URLs if siteUrl is resolved, or relative paths if pending configuration
  const baseUrl = siteUrl || '';

  return [
    {
      url: `${baseUrl}/ar`,
      lastModified,
      changeFrequency: 'daily',
      priority: 1.0,
      alternates: {
        languages: {
          ar: `${baseUrl}/ar`,
          en: `${baseUrl}/en`,
        },
      },
    },
    {
      url: `${baseUrl}/en`,
      lastModified,
      changeFrequency: 'daily',
      priority: 1.0,
      alternates: {
        languages: {
          ar: `${baseUrl}/ar`,
          en: `${baseUrl}/en`,
        },
      },
    },
    {
      url: `${baseUrl}/ar/documentation`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 0.8,
      alternates: {
        languages: {
          ar: `${baseUrl}/ar/documentation`,
          en: `${baseUrl}/en/documentation`,
        },
      },
    },
    {
      url: `${baseUrl}/en/documentation`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 0.8,
      alternates: {
        languages: {
          ar: `${baseUrl}/ar/documentation`,
          en: `${baseUrl}/en/documentation`,
        },
      },
    },
  ];
}

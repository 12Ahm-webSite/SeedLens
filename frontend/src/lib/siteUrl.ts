/**
 * Resolves the canonical site URL safely across development and production environments.
 * Prevents silent localhost:3000 leakage into production SEO metadata.
 */
export function getSiteUrl(): string {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (configured) {
    // Strip trailing slash if present
    return configured.replace(/\/+$/, '');
  }

  if (process.env.NODE_ENV === 'production') {
    // In production without configured domain, warn and avoid emitting localhost:3000 into canonical metadata
    if (typeof window === 'undefined') {
      console.warn(
        '[SeedLens SEO Warning]: NEXT_PUBLIC_SITE_URL is not defined in production. Set this environment variable to your verified production domain.'
      );
    }
    return '';
  }

  // Safe local development fallback
  return 'http://localhost:3000';
}

/**
 * Constructs a full absolute URL for a path, or returns a relative path if no domain is configured.
 */
export function getAbsoluteUrl(path: string = '/'): string {
  const base = getSiteUrl();
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  if (!base) return cleanPath;
  return `${base}${cleanPath}`;
}

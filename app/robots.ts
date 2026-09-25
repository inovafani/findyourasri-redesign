import type { MetadataRoute } from 'next';

import { site } from '@/lib/site';

export const dynamic = 'force-static';

/**
 * Open to everyone, AI crawlers named so the intent is on record (GEO finding
 * 9). Hidden pages are never listed here: a disallow would publish the path and
 * stop crawlers from ever seeing its noindex.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: '*', allow: '/' },
      { userAgent: ['GPTBot', 'ClaudeBot', 'PerplexityBot', 'Google-Extended'], allow: '/' },
    ],
    sitemap: `${site.url}/sitemap.xml`,
  };
}

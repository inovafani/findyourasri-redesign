import type { MetadataRoute } from 'next';

import { site } from '@/lib/site';

export const dynamic = 'force-static';

const routes = ['', 'work', 'sectors', 'services', 'process', 'contact'] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((path) => ({
    url: `${site.url}/${path}${path ? '/' : ''}`,
    changeFrequency: 'monthly',
    priority: path === '' ? 1 : 0.8,
  }));
}

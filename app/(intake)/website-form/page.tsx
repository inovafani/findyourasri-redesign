import type { Metadata } from 'next';

import WebsiteFormApp from '@/components/client-profile/WebsiteFormApp';
import { site } from '@/lib/site';

/**
 * Hidden from search the same way as /client-profile/: noindex here and an X-Robots-Tag header in netlify.toml.
 * Not in the sitemap, not in llms.txt, not in robots.txt. The link preview names no one.
 */
export const metadata: Metadata = {
  title: { absolute: 'Website brief | Asri' },
  description: 'Tell Asri what your website needs to look like and do, so the design and build teams can start with everything they need.',
  robots: { index: false, follow: false },
  openGraph: {
    siteName: site.name,
    title: 'Website brief | Asri',
    description: 'Tell Asri what your website needs to look like and do, so the design and build teams can start with everything they need.',
    type: 'website',
    url: `${site.url}/website-form/`,
    locale: site.locale,
    images: [site.ogImage],
  },
};

export default function WebsiteFormPage() {
  return <WebsiteFormApp />;
}

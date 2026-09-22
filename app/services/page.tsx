import type { Metadata } from 'next';

import Services from '@/components/Services';
import { pageMeta } from '@/lib/site';

export const metadata: Metadata = {
  ...pageMeta.services,
  alternates: { canonical: '/services' },
};

export default function ServicesPage() {
  return <Services heading="h1" />;
}

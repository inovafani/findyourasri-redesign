import type { Metadata } from 'next';

import Sectors from '@/components/Sectors';
import { pageMeta } from '@/lib/site';

export const metadata: Metadata = {
  ...pageMeta.sectors,
  alternates: { canonical: '/sectors' },
};

export default function SectorsPage() {
  return <Sectors heading="h1" />;
}

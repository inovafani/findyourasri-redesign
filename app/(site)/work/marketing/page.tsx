import type { Metadata } from 'next';

import WorkCategoryView from '@/components/WorkCategoryView';
import { pageMetadata } from '@/lib/site';

export const metadata: Metadata = pageMetadata({
  path: '/work/marketing/',
  title: 'Marketing Work | Asri',
  description: 'Marketing campaigns across paid media, search and direct booking, for hospitality, operators and brands.',
});

export default function MarketingWorkPage() {
  return <WorkCategoryView slug="marketing" />;
}

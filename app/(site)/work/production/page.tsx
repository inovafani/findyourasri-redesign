import type { Metadata } from 'next';

import WorkCategoryView from '@/components/WorkCategoryView';
import { pageMetadata } from '@/lib/site';

export const metadata: Metadata = pageMetadata({
  path: '/work/production/',
  title: 'Production: Travel | Asri',
  description: 'Travel photography and film from the places our crew has worked, shot on the ground.',
});

/** Production opens on its first tab, Travel. */
export default function ProductionPage() {
  return <WorkCategoryView slug="production" tab="travel" />;
}

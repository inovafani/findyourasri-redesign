import type { Metadata } from 'next';

import WorkCategoryView from '@/components/WorkCategoryView';
import { getWorkCategory, type WorkTabSlug } from '@/lib/content';
import { pageMetadata } from '@/lib/site';

type Props = { params: Promise<{ tab: WorkTabSlug }> };

export const dynamicParams = false;

const descriptions: Partial<Record<WorkTabSlug, string>> = {
  client: 'Production for brands, hospitality and destinations: campaign photography and film, from scout to master.',
  films: 'Films by our crew: destination, brand and expedition films, shot and finished in house.',
};

/** Every Production tab except the first, which is /work/production/ itself. */
export function generateStaticParams() {
  return (getWorkCategory('production').tabs ?? []).slice(1).map((t) => ({ tab: t.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { tab } = await params;
  const label = getWorkCategory('production').tabs?.find((t) => t.slug === tab)?.label ?? '';
  return pageMetadata({
    path: `/work/production/${tab}/`,
    title: `Production: ${label} | Asri`,
    description: descriptions[tab] ?? '',
  });
}

export default async function ProductionTabPage({ params }: Props) {
  const { tab } = await params;
  return <WorkCategoryView slug="production" tab={tab} />;
}

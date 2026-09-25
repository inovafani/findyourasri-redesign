import type { Metadata } from 'next';

import WorkCategoryView from '@/components/WorkCategoryView';
import { pageMetadata } from '@/lib/site';

export const metadata: Metadata = pageMetadata({
  path: '/work/social-media/',
  title: 'Social Media Work | Asri',
  description: 'Social media content and accounts we run: planned ahead, in the brand’s voice, posted on schedule.',
});

export default function SocialMediaWorkPage() {
  return <WorkCategoryView slug="social-media" />;
}

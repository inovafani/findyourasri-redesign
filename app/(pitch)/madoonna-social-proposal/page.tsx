import type { Metadata } from 'next';

import SocialCalendar from '@/components/madoonna/SocialCalendar';

/** MADÒ ONNÀ December 2026 social calendar (draft, 11 Nov 2026). Shared by link only, so kept out of search. */
export const metadata: Metadata = {
  title: { absolute: 'MADÒ ONNÀ: December social calendar | Asri' },
  description: '17 feed posts plus daily stories, moving from tease to reveal to countdown.',
  robots: { index: false, follow: false },
};

export default function Page() {
  return <SocialCalendar />;
}

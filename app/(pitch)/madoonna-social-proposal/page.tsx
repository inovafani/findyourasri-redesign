import type { Metadata } from 'next';

import SocialCalendar from '@/components/madoonna/SocialCalendar';

/**
 * MADÒ ONNÀ December 2026 social calendar (draft, 11 Nov 2026), password protected. The title and description name no
 * client, because a link preview is visible before the password is entered.
 */
export const metadata: Metadata = {
  title: { absolute: 'A private client page | Asri' },
  description: 'A private page from Asri. Enter the password you were sent to open it.',
  robots: { index: false, follow: false },
  // The client's own logo in the link preview, not the Asri card (Tony, 11 Nov 2026).
  openGraph: { images: [{ url: '/img/og/mado-onna.jpg', width: 1200, height: 630, alt: 'MADÒ ONNÀ logo' }] },
};

export default function Page() {
  return <SocialCalendar />;
}

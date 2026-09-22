import type { Metadata } from 'next';

import Contact from '@/components/Contact';
import { pageMeta } from '@/lib/site';

export const metadata: Metadata = {
  ...pageMeta.contact,
  alternates: { canonical: '/contact' },
};

export default function ContactPage() {
  return <Contact />;
}

import type { Metadata } from 'next';

import SectionHead from '@/components/SectionHead';
import WorkIndex from '@/components/WorkIndex';
import { pageMeta } from '@/lib/site';

export const metadata: Metadata = {
  ...pageMeta.work,
  alternates: { canonical: '/work' },
};

export default function WorkPage() {
  return (
    <section className="section">
      <SectionHead
        heading="h1"
        label="Selected work"
        title="Ten Years of Campaigns, Films and Productions"
        lede="Every frame here was shot by the same crew that would shoot yours. Filter by the kind of client, or open any project to see it full frame."
      />
      <WorkIndex />
    </section>
  );
}

import type { Metadata } from 'next';

import Band from '@/components/Band';
import Measure from '@/components/Measure';
import Process from '@/components/Process';
import { pageMeta } from '@/lib/site';

export const metadata: Metadata = {
  ...pageMeta.process,
  alternates: { canonical: '/process' },
};

/**
 * The cycle and the numbers it is judged on, together. On their own each was a
 * thin page; the pair is the one that answers "what do I actually get, and how
 * will I know it worked" — which is the question that closes an agency deal.
 */
export default function ProcessPage() {
  return (
    <>
      <Process heading="h1" />
      <Band />
      <Measure />
    </>
  );
}

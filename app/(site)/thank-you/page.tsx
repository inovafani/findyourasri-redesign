import type { Metadata } from 'next';
import Link from 'next/link';

import { pageMetadata, pages } from '@/lib/site';

export const metadata: Metadata = pageMetadata({ ...pages.thankYou, index: false });

/**
 * A real static route, so Meta and Google Ads can count it as a destination.
 * It fires nothing: the form already pushed generate_lead. No reply time is
 * promised until someone owns it (W6).
 */
export default function ThankYouPage() {
  return (
    <>
      <section className="section section--first">
        <div className="stack stack--head">
          <h1 className="page-title line-mask">Thank you. Your note is with us.</h1>
        </div>
      </section>
      <section className="section section--tight">
        <div className="blk reveal">
          <p className="blk__title">What happens next</p>
          <p className="text">A person on the team reads every note and replies by email.</p>
        </div>
      </section>
      <section className="section section--tight section--short">
        <p className="btn-row reveal">
          <Link href="/work/" className="pill pill--ink magnetic">
            See the work
          </Link>
          <Link href="/" className="pill pill--outline magnetic">
            Back to the home page
          </Link>
        </p>
      </section>
    </>
  );
}

import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Page not found — Asri',
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <section className="section" style={{ paddingBottom: 'var(--sec)' }}>
      <div className="eyebrow" style={{ marginBottom: 20 }}>
        <span className="eyebrow__num">[404]</span>
        <span className="eyebrow__label">Not found</span>
        <span className="eyebrow__rule" />
      </div>
      <h1 className="sec-head__title">This page has slipped its mooring.</h1>
      <p className="sec-head__lede" style={{ marginTop: 20 }}>
        The link is broken or the page has moved. Everything we do is on the home page.
      </p>
      <p style={{ marginTop: 28 }}>
        <Link href="/" className="pill pill--ink">
          Back to the home page
          <span className="pill__arrow" aria-hidden="true">
            &#8599;
          </span>
        </Link>
      </p>
    </section>
  );
}

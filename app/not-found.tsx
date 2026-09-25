import type { Metadata } from 'next';
import Link from 'next/link';

import Footer from '@/components/Footer';
import Header from '@/components/Header';

export const metadata: Metadata = {
  title: { absolute: 'Page not found | Asri' },
  robots: { index: false, follow: false },
};

const exits = [
  { href: '/work/', label: 'See the work', style: 'pill--ink' },
  { href: '/sectors/', label: 'Find your sector', style: 'pill--outline' },
  { href: '/contact/', label: 'Start a conversation', style: 'pill--outline' },
];

/** Legacy store URLs never reach this page: they 301 to the home page (netlify.toml). */
export default function NotFound() {
  return (
    <div className="wrap">
      <Header />
      <main id="main">
        <section className="section section--first section--short">
          <div className="stack stack--head">
            <h1 className="page-title">This page has slipped its mooring.</h1>
            <p className="text">The link is broken or the page has moved.</p>
          </div>
          <p className="btn-row">
            {exits.map((exit) => (
              <Link
                key={exit.href}
                href={exit.href}
                className={`pill ${exit.style}`}
                data-track="cta_click"
                data-cta-location="not_found"
              >
                {exit.label}
              </Link>
            ))}
          </p>
        </section>
      </main>
      <Footer />
    </div>
  );
}

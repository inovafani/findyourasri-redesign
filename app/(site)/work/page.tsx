import type { Metadata } from 'next';

import Link from 'next/link';

import ArrowButton from '@/components/ArrowButton';
import Breadcrumbs from '@/components/Breadcrumbs';
import CtaLine from '@/components/CtaLine';
import JsonLd from '@/components/JsonLd';
import CenteredHead from '@/components/CenteredHead';
import Showreel from '@/components/Showreel';
import { frames, workCategories } from '@/lib/content';
import { pageMetadata, pages, site } from '@/lib/site';

export const metadata: Metadata = pageMetadata(pages.work);

/**
 * The way into the portfolio: the showreel, then the three categories Cam
 * asked for (Production, Marketing, Social Media), each its own page. The
 * showreel (C5) plays the hero film until Cam's reel exists.
 */
export default function WorkPage() {
  return (
    <>
      <Breadcrumbs items={[{ href: '/work/', label: 'Work' }]} />
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          name: pages.work.title,
          url: `${site.url}/work/`,
          isPartOf: { '@id': `${site.url}/#website` },
        }}
      />
      <section className="section section--first">
        <CenteredHead pattern="archipelago" title="Selected Campaigns" />
        <Showreel />
      </section>
      <section className="section">
        <div className="tiles tiles--3">
          {workCategories.map((c) => {
            const f = frames[c.cover];
            return (
              <Link key={c.slug} href={`/work/${c.slug}/`} className="tile reveal">
                <span className="tile__media">
                  <img
                    src={f.src}
                    alt=""
                    width={f.w}
                    height={f.h}
                    loading="lazy"
                    style={'pos' in f ? { objectPosition: f.pos } : undefined}
                  />
                </span>
                <span className="tile__meta">
                  <span className="tile__text">
                    <span className="tile__name">{c.name}</span>
                    <span className="tile__covers">{c.line}</span>
                  </span>
                  <ArrowButton />
                </span>
              </Link>
            );
          })}
        </div>
      </section>
      <CtaLine location="work_page" />
    </>
  );
}

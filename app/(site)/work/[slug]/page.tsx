import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import Breadcrumbs from '@/components/Breadcrumbs';
import CtaLine from '@/components/CtaLine';
import FrameGrid from '@/components/FrameGrid';
import JsonLd from '@/components/JsonLd';
import {
  frames,
  getSector,
  getService,
  publishedCaseStudies,
} from '@/lib/content';
import { orgId, pageMetadata, site } from '@/lib/site';

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

/**
 * A route exists only for a case study with the client's written approval on
 * record (C10, C12). Until one does, the production build has none, and the
 * wireframe's placeholder entry is built by `next dev` only, so the template
 * can be reviewed without shipping it.
 */
export function generateStaticParams() {
  const list = publishedCaseStudies();
  // A static export must build at least one route, so an empty list builds a
  // placeholder that renders the 404; scripts/check-build.mjs deletes it
  // from out/ before deploy.
  return list.length ? list.map((c) => ({ slug: c.slug })) : [{ slug: '_none' }];
}

function getCase(slug: string) {
  return publishedCaseStudies().find((c) => c.slug === slug);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const cs = getCase(slug);
  if (!cs) return { robots: { index: false, follow: false } };
  return pageMetadata({
    path: `/work/${cs.slug}/`,
    title: `${cs.client}: ${cs.line} | Asri`,
    description: cs.brief,
    index: Boolean(cs.approval),
  });
}

/**
 * One engagement, told honestly: who, what was asked, what was done, and only
 * the numbers that were measured. A result never renders without its source
 * and date; a quote never renders without dated written permission.
 */
export default async function CaseStudyPage({ params }: Props) {
  const { slug } = await params;
  const cs = getCase(slug);
  if (!cs) notFound();

  const sector = getSector(cs.sector);
  const serviceNames = cs.services.map((s) => getService(s).name);
  const results = cs.results.filter((r) => r.source && r.measuredOn);

  // The next case study in the same sector, else the next one.
  const all = publishedCaseStudies();
  const others = all.filter((c) => c.slug !== cs.slug);
  const next = others.find((c) => c.sector === cs.sector) ?? others[0];

  const facts = [
    { label: 'Client', value: cs.client },
    { label: 'Sector', value: sector.kicker },
    { label: 'Where', value: cs.where },
    { label: 'When', value: cs.when },
    { label: 'Services', value: serviceNames.join(', ') },
    { label: 'Crew', value: cs.crew?.join(', ') },
  ].filter((f) => f.value);

  const hero = frames[cs.hero];

  return (
    <>
      <Breadcrumbs
        items={[
          { href: '/work/', label: 'Work' },
          { href: `/work/${cs.slug}/`, label: cs.client },
        ]}
      />
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'CreativeWork',
          name: `${cs.client}: ${cs.line}`,
          url: `${site.url}/work/${cs.slug}/`,
          creator: { '@id': orgId },
          about: sector.kicker,
        }}
      />

      <section className="section section--first">
        <div className="stack stack--head">
          <h1 className="page-title line-mask">
            {cs.client}: {cs.line}
          </h1>
        </div>
        <div className="wide-frame clip-reveal">
          <img className="parallax-media" src={hero.src} alt={hero.alt} width={hero.w} height={hero.h} />
        </div>
      </section>

      <section className="section">
        <dl className="facts">
          {facts.map((f) => (
            <div key={f.label} className="reveal">
              <dt className="up">{f.label}</dt>
              <dd>{f.value}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="section">
        <div className="stack stack--prose">
          <h2 className="sec-title line-mask">The Brief</h2>
          <p className="lead reveal">{cs.brief}</p>
        </div>
      </section>

      <section className="section">
        <div className="split split--top">
          <h2 className="sec-title line-mask">What We Did</h2>
          <ol className="olist">
            {cs.did.map((step) => (
              <li key={step} className="reveal">
                {step}
              </li>
            ))}
          </ol>
        </div>
      </section>

      {cs.frames.length ? (
        <section className="section">
          <FrameGrid items={cs.frames.map((id) => frames[id])} caption="none" keep3 />
        </section>
      ) : null}

      <section className="section">
        {results.length ? (
          <div className="results">
            {results.map((r) => (
              <div key={r.label} className="result reveal">
                <p className="result__value">{r.value}</p>
                <p className="text">{r.label}</p>
                <p className="small">
                  {r.source} · measured {r.measuredOn}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="results-pending reveal">Results: pending measurement</p>
        )}
      </section>

      {cs.quote?.permissionOn ? (
        <section className="section">
          <figure className="blk quote reveal">
            <blockquote className="quote__text">&#8220;{cs.quote.text}&#8221;</blockquote>
            <figcaption className="small">
              {cs.quote.name}, {cs.quote.role}
            </figcaption>
          </figure>
        </section>
      ) : null}

      <CtaLine
        location="case_study"
        line={next ? `Next: ${next.client} →` : undefined}
        lineHref={next ? `/work/${next.slug}/` : undefined}
      />
    </>
  );
}

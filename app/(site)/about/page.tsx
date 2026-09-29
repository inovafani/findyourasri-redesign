import type { Metadata } from 'next';

import Band from '@/components/Band';
import Breadcrumbs from '@/components/Breadcrumbs';
import Contours from '@/components/Contours';
import CtaLine from '@/components/CtaLine';
import JsonLd from '@/components/JsonLd';
import Markets from '@/components/Markets';
import RecordIcon from '@/components/RecordIcon';
import { frames, people, record, whyAsri } from '@/lib/content';
import { orgId, pageMetadata, pages, site } from '@/lib/site';

export const metadata: Metadata = pageMetadata(pages.about);

/**
 * Who is in the room, in the wireframe's order: the hero, why Asri exists,
 * the people, the record, the standard, then the CTA line. The founder story
 * (C11) and the portraits are placeholders until they are written and shot.
 */
/** Off until told otherwise. Flip to true to bring The People section back. */
const showPeopleSection = false;

export default function AboutPage() {
  const shown = showPeopleSection ? people.filter((p) => p.show) : [];
  const hero = frames.about;

  return (
    <>
      <Breadcrumbs items={[{ href: '/about/', label: 'About' }]} />
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'AboutPage',
          name: pages.about.title,
          url: `${site.url}/about/`,
          about: { '@id': orgId },
          ...(shown.length
            ? {
                mentions: shown.map((p) => ({
                  '@type': 'Person',
                  name: p.fullName,
                  jobTitle: p.role,
                  worksFor: { '@id': orgId },
                })),
              }
            : {}),
        }}
      />

      <section className="section section--first">
        <div className="stack stack--head about-head">
          <Contours name="islands" />
          <h1 className="page-title line-mask">Operators and Marketers.</h1>
          <p className="text text--b reveal">We have stood on the other side of the counter.</p>
          <p className="text reveal">
            A decade running venues, expeditions and shoots. A decade running the marketing built
            to sell them.
          </p>
        </div>
        <div className="wide-frame clip-reveal">
          <img
            className="parallax-media"
            src={hero.src}
            alt={hero.alt}
            width={hero.w}
            height={hero.h}
            style={{ objectPosition: hero.pos }}
          />
        </div>
      </section>

      <section className="section">
        <div className="stack stack--prose">
          <h2 className="sec-title line-mask">{whyAsri.title}</h2>
          {whyAsri.paragraphs.map((p) => (
            <p key={p} className="text reveal">
              {p}
            </p>
          ))}
        </div>
      </section>

      {shown.length ? (
        <section className="section">
          <h2 className="sec-title sec-title--gap line-mask">The People</h2>
          <ul className="people">
            {shown.map((p) => (
              <li key={p.name} className="person reveal">
                {/* 4:5 portrait. Until Cam decides a row for it (C12 shot
                    list), the frame stands empty. */}
                <div className="person__photo">
                  {p.photo ? <img src={p.photo} alt={p.fullName} width={800} height={1000} loading="lazy" /> : null}
                </div>
                <p className="person__name">{p.name}</p>
                <p className="person__role">{p.role}</p>
                {p.line ? <p className="person__line">{p.line}</p> : null}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section className="section">
        <div className="stack">
          <h2 className="sec-title sec-title--gap line-mask">The Record</h2>
          {/* Six cells, three across: the reach line and the five credentials
              fill the grid exactly, so nothing is left ragged. */}
          <div className="record">
            <div className="record__cell reveal">
              <RecordIcon name="globe" />
              <Markets className="record__markets" />
            </div>
            {record.map((item) => (
              <div key={item.text} className="record__cell reveal">
                <RecordIcon name={item.icon} />
                <span>{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Band />
      <CtaLine location="about" />
    </>
  );
}

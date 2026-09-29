import type { Metadata } from 'next';

import Breadcrumbs from '@/components/Breadcrumbs';
import ContactModule from '@/components/ContactModule';
import FrameGrid from '@/components/FrameGrid';
import JsonLd from '@/components/JsonLd';
import Measured from '@/components/Measured';
import ServiceCards from '@/components/ServiceCards';
import SplitHero from '@/components/SplitHero';
import { frames, getSector, sectorFrames, sectors, type FrameId, type SectorSlug } from '@/lib/content';
import { orgId, pageMetadata, sectorPages, site } from '@/lib/site';

type Props = { params: Promise<{ slug: SectorSlug }> };

const SHOW_CAMPAIGNS = false;

export const dynamicParams = false;

export function generateStaticParams() {
  return sectors.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  return pageMetadata({ path: `/sectors/${slug}/`, ...sectorPages[slug] });
}

/**
 * The landing page for one kind of client: where per-sector outreach (A9) and
 * search land. What Asri runs for the sector, what it asks to be measured on,
 * the frames, and the first step, which opens the contact section.
 */
export default async function SectorPage({ params }: Props) {
  const { slug } = await params;
  const sector = getSector(slug);
  const work = sectorFrames(slug);
  // Where the first step and the form share a title (brands), the card says it
  // once, with the step's promise as its lede, rather than twice in a row.
  const sameTitle = sector.firstStep.title === sector.formTitle;

  return (
    <>
      <Breadcrumbs
        items={[
          { href: '/sectors/', label: 'Sectors' },
          { href: `/sectors/${slug}/`, label: sector.name },
        ]}
      />
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'WebPage',
          name: sectorPages[slug].title,
          url: `${site.url}/sectors/${slug}/`,
          about: { '@id': orgId },
          isPartOf: { '@id': `${site.url}/#website` },
        }}
      />

      <SplitHero
        title={sector.title}
        frame={frames[sector.frame as FrameId]}
        pattern={sector.pattern}
        cta={{ href: `/contact/?sector=${sector.slug}`, location: 'sector_page' }}
      >
        <p className="text reveal">{sector.covers}</p>
        <p className="text text--b reveal">{sector.proof}</p>
      </SplitHero>

      <section className="section">
        <h2 className="sec-title sec-title--gap line-mask">What We Run for {sector.name}</h2>
        <ServiceCards items={sector.services} />
      </section>

      <Measured
        items={sector.measures}
        frame={sector.measuresFrame ? frames[sector.measuresFrame] : undefined}
      />

      {/* Selected Campaigns: off until real campaigns replace the archive frames,
          as on the home page. */}
      {SHOW_CAMPAIGNS && work.length ? (
        <section className="section">
          <h2 className="sec-title sec-title--gap line-mask">Selected Campaigns</h2>
          <FrameGrid items={work} />
        </section>
      ) : null}

      <ContactModule
        title={sector.formTitle}
        sector={sector.lead}
        intro={sameTitle ? undefined : sector.firstStep}
        lede={sameTitle ? sector.firstStep.body : undefined}
      />
    </>
  );
}

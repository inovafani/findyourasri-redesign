import type { Metadata } from 'next';

import Breadcrumbs from '@/components/Breadcrumbs';
import ContactModule from '@/components/ContactModule';
import JsonLd from '@/components/JsonLd';
import CenteredHead from '@/components/CenteredHead';
import Sectors from '@/components/Sectors';
import { pageMetadata, pages, site } from '@/lib/site';

export const metadata: Metadata = pageMetadata(pages.sectors);

/** A plain index for anyone who lands on the parent URL or clicks Sectors in the header. */
export default function SectorsPage() {
  return (
    <>
      <Breadcrumbs items={[{ href: '/sectors/', label: 'Sectors' }]} />
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          name: pages.sectors.title,
          url: `${site.url}/sectors/`,
          isPartOf: { '@id': `${site.url}/#website` },
        }}
      />
      <section className="section section--first">
        <CenteredHead
          pattern="currents"
          title="Four Kinds of Client, One Way of Working"
          lede="We ask to be measured on the number each of them already keeps. Find yours."
        />
        <Sectors />
      </section>
      <ContactModule />
    </>
  );
}

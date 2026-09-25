import type { Metadata } from 'next';

import BookSiteDay from '@/components/BookSiteDay';
import Breadcrumbs from '@/components/Breadcrumbs';
import ContactForm from '@/components/ContactForm';
import DirectLines from '@/components/DirectLines';
import JsonLd from '@/components/JsonLd';
import PageHead from '@/components/PageHead';
import { orgId, pageMetadata, pages, site } from '@/lib/site';

export const metadata: Metadata = pageMetadata(pages.contact);

/**
 * Where every "Start a conversation" lands: the form on the left; the site
 * day and the direct lines on the right. Book a site day opens the scheduler
 * once A11 sets site.bookingUrl; until then it scrolls to the form. The Bahasa Indonesia line
 * is one line of copy (W12); a translated site is out of scope.
 */
export default function ContactPage() {
  return (
    <>
      <Breadcrumbs items={[{ href: '/contact/', label: 'Contact' }]} />
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'ContactPage',
          name: pages.contact.title,
          url: `${site.url}/contact/`,
          about: {
            '@id': orgId,
            contactPoint: {
              '@type': 'ContactPoint',
              contactType: 'sales',
              email: site.email,
              telephone: site.phoneHref,
              availableLanguage: ['English', 'Indonesian'],
            },
          },
        }}
      />

      <section className="section section--first">
        <PageHead
          title="A Day on Site, Then a Plan You Can Say No To"
          lede="We spend a day with your team, then come back with a plan and a number."
        />
      </section>

      <section className="section section--tight">
        <div className="contact-grid">
          <ContactForm />

          <div className="stack">
            <div className="blk">
              <p className="blk__title">The Site Day</p>
              <p className="text">Use the form, and say where the work happens.</p>
              <p className="btn-row btn-row--tight">
                <BookSiteDay />
              </p>
            </div>
            <div className="blk">
              <p className="blk__title">Or talk to us directly</p>
              <DirectLines
                location="contact"
                extra={[
                  { label: 'Hours', value: site.hours },
                  { label: 'Clock', value: 'Bali keeps Singapore’s clock, and our afternoon is London’s morning.' },
                  { label: 'Base', value: site.base },
                ]}
              />
            </div>
            <div className="blk" lang="id">
              <p className="blk__title">Bahasa Indonesia</p>
              <p className="text">
                Lebih nyaman berbahasa Indonesia? Silakan tulis pesan Anda dalam bahasa Indonesia dan
                kami akan membalas dalam bahasa yang sama.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

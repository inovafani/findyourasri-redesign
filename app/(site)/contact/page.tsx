import type { Metadata } from 'next';

import BookSiteDay from '@/components/BookSiteDay';
import Breadcrumbs from '@/components/Breadcrumbs';
import ContactForm from '@/components/ContactForm';
import DirectLines from '@/components/DirectLines';
import JsonLd from '@/components/JsonLd';
import { orgId, pageMetadata, pages, site } from '@/lib/site';

export const metadata: Metadata = pageMetadata(pages.contact);

/**
 * Where every "Start a conversation" lands: a bento of three coloured cells
 * (the pitch, the direct lines, the practical details) beside the form,
 * rather than one flat panel. Book a site day opens the scheduler once A11
 * sets site.bookingUrl; until then it scrolls to the form.
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
        <div className="contact-split">
          <div className="bento">
            <div className="bento-cell bento-cell--hero">
              <p className="up">Let's talk</p>
              <h1 className="sec-title line-mask">
                A Day on Site, Then a Plan You Can Say No To
              </h1>
              <p className="text reveal">
                We spend a day with your team, then come back with a plan and a number.
              </p>
              <p className="btn-row btn-row--tight">
                <BookSiteDay variant="light" />
              </p>
            </div>

            <div className="bento-cell bento-cell--ocean">
              <p className="blk__title">Reach us directly</p>
              <DirectLines location="contact" />
            </div>

            <div className="bento-cell bento-cell--aqua">
              <p className="blk__title">Good to know</p>
              <dl className="lines">
                <div>
                  <dt>Hours</dt>
                  <dd>{site.hours}</dd>
                </div>
                <div>
                  <dt>Clock</dt>
                  <dd>We keep Singapore time, and our afternoon is London’s morning.</dd>
                </div>
                <div>
                  <dt>Base</dt>
                  <dd>{site.base}</dd>
                </div>
              </dl>
            </div>
          </div>

          <ContactForm />
        </div>
      </section>
    </>
  );
}

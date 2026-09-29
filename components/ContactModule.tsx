import type { ReactNode } from 'react';

import ContactForm from '@/components/ContactForm';
import ContactMedia from '@/components/ContactMedia';
import Contours from '@/components/Contours';
import DirectLines from '@/components/DirectLines';
import type { LeadSector } from '@/lib/content';

/**
 * Shared component C, laid out as the wireframe draws it.
 *
 * full (home): the heading and lede top left, the site day and direct lines
 *   bottom left, the form on the right; the contact film runs behind it all.
 * compact (index, sector and service pages): one card, a dark panel with the
 *   heading, lede and direct lines on the left, the form on the right. An
 *   `intro` (a sector's first step) opens the section above the card, centred,
 *   as the heads on /services/ open theirs.
 * start (hidden pages): the first step's copy on the left; the form and the
 *   direct lines on the right.
 *
 * Every variant renders the same Netlify form. Book a site day opens the
 * scheduler once A11 sets site.bookingUrl; until then it scrolls to the form.
 */
export default function ContactModule({
  variant = 'compact',
  title = 'Start With a Day on Site',
  lede,
  intro,
  children,
  sector,
  service,
  vertical,
  lockSector,
  emailLabel,
  companyLabel,
  id = 'contact',
}: {
  variant?: 'full' | 'compact' | 'start';
  title?: string;
  lede?: string;
  intro?: { title: string; body: string };
  children?: ReactNode;
  sector?: LeadSector;
  service?: string;
  vertical?: string;
  lockSector?: boolean;
  emailLabel?: string;
  companyLabel?: string;
  id?: string;
}) {
  const form = (
    <ContactForm
      sector={sector}
      service={service}
      vertical={vertical}
      lockSector={lockSector}
      emailLabel={emailLabel}
      companyLabel={companyLabel}
    />
  );

  if (variant === 'compact') {
    // One card: a dark panel with the heading, the promise and the direct
    // lines over a faint chart motif, and the form on white beside it.
    return (
      <section id={id} className="section section--anchor">
        {intro ? (
          <div className="stack stack--head stack--head-center">
            <h2 className="sec-title line-mask">{intro.title}</h2>
            <p className="text reveal">{intro.body}</p>
          </div>
        ) : null}
        <div className="contact-card">
          <div className="contact-card__intro">
            <Contours name="ripples" />
            <div className="contact-card__copy">
              <h2 className="sec-title line-mask">{title}</h2>
              <p className="text reveal">
                {lede ?? 'We spend a day with your team, then come back with a plan and a number.'}
              </p>
            </div>
            <DirectLines location="contact" />
          </div>
          <div className="contact-card__form">{form}</div>
        </div>
      </section>
    );
  }

  const grid = (
    <div className="contact-grid">
      <div className="stack">
        <h2 className="sec-title line-mask">{title}</h2>
        {lede ? <p className="text reveal">{lede}</p> : null}
        {children}
      </div>

      <div className="stack">
        {form}
        <DirectLines location="contact" />
      </div>
    </div>
  );

  return (
    <section
      id={id}
      className="section section--anchor"
      data-section-view={variant === 'full' ? 'contact' : undefined}
    >
      {variant === 'full' ? (
        // Split in two: the contact film fills the left half on its own, with
        // the logo and direct lines over it; the heading and form sit on a
        // solid panel to the right, so neither covers the other.
        <div className="contact-hero">
          <div className="contact-hero__visual">
            <div className="contact-hero__media" aria-hidden="true">
              <ContactMedia />
            </div>
            <div className="contact-hero__scrim" aria-hidden="true" />
            <div className="contact-hero__copy">
              <img
                className="contact-hero__logo reveal"
                src="/img/asri-white.png"
                alt="Asri"
                width={1171}
                height={320}
                loading="lazy"
              />
              <DirectLines location="contact" />
            </div>
          </div>
          <div className="contact-hero__form">
            <div className="contact-hero__head stack">
              <h2 className="sec-title line-mask">{title}</h2>
              {lede ? <p className="text reveal">{lede}</p> : null}
            </div>
            {form}
          </div>
        </div>
      ) : (
        grid
      )}
    </section>
  );
}

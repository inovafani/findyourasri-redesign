import ContactMedia from '@/components/ContactMedia';
import { site } from '@/lib/site';

/** 08 · next step. */
export default function Contact({ num, heading = 'h1' }: { num?: string; heading?: 'h1' | 'h2' }) {
  const Title = heading;
  return (
    <section id="contact" className="section--anchor" style={{ paddingTop: 'var(--gap)' }}>
      <div className="contact">
        <div className="contact__body">
          <div className="eyebrow">
            {num ? <span className="eyebrow__num reveal">{num}</span> : null}
            <span className="eyebrow__label reveal">Next step</span>
          </div>
          <Title className="contact__title line-mask">Come and See It With Us</Title>
          <p className="contact__lede reveal">
            The first step is a day on site. We walk the property with your team, see it the way a
            guest sees it, and come back with a plan and a number, before you have committed to
            anything.
          </p>
          <p className="contact__note reveal">
            No pitch theatre. A day on site, then a plan you can say no to.
          </p>
          <div className="contact__actions">
            <a href={`mailto:${site.email}`} className="pill pill--ink pill--lg reveal magnetic">
              {site.email}
              <span className="pill__arrow" aria-hidden="true">
                &#8599;
              </span>
            </a>
            <a href={`tel:${site.phoneHref}`} className="pill pill--outline pill--lg reveal magnetic">
              {site.phone}
            </a>
          </div>
        </div>

        <div className="contact__media">
          <ContactMedia />
        </div>
      </div>
    </section>
  );
}

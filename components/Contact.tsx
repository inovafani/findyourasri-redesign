import { site } from '@/lib/site';

/** 08 · next step. */
export default function Contact() {
  return (
    <section id="contact" className="section--anchor" style={{ paddingTop: 'var(--gap)' }}>
      <div className="contact">
        <div className="contact__body">
          <div className="eyebrow">
            <span className="eyebrow__num reveal">[08]</span>
            <span className="eyebrow__label reveal">Next step</span>
          </div>
          <h2 className="contact__title line-mask">Come and See It With Us</h2>
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
          <div className="parallax-media">
            <img
              src="/img/band-close.jpg"
              alt="A phinisi at anchor in still water at the end of the day"
              width={843}
              height={1500}
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

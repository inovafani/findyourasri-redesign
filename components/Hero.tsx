import SmoothLink from '@/components/SmoothLink';

/**
 * The opening frame. Everything inside it is animated from Motion.tsx: the
 * frame wipes open, the headline arrives line by line out of its own mask, and
 * the photograph drifts on scroll from an 8% overscan so no edge is ever shown.
 */
export default function Hero() {
  return (
    <section id="top" className="hero" style={{ paddingTop: 'clamp(10px, 1.4vw, 20px)' }}>
      <div className="hero__frame clip-reveal">
        <div className="hero__media media-zoom">
          <img
            src="/img/hero.jpg"
            alt="Three phinisi sailing yachts under full sail on open water"
            width={2000}
            height={1336}
            fetchPriority="high"
          />
        </div>
        <div className="hero__scrim" aria-hidden="true" />

        <div className="hero__top">
          <p className="hero__eyebrow reveal">[ MARKETING &amp; PRODUCTION ]</p>

          <SmoothLink href="#work" className="hero__card reveal">
            <span>
              <span className="hero__card-title">Raja Ampat, Indonesia</span>
              <span className="hero__card-sub">Destination film &#183; Shot by Asri</span>
            </span>
            <span className="hero__card-arrow" aria-hidden="true">
              &#8599;
            </span>
          </SmoothLink>
        </div>

        <div className="hero__bottom">
          <h1 className="hero__title line-mask">
            Operators and Marketers in the Same Room<sup>&#174;</sup>
          </h1>

          <div className="hero__aside">
            <p className="hero__lede reveal">
              Content production, performance marketing and creator campaigns for destinations,
              hospitality groups and global brands.
            </p>
            <div className="hero__actions">
              <SmoothLink href="#contact" className="pill pill--light reveal magnetic">
                Start a conversation
                <span className="pill__arrow" aria-hidden="true">
                  &#8599;
                </span>
              </SmoothLink>
              <SmoothLink href="#work" className="pill pill--ghost reveal magnetic">
                See the work
              </SmoothLink>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

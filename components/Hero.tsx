import Link from "next/link";

import HeroMedia from "@/components/HeroMedia";

/**
 * The opening frame: the headline, one line of copy and two
 * calls to action, in one centred stack, so the photograph carries the rest.
 *
 * Everything inside is animated from Motion.tsx: the frame wipes open, the
 * headline arrives line by line out of its own mask, and the photograph drifts
 * on scroll from an 8% overscan so no edge is ever shown.
 */
export default function Hero() {
  return (
    <section
      id="top"
      className="hero"
      style={{ paddingTop: "clamp(10px, 1.4vw, 20px)" }}
    >
      <div className="hero__frame clip-reveal">
        <div className="hero__media media-zoom">
          <HeroMedia />
        </div>
        <div className="hero__scrim" aria-hidden="true" />

        <div className="hero__bottom">
          <h1 className="hero__title line-mask">
            Find Your{" "}
            <span className="hero__title-glue">
              <span className="hero__highlight-wrap">
                <span className="hero__circle hero__circle--a" aria-hidden="true" />
                <span className="hero__highlight">Story</span>
              </span>
              ,
            </span>
            <br />
            Find Your{" "}
            <span className="hero__title-glue">
              <span className="hero__highlight-wrap">
                <span className="hero__circle hero__circle--b" aria-hidden="true" />
                <span className="hero__highlight">Audience</span>
              </span>
              ,
            </span>
            <br />
            Find Your{" "}
            <span className="hero__title-glue">
              <span className="hero__highlight-wrap">
                <span className="hero__circle hero__circle--c" aria-hidden="true" />
                <span className="hero__highlight">Asri</span>
              </span>
              .
            </span>
          </h1>

          <div className="hero__aside">
            <p className="hero__lede reveal">
              Award winning production house and marketing agency built by
              the operators, creators, and strategists themselves.
            </p>
            <div className="hero__actions">
              <Link
                href="/contact/"
                className="pill pill--light reveal magnetic"
                data-track="cta_click"
                data-cta-location="hero"
              >
                Start a conversation
                <span className="pill__arrow" aria-hidden="true">
                  &#8599;
                </span>
              </Link>
              <Link
                href="/work/production/"
                className="pill pill--ghost reveal magnetic"
                data-track="cta_click"
                data-cta-location="hero"
              >
                See the work
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

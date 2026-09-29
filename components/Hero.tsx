import Link from "next/link";

import HeroMedia from "@/components/HeroMedia";

const ROTATION = [
  { word: "Story", ring: "a" },
  { word: "Audience", ring: "b" },
  { word: "Asri", ring: "c" },
] as const;

/**
 * The opening frame: the headline, one line of copy and two
 * calls to action, in one centred stack, so the photograph carries the rest.
 *
 * The frame wipes open and the photograph drifts on scroll (Motion.tsx); the
 * headline rotates its three lines on its own CSS loop (globals.css).
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
          {/* One line at a time: the three share one grid cell and take turns
              on a CSS loop. Screen readers get the whole slogan once. */}
          <h1 className="hero__title">
            <span className="hero__sr">
              Find Your Story, Find Your Audience, Find Your Asri.
            </span>
            <span className="hero__rotator" aria-hidden="true">
              {ROTATION.map(({ word, ring }) => (
                <span key={word} className="hero__line">
                  Find Your{" "}
                  <span className="hero__highlight-wrap">
                    <span className={`hero__circle hero__circle--${ring}`} />
                    <span className="hero__highlight">{word}</span>
                  </span>
                </span>
              ))}
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

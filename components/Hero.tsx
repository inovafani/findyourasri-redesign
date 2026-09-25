import Link from "next/link";

import HeroMedia from "@/components/HeroMedia";
import { site } from "@/lib/site";

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
          <h1 className="hero__title line-mask">{site.slogan}</h1>

          <div className="hero__aside">
            <p className="hero__lede reveal">
              Content production, performance marketing and creator campaigns
              for hospitality, operators, global brands and destinations.
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
                href="/work/"
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

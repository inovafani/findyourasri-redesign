"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import HeroMedia from "@/components/HeroMedia";
import { motionIsOff } from "@/lib/gsap";

const ROTATION = ["Story", "Audience", "Asri"] as const;

/**
 * The opening frame: the headline, one line of copy and two
 * calls to action, in one centred stack, so the photograph carries the rest.
 *
 * The frame wipes open and the photograph drifts on scroll (Motion.tsx); the
 * headline rotates its three lines on its own CSS loop (globals.css). The
 * rotator's width is measured per word here and applied inline, so the
 * centred headline re-balances around whichever word is showing instead of
 * staying boxed to the widest one ("Audience.").
 */
export default function Hero() {
  const wordRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const [widths, setWidths] = useState<number[] | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (motionIsOff()) return;

    const measure = () => {
      setWidths(wordRefs.current.map((el) => el?.getBoundingClientRect().width ?? 0));
    };
    measure();
    document.fonts?.ready?.then(measure).catch(() => {});
    window.addEventListener("resize", measure);

    const id = window.setInterval(() => {
      setActiveIndex((i) => (i + 1) % ROTATION.length);
    }, 2500);

    return () => {
      window.removeEventListener("resize", measure);
      window.clearInterval(id);
    };
  }, []);

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
          {/* "Find Your" stays put; only the word after it takes turns on a
              CSS loop, sharing one grid cell. Screen readers get the whole
              slogan once. */}
          <h1 className="hero__title">
            <span className="hero__sr">
              Find Your Story, Find Your Audience, Find Your Asri.
            </span>
            <span aria-hidden="true">
              Find Your{" "}
              <span
                className="hero__rotator"
                style={widths ? { width: `${widths[activeIndex]}px` } : undefined}
              >
                {ROTATION.map((word, i) => (
                  <span
                    key={word}
                    className="hero__line"
                    ref={(el) => {
                      wordRefs.current[i] = el;
                    }}
                  >
                    <span className="hero__highlight">{word}.</span>
                  </span>
                ))}
              </span>
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

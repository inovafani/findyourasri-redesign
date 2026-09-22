'use client';

import { useEffect, useRef, useState } from 'react';

import Lightbox from '@/components/Lightbox';
import { motionIsOff } from '@/lib/gsap';
import { projects } from '@/lib/content';

/**
 * The homepage's rail: a few projects, scrolled sideways, as a taste of /work.
 * The full index — every project, filterable, at size — is the page itself.
 */
export default function WorkRail() {
  const [index, setIndex] = useState<number | null>(null);
  const [slide, setSlide] = useState(0);
  const [edges, setEdges] = useState({ start: true, end: false });

  const trackRef = useRef<HTMLDivElement>(null);
  const openerRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    let frame = 0;
    const read = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const middle = track.scrollLeft + track.clientWidth / 2;
        let nearest = 0;
        let best = Infinity;
        Array.from(track.children).forEach((child, i) => {
          const el = child as HTMLElement;
          const gap = Math.abs(el.offsetLeft + el.offsetWidth / 2 - middle);
          if (gap < best) {
            best = gap;
            nearest = i;
          }
        });
        setSlide(nearest);
        // A one-pixel tolerance: fractional scroll widths never land exactly.
        setEdges({
          start: track.scrollLeft <= 1,
          end: track.scrollLeft + track.clientWidth >= track.scrollWidth - 1,
        });
      });
    };

    read();
    track.addEventListener('scroll', read, { passive: true });
    window.addEventListener('resize', read);
    return () => {
      track.removeEventListener('scroll', read);
      window.removeEventListener('resize', read);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  const scrollToCard = (i: number) => {
    const track = trackRef.current;
    const target = track?.children[i] as HTMLElement | undefined;
    if (!track || !target) return;
    track.scrollTo({ left: target.offsetLeft, behavior: motionIsOff() ? 'auto' : 'smooth' });
  };

  /**
   * Arrows move exactly one card. Deliberately a relative `scrollBy` rather
   * than a jump to `slide + delta`: `slide` is the card nearest the centre of
   * the viewport, which with three cards on screen is already the second one —
   * so index arithmetic skipped a card on every press.
   */
  const nudge = (delta: number) => {
    const track = trackRef.current;
    const card = track?.firstElementChild as HTMLElement | null;
    if (!track || !card) return;
    const gap = parseFloat(getComputedStyle(track).columnGap || '0') || 0;
    track.scrollBy({
      left: delta * (card.offsetWidth + gap),
      behavior: motionIsOff() ? 'auto' : 'smooth',
    });
  };

  return (
    <>
      <div className="work__controls">
        <button
          type="button"
          className="work__arrow"
          onClick={() => nudge(-1)}
          disabled={edges.start}
          aria-label="Previous projects"
        >
          <span aria-hidden="true">&#8592;</span>
        </button>
        <button
          type="button"
          className="work__arrow"
          onClick={() => nudge(1)}
          disabled={edges.end}
          aria-label="Next projects"
        >
          <span aria-hidden="true">&#8594;</span>
        </button>
      </div>

      <div className="work__rail" ref={trackRef}>
        {projects.map((project, i) => (
          <article key={project.src} className="proj clip-reveal">
            {/* The whole card is the control, caption included — a strip of
                text sitting on an image should not be the one dead spot. */}
            <button
              type="button"
              className="proj__card"
              aria-label={`Open ${project.client}: ${project.alt}`}
              onClick={(event) => {
                openerRef.current = event.currentTarget;
                setIndex(i);
              }}
            >
              <img
                src={project.src}
                alt={project.alt}
                width={project.w}
                height={project.h}
                loading="lazy"
              />
              {/*
                A masked block, not an <img>: the mark has to render white over
                the photograph, and the `filter: invert()` that used to do that
                is silently dropped by Safari once the CSS minifier rewrites
                `invert(1)` to its argument-less form.
              */}
              <span
                className="proj__logo"
                aria-hidden="true"
                style={{
                  width: project.logoW,
                  height: project.logoH,
                  WebkitMaskImage: `url(${project.logo})`,
                  maskImage: `url(${project.logo})`,
                }}
              />
              <span className="proj__caption">
                <span className="proj__client">{project.client}</span>
                <span className="proj__services">{project.services}</span>
              </span>
            </button>
          </article>
        ))}
      </div>

      {/* Phone only: the rail is display:none above the slider breakpoint. */}
      <div className="mosaic__rail">
        <div className="mosaic__dots" role="tablist" aria-label="Projects">
          {projects.map((project, i) => (
            <button
              key={project.src}
              type="button"
              role="tab"
              aria-selected={i === slide}
              aria-label={`Go to ${project.client}`}
              className={`mosaic__dot${i === slide ? ' is-on' : ''}`}
              onClick={() => scrollToCard(i)}
            />
          ))}
        </div>
        <p className="mosaic__pos">
          {String(slide + 1).padStart(2, '0')} / {String(projects.length).padStart(2, '0')}
        </p>
      </div>

      <Lightbox
        items={projects}
        index={index}
        restoreFocusTo={openerRef}
        onClose={() => setIndex(null)}
        onStep={(delta) =>
          setIndex((current) =>
            current === null ? current : (current + delta + projects.length) % projects.length,
          )
        }
      />
    </>
  );
}

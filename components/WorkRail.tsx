'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

import { EASE, gsap, initGsap, motionIsOff } from '@/lib/gsap';
import { projects } from '@/lib/content';

/**
 * Featured work: a horizontal rail of project cards, each opening a viewer.
 *
 * The rail is one scroll container at every width — arrows drive it on desktop,
 * a swipe drives it on a phone — so there is a single layout to reason about
 * rather than a grid that becomes a slider.
 *
 * The viewer is a portal on <body>: it must not inherit the rail's
 * `overflow: hidden`, and it has to sit above the sticky header.
 */
export default function WorkRail() {
  const [index, setIndex] = useState<number | null>(null);
  const [closing, setClosing] = useState(false);
  const [slide, setSlide] = useState(0);
  const [edges, setEdges] = useState({ start: true, end: false });

  const trackRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const openerRef = useRef<HTMLButtonElement | null>(null);
  const directionRef = useRef(1);

  const isOpen = index !== null;
  const item = index === null ? null : projects[index];

  /* ---------- the rail ---------- */
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
    track.scrollTo({
      left: target.offsetLeft,
      behavior: motionIsOff() ? 'auto' : 'smooth',
    });
  };

  /**
   * Arrows move exactly one card. Deliberately a relative `scrollBy` rather
   * than a jump to `slide + delta`: `slide` is the card nearest the centre of
   * the viewport, which with three cards on screen is already the second one —
   * so index arithmetic skipped a card on every press. Snap settles the rest.
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

  /* ---------- the viewer ---------- */
  const close = useCallback(() => {
    if (motionIsOff()) {
      setIndex(null);
      return;
    }
    setClosing(true);
    initGsap();
    gsap.to(rootRef.current, {
      opacity: 0,
      duration: 0.28,
      ease: EASE,
      onComplete: () => {
        setClosing(false);
        setIndex(null);
      },
    });
  }, []);

  const step = useCallback((delta: number) => {
    directionRef.current = delta;
    setIndex((current) =>
      current === null ? current : (current + delta + projects.length) % projects.length,
    );
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        close();
      } else if (event.key === 'ArrowRight') {
        step(1);
      } else if (event.key === 'ArrowLeft') {
        step(-1);
      } else if (event.key === 'Tab') {
        const focusable = rootRef.current?.querySelectorAll<HTMLElement>('button:not(:disabled)');
        if (!focusable?.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };

    // Locking the body would collapse the scrollbar and shift the page under
    // the viewer, so its width is given back as padding.
    const gutter = window.innerWidth - document.documentElement.clientWidth;
    const previous = {
      overflow: document.body.style.overflow,
      paddingRight: document.body.style.paddingRight,
    };
    document.body.style.overflow = 'hidden';
    if (gutter > 0) document.body.style.paddingRight = `${gutter}px`;

    document.addEventListener('keydown', onKey);
    const opener = openerRef.current;
    closeRef.current?.focus();

    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = previous.overflow;
      document.body.style.paddingRight = previous.paddingRight;
      opener?.focus({ preventScroll: true });
    };
  }, [isOpen, close, step]);

  useEffect(() => {
    if (!isOpen || motionIsOff()) return;
    initGsap();

    const ctx = gsap.context(() => {
      gsap.fromTo('.lb__scrim', { opacity: 0 }, { opacity: 1, duration: 0.35, ease: EASE });
      gsap.fromTo(
        '.lb__bar, .lb__foot',
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.5, ease: EASE, delay: 0.1 },
      );
    }, rootRef);

    return () => ctx.revert();
    // Keyed on `isOpen` alone: the entrance plays once per opening, not again
    // on every step through the frames.
  }, [isOpen]);

  useEffect(() => {
    if (index === null || motionIsOff()) return;
    const el = imageRef.current;
    if (!el) return;

    initGsap();
    const tween = gsap.fromTo(
      el,
      { opacity: 0, x: directionRef.current * 26, scale: 0.985 },
      { opacity: 1, x: 0, scale: 1, duration: 0.5, ease: EASE },
    );
    return () => {
      tween.kill();
    };
  }, [index]);

  useEffect(() => {
    if (index === null) return;
    [1, -1].forEach((delta) => {
      const preload = new window.Image();
      preload.src = projects[(index + delta + projects.length) % projects.length].src;
    });
  }, [index]);

  const swipeRef = useRef<{ x: number; y: number } | null>(null);
  const onPointerDown = (event: React.PointerEvent) => {
    swipeRef.current = { x: event.clientX, y: event.clientY };
  };
  const onPointerUp = (event: React.PointerEvent) => {
    const start = swipeRef.current;
    swipeRef.current = null;
    if (!start) return;
    const dx = event.clientX - start.x;
    if (Math.abs(dx) < 48 || Math.abs(event.clientY - start.y) > Math.abs(dx)) return;
    step(dx < 0 ? 1 : -1);
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
                directionRef.current = 1;
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
                `invert(1)` to its argument-less form. Masking a white box has
                no such ambiguity. Decorative — the caption names the client, so
                a screen reader should not hear it twice.
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

      {(isOpen || closing) &&
        item &&
        createPortal(
          <div
            className="lb"
            ref={rootRef}
            role="dialog"
            aria-modal="true"
            aria-label="Project viewer"
          >
            <button className="lb__scrim" type="button" aria-label="Close viewer" onClick={close} />

            <div className="lb__bar">
              <p className="lb__count">
                {String((index ?? 0) + 1).padStart(2, '0')} /{' '}
                {String(projects.length).padStart(2, '0')}
              </p>
              <button
                type="button"
                className="lb__btn"
                ref={closeRef}
                onClick={close}
                aria-label="Close viewer"
              >
                <span aria-hidden="true">&#10005;</span>
              </button>
            </div>

            <div className="lb__stage" onPointerDown={onPointerDown} onPointerUp={onPointerUp}>
              <figure className="lb__figure">
                <img
                  ref={imageRef}
                  src={item.src}
                  alt={item.alt}
                  width={item.w}
                  height={item.h}
                  draggable={false}
                />
              </figure>
            </div>

            <div className="lb__foot">
              <div className="lb__caption">
                <p className="lb__client">{item.client}</p>
                <p className="lb__services">{item.services}</p>
              </div>
              <div className="lb__nav">
                <button
                  type="button"
                  className="lb__btn"
                  onClick={() => step(-1)}
                  aria-label="Previous project"
                >
                  <span aria-hidden="true">&#8592;</span>
                </button>
                <button
                  type="button"
                  className="lb__btn"
                  onClick={() => step(1)}
                  aria-label="Next project"
                >
                  <span aria-hidden="true">&#8594;</span>
                </button>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}

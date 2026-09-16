'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

import { EASE, gsap, initGsap, motionIsOff } from '@/lib/gsap';
import { mosaic } from '@/lib/content';

/**
 * The archive grid and its lightbox.
 *
 * The grid itself is placed by name (see `.mosaic` in globals.css) so it tiles
 * exactly. Each frame opens a viewer that can be stepped with the buttons, the
 * arrow keys or a swipe, and closed with the button, Escape or the backdrop.
 *
 * The viewer is a portal on <body>: it must not inherit the grid's `overflow:
 * hidden`, and it should sit above the sticky header.
 */
export default function Gallery() {
  const [index, setIndex] = useState<number | null>(null);
  const [closing, setClosing] = useState(false);
  // Which slide is centred, for the rail under the phone slider.
  const [slide, setSlide] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);

  const imageRef = useRef<HTMLImageElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const openerRef = useRef<HTMLButtonElement | null>(null);
  // Which way the last step went, so the incoming frame enters from that side.
  const directionRef = useRef(1);

  const isOpen = index !== null;
  const item = index === null ? null : mosaic[index];

  const close = useCallback(() => {
    if (motionIsOff()) {
      setIndex(null);
      return;
    }
    // Play the exit, then unmount — `closing` keeps the node alive until the
    // tween is done.
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
      current === null ? current : (current + delta + mosaic.length) % mosaic.length,
    );
  }, []);

  /* ---------- while open: keys, scroll lock, focus ---------- */
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
        // Keep focus inside the viewer for as long as it is open.
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
      opener?.focus();
    };
  }, [isOpen, close, step]);

  /* ---------- entrance ---------- */
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

  /* ---------- each frame, including the first ---------- */
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

  /* ---------- keep the neighbours warm ---------- */
  useEffect(() => {
    if (index === null) return;
    [1, -1].forEach((delta) => {
      const preload = new window.Image();
      preload.src = mosaic[(index + delta + mosaic.length) % mosaic.length].src;
    });
  }, [index]);

  /* ---------- phone slider: which frame is centred ---------- */
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    let frame = 0;
    const read = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        // Above the slider breakpoint the grid does not scroll, so this is a
        // no-op rather than a branch on window width.
        const middle = track.scrollLeft + track.clientWidth / 2;
        let nearest = 0;
        let best = Infinity;
        Array.from(track.children).forEach((child, i) => {
          const el = child as HTMLElement;
          const centre = el.offsetLeft + el.offsetWidth / 2;
          const gap = Math.abs(centre - middle);
          if (gap < best) {
            best = gap;
            nearest = i;
          }
        });
        setSlide(nearest);
      });
    };

    read();
    track.addEventListener('scroll', read, { passive: true });
    return () => {
      track.removeEventListener('scroll', read);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  const goToSlide = (i: number) => {
    const track = trackRef.current;
    const target = track?.children[i] as HTMLElement | undefined;
    if (!track || !target) return;
    track.scrollTo({
      left: target.offsetLeft - (track.clientWidth - target.offsetWidth) / 2,
      behavior: motionIsOff() ? 'auto' : 'smooth',
    });
  };

  /* ---------- swipe ---------- */
  const swipeRef = useRef<{ x: number; y: number } | null>(null);
  const onPointerDown = (event: React.PointerEvent) => {
    swipeRef.current = { x: event.clientX, y: event.clientY };
  };
  const onPointerUp = (event: React.PointerEvent) => {
    const start = swipeRef.current;
    swipeRef.current = null;
    if (!start) return;
    const dx = event.clientX - start.x;
    // Ignore anything that reads as a vertical drag rather than a swipe.
    if (Math.abs(dx) < 48 || Math.abs(event.clientY - start.y) > Math.abs(dx)) return;
    step(dx < 0 ? 1 : -1);
  };

  return (
    <>
      <div className="mosaic" ref={trackRef}>
        {mosaic.map((frame, i) => (
          <figure key={frame.src} className="clip-reveal" style={{ gridArea: frame.area }}>
            <button
              type="button"
              className="mosaic__tile"
              aria-label={`Open image ${i + 1} of ${mosaic.length}: ${frame.alt}`}
              onClick={(event) => {
                openerRef.current = event.currentTarget;
                directionRef.current = 1;
                setIndex(i);
              }}
            >
              <img src={frame.src} alt={frame.alt} width={frame.w} height={frame.h} loading="lazy" />
            </button>
          </figure>
        ))}
      </div>

      {/* Phone only: the rail is display:none above the slider breakpoint. */}
      <div className="mosaic__rail">
        <div className="mosaic__dots" role="tablist" aria-label="Archive frames">
          {mosaic.map((frame, i) => (
            <button
              key={frame.src}
              type="button"
              role="tab"
              aria-selected={i === slide}
              aria-label={`Go to frame ${i + 1}`}
              className={`mosaic__dot${i === slide ? ' is-on' : ''}`}
              onClick={() => goToSlide(i)}
            />
          ))}
        </div>
        <p className="mosaic__pos">
          {String(slide + 1).padStart(2, '0')} / {String(mosaic.length).padStart(2, '0')}
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
            aria-label="Archive image viewer"
          >
            <button className="lb__scrim" type="button" aria-label="Close viewer" onClick={close} />

            <div className="lb__bar">
              <p className="lb__count">
                {String((index ?? 0) + 1).padStart(2, '0')} / {String(mosaic.length).padStart(2, '0')}
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
              <p className="lb__caption">{item.alt}</p>
              <div className="lb__nav">
                <button
                  type="button"
                  className="lb__btn"
                  onClick={() => step(-1)}
                  aria-label="Previous image"
                >
                  <span aria-hidden="true">&#8592;</span>
                </button>
                <button
                  type="button"
                  className="lb__btn"
                  onClick={() => step(1)}
                  aria-label="Next image"
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

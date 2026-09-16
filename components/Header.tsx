'use client';

import { Fragment, useEffect, useRef } from 'react';

import SmoothLink from '@/components/SmoothLink';
import { navLinks } from '@/lib/content';

/**
 * The one pinned element on the page. Past the first screen it condenses and
 * grows a hairline, so the canvas underneath reads as scrolling past it rather
 * than under a floating slab.
 */
export default function Header() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        el.classList.toggle('is-stuck', window.scrollY > 24);
      });
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <header ref={ref} className="header">
      <div className="header__row">
        <SmoothLink href="#top" className="header__logo" aria-label="Asri, home">
          <img
            className="hdr-item"
            src="/img/asri-white.png"
            alt="Asri"
            width={1171}
            height={320}
          />
          <sup className="hdr-item">&#174;</sup>
        </SmoothLink>

        <nav className="nav" aria-label="Primary">
          {navLinks.map((link, i) => (
            <Fragment key={link.href}>
              {i > 0 && (
                <span className="nav__sep hdr-item" aria-hidden="true">
                  +
                </span>
              )}
              <SmoothLink href={link.href} className="hdr-item">
                {link.label}
              </SmoothLink>
            </Fragment>
          ))}
        </nav>

        <SmoothLink href="#contact" className="pill pill--ink pill--sm hdr-item magnetic">
          Start a conversation
          <span className="pill__arrow" aria-hidden="true">
            &#8599;
          </span>
        </SmoothLink>
      </div>
    </header>
  );
}

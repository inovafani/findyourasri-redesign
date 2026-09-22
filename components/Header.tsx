'use client';

import Link from 'next/link';
import { Fragment, useEffect, useRef } from 'react';

import MobileMenu from '@/components/MobileMenu';
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
        <Link href="/" className="header__logo hdr-item" aria-label="Asri, home">
          <img src="/img/asri-white.png" alt="Asri" width={1171} height={320} />
          <sup>&#174;</sup>
        </Link>

        <nav className="nav" aria-label="Primary">
          {navLinks.map((link, i) => (
            <Fragment key={link.href}>
              {i > 0 && (
                <span className="nav__sep hdr-item" aria-hidden="true">
                  +
                </span>
              )}
              <Link href={link.href} className="hdr-item">
                {link.label}
              </Link>
            </Fragment>
          ))}
        </nav>

        <Link href="/contact" className="pill pill--ink pill--sm hdr-item magnetic header__cta">
          Start a conversation
          <span className="pill__arrow" aria-hidden="true">
            &#8599;
          </span>
        </Link>

        <MobileMenu />
      </div>
    </header>
  );
}

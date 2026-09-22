'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useRouter } from 'next/navigation';

import { EASE, EASE_LONG, gsap, initGsap, motionIsOff } from '@/lib/gsap';
import { navLinks } from '@/lib/content';
import { site } from '@/lib/site';

/**
 * The phone navigation: a bar button that opens a full-height sheet.
 *
 * Only rendered below 860px (the button and sheet are display:none above it),
 * so the desktop header is untouched. The sheet is a portal on <body> so it
 * cannot inherit the header's stacking or padding.
 */
export default function MobileMenu() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const sheetRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const timeline = useRef<gsap.core.Timeline | null>(null);
  /**
   * What to do once the sheet is really gone. It is run by the open effect's
   * cleanup rather than straight after `setOpen(false)`, because that state
   * update is what releases `body { overflow: hidden }` — and it releases it a
   * commit later. A scroll started before that lands on a locked document and
   * gets clamped back to 0, which is exactly the nav "not working".
   */
  const pending = useRef<(() => void) | null>(null);

  const close = useCallback(() => {
    if (motionIsOff() || !timeline.current) {
      setOpen(false);
      return;
    }
    timeline.current.timeScale(1.7).reverse();
    timeline.current.eventCallback('onReverseComplete', () => setOpen(false));
  }, []);

  /* ---------- open: keys, scroll lock, focus ---------- */
  useEffect(() => {
    if (!open) return;

    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close();
    };

    const gutter = window.innerWidth - document.documentElement.clientWidth;
    const previous = {
      overflow: document.body.style.overflow,
      paddingRight: document.body.style.paddingRight,
    };
    document.body.style.overflow = 'hidden';
    if (gutter > 0) document.body.style.paddingRight = `${gutter}px`;
    document.addEventListener('keydown', onKey);
    const button = buttonRef.current;

    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = previous.overflow;
      document.body.style.paddingRight = previous.paddingRight;
      // preventScroll: returning focus must not fight the jump below.
      button?.focus({ preventScroll: true });

      const run = pending.current;
      pending.current = null;
      run?.();
    };
  }, [open, close]);

  /* ---------- the sheet itself ---------- */
  useEffect(() => {
    if (!open || motionIsOff()) return;
    initGsap();

    const ctx = gsap.context(() => {
      // Wipes down from the header, then the rows arrive out of their masks —
      // the same language as the hero frame and the headlines.
      const tl = gsap.timeline({ defaults: { ease: EASE_LONG } });
      tl.fromTo(
        '.sheet__panel',
        { clipPath: 'inset(0% 0% 100% 0%)' },
        { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.55 },
      )
        .fromTo(
          '.sheet__row span',
          { yPercent: 115 },
          { yPercent: 0, duration: 0.65, stagger: 0.055 },
          0.18,
        )
        .fromTo(
          '.sheet__foot > *',
          { opacity: 0, y: 12 },
          { opacity: 1, y: 0, duration: 0.5, stagger: 0.06, ease: EASE },
          0.34,
        );
      timeline.current = tl;
    }, sheetRef);

    return () => {
      timeline.current = null;
      ctx.revert();
    };
  }, [open]);

  const go = (href: string) => {
    // Still deferred to the close: navigating while the sheet is mid-exit
    // leaves the body scroll-locked on the page that arrives.
    pending.current = () => router.push(href);
    close();
  };

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        className={`burger${open ? ' is-open' : ''}`}
        aria-expanded={open}
        aria-label={open ? 'Close menu' : 'Open menu'}
        onClick={() => (open ? close() : setOpen(true))}
      >
        <span className="burger__bar" />
        <span className="burger__bar" />
      </button>

      {open &&
        createPortal(
          <div className="sheet" ref={sheetRef} role="dialog" aria-modal="true" aria-label="Menu">
            <div className="sheet__panel">
              <nav className="sheet__nav" aria-label="Primary">
                {[...navLinks, { href: '/contact', label: 'Contact' }].map((link, i) => (
                  <button
                    key={link.href}
                    type="button"
                    className="sheet__row"
                    onClick={() => go(link.href)}
                  >
                    <span>
                      <i aria-hidden="true">{String(i + 1).padStart(2, '0')}</i>
                      {link.label}
                    </span>
                  </button>
                ))}
              </nav>

              <div className="sheet__foot">
                <a href={`mailto:${site.email}`} className="sheet__email">
                  {site.email}
                </a>
                <a href={`tel:${site.phoneHref}`} className="sheet__phone">
                  {site.phone}
                </a>
                <button type="button" className="pill pill--ink" onClick={() => go('/contact')}>
                  Start a conversation
                  <span className="pill__arrow" aria-hidden="true">
                    &#8599;
                  </span>
                </button>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}

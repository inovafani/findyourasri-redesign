'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

import { captureUtm, track } from '@/lib/track';

/**
 * One listener for every tracked click, and the home page's section views.
 *
 * A "Start a conversation" pill carries data-track="cta_click" and its
 * location. Contact links need nothing: any mailto, tel or wa.me link is
 * tracked, and it reports the nearest data-link-location above it.
 */
export default function Tracking() {
  const pathname = usePathname();

  useEffect(() => {
    captureUtm();

    const onClick = (event: MouseEvent) => {
      const el = (event.target as Element | null)?.closest<HTMLElement>('a, button');
      if (!el) return;

      const where = el.closest<HTMLElement>('[data-link-location]')?.dataset.linkLocation;
      const tagged = el.dataset.track;

      if (tagged) {
        track(tagged, {
          cta_location: el.dataset.ctaLocation,
          cta_text: el.textContent?.replace(/\s+/g, ' ').replace('↗', '').trim(),
          booking_tool: el.dataset.bookingTool,
          link_location: where,
        });
        return;
      }

      const href = el.getAttribute('href') ?? '';
      if (href.startsWith('mailto:')) track('email_click', { link_location: where });
      else if (href.startsWith('tel:'))
        track('phone_click', { link_location: where, phone_country: el.dataset.phoneCountry });
      else if (href.startsWith('https://wa.me/')) track('whatsapp_click', { link_location: where });
    };

    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, []);

  // section_view: a home section reaches half the viewport, once per view.
  useEffect(() => {
    const sections = document.querySelectorAll<HTMLElement>('[data-section-view]');
    if (!sections.length) return;

    const seen = new Set<string>();
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const id = (entry.target as HTMLElement).dataset.sectionView!;
          if (!entry.isIntersecting || seen.has(id)) return;
          seen.add(id);
          track('section_view', { section_id: id });
        });
      },
      { rootMargin: '0px 0px -50% 0px' },
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, [pathname]);

  return null;
}

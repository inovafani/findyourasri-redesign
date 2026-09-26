'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

/**
 * A safety net under client-side navigation.
 *
 * Next fetches a page's data before it swaps the page in. On a slow or flaky
 * connection that wait used to look like a dead click, and when the data
 * could not be used at all (a request that stalled, or a tab opened before a
 * new deploy) the page never changed until a hard refresh. This shows a thin
 * progress bar the moment an internal link is followed, and if the new page
 * has not arrived within FALLBACK_MS it loads it the ordinary way instead.
 */
const FALLBACK_MS = 4000;

export function followLink(href: string) {
  window.dispatchEvent(new CustomEvent('asri:navigate', { detail: href }));
}

export default function NavGuard() {
  const pathname = usePathname();
  const [pending, setPending] = useState(false);
  const timer = useRef<number | undefined>(undefined);

  // The page arrived: stop waiting.
  useEffect(() => {
    window.clearTimeout(timer.current);
    // eslint-disable-next-line react-hooks/set-state-in-effect -- sync to the route
    setPending(false);
  }, [pathname]);

  useEffect(() => {
    const start = (href: string) => {
      const target = new URL(href, window.location.href);
      if (target.origin !== window.location.origin) return;
      if (target.pathname === window.location.pathname) return; // same page or a hash
      setPending(true);
      window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => window.location.assign(target.href), FALLBACK_MS);
    };

    const onClick = (event: MouseEvent) => {
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const link = (event.target as Element | null)?.closest('a');
      if (!link || link.target === '_blank' || link.hasAttribute('download')) return;
      const href = link.getAttribute('href');
      if (!href || href.startsWith('#') || /^(mailto|tel):/.test(href)) return;
      start(link.href);
    };
    const onProgrammatic = (event: Event) => start((event as CustomEvent<string>).detail);

    // Capture, so it sees the click before Next's Link handles it.
    document.addEventListener('click', onClick, true);
    window.addEventListener('asri:navigate', onProgrammatic);
    return () => {
      document.removeEventListener('click', onClick, true);
      window.removeEventListener('asri:navigate', onProgrammatic);
      window.clearTimeout(timer.current);
    };
  }, []);

  return <div className={`nav-progress${pending ? ' is-on' : ''}`} aria-hidden="true" />;
}

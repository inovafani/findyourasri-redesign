'use client';

import type { MouseEvent, ReactNode } from 'react';

import { initGsap, motionIsOff, scrollToTarget } from '@/lib/gsap';

/**
 * An in-page anchor that eases to its target instead of jumping, and clears the
 * sticky header on the way. Falls back to the browser's own jump under
 * prefers-reduced-motion, and to a plain <a> if JavaScript never arrives.
 */
export default function SmoothLink({
  href,
  className,
  children,
  ...rest
}: {
  href: string;
  className?: string;
  children: ReactNode;
  'aria-label'?: string;
}) {
  function onClick(event: MouseEvent<HTMLAnchorElement>) {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0) return;

    const target = document.querySelector(href);
    if (!target) return;

    event.preventDefault();
    history.replaceState(null, '', href);

    if (motionIsOff()) {
      target.scrollIntoView();
      return;
    }

    initGsap();
    scrollToTarget(href === '#top' ? 0 : target);
  }

  return (
    <a href={href} className={className} onClick={onClick} {...rest}>
      {children}
    </a>
  );
}

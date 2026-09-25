'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useId, useRef, useState } from 'react';

import { isActivePath } from '@/lib/nav';

/**
 * A nav entry that is only a menu: the label is a button, not a link, and the
 * pages live in the dropdown. It opens on hover or click, and closes on
 * leaving it, on a choice, on Escape, on a click elsewhere and whenever the
 * route changes, so it never stays open over the page it just opened.
 */
export default function NavMenu({
  label,
  items,
}: {
  label: string;
  items: { href: string; label: string }[];
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  // Hover already opened it, so the click that follows keeps it open rather
  // than toggling it straight shut.
  const openedByHover = useRef(false);
  const menuId = useId();
  const current = items.some((item) => isActivePath(pathname, item.href));

  // A new page closes it, however it was reached.
  // eslint-disable-next-line react-hooks/set-state-in-effect -- sync to the route
  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (!open) return;
    const onPointer = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      setOpen(false);
      buttonRef.current?.focus();
    };
    document.addEventListener('pointerdown', onPointer);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('pointerdown', onPointer);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <div
      ref={rootRef}
      className={`nav__item has-menu${open ? ' is-open' : ''}`}
      onPointerEnter={(event) => {
        if (event.pointerType !== 'mouse') return;
        openedByHover.current = true;
        setOpen(true);
      }}
      onPointerLeave={(event) => {
        if (event.pointerType !== 'mouse') return;
        openedByHover.current = false;
        setOpen(false);
      }}
      onBlur={(event) => {
        if (!rootRef.current?.contains(event.relatedTarget as Node)) setOpen(false);
      }}
    >
      <button
        ref={buttonRef}
        type="button"
        className={`nav__trigger hdr-item${current ? ' is-current' : ''}`}
        aria-expanded={open}
        aria-controls={menuId}
        data-label={label}
        onClick={() => {
          if (openedByHover.current) {
            openedByHover.current = false;
            setOpen(true);
          } else {
            setOpen((value) => !value);
          }
        }}
      >
        {label}
        <svg className="nav__chev" viewBox="0 0 10 6" width="9" height="6" aria-hidden="true">
          <path
            d="M1 1l4 4 4-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
      <div className="nav__menu" id={menuId} hidden={!open}>
        <ul>
          {items.map((item) => {
            const here = isActivePath(pathname, item.href);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={here ? 'is-here' : undefined}
                  aria-current={here ? 'page' : undefined}
                  data-track="cta_click"
                  data-cta-location="nav"
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

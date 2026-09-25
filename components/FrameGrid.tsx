'use client';

import { useRef, useState } from 'react';

import Lightbox from '@/components/Lightbox';
import { sectors, type Frame } from '@/lib/content';

/**
 * A grid of frames, each opening the shared viewer (component I).
 *
 * The wireframe draws three captions: `line` (home and sector pages: the
 * subject, then the sector, on one line), `stack` (Work: the subject as a
 * heading, the sector under it) and `none` (the hidden page's shoot row).
 * `keep3` holds three across on a phone, as the home page and /marine/ do.
 *
 * Captions are subject and place, never a client: a client's name renders
 * only from a case study with their written approval on record (C10, C12).
 */
export default function FrameGrid({
  items,
  caption = 'line',
  ratio = '4 / 5',
  keep3 = false,
  slide = false,
}: {
  items: Frame[];
  caption?: 'line' | 'stack' | 'none';
  ratio?: string;
  keep3?: boolean;
  /** On phones, a sideways rail of tiles the size of the sector tiles. */
  slide?: boolean;
}) {
  const [index, setIndex] = useState<number | null>(null);
  const openerRef = useRef<HTMLButtonElement | null>(null);

  const sectorName = (f: Frame) => sectors.find((s) => s.slug === f.sectors[0])?.kicker ?? '';
  const meta = (f: Frame) => [f.place, sectorName(f)].filter(Boolean).join(' · ');

  return (
    <>
      <div className={`frames${keep3 ? ' frames--keep3' : ''}${slide ? ' frames--slide' : ''}`}>
        {items.map((frame, i) => (
          <figure key={frame.id} className="frame reveal">
            <button
              type="button"
              className="frame__media"
              style={{ aspectRatio: ratio }}
              aria-label={`Open ${frame.subject}`}
              onClick={(event) => {
                openerRef.current = event.currentTarget;
                setIndex(i);
              }}
            >
              <img
                src={frame.src}
                alt={frame.alt}
                width={frame.w}
                height={frame.h}
                loading="lazy"
                style={frame.pos ? { objectPosition: frame.pos } : undefined}
              />
            </button>
            {caption === 'line' ? (
              <figcaption className="frame__line">
                <b>{frame.subject}</b> · {meta(frame)}
              </figcaption>
            ) : caption === 'stack' ? (
              <figcaption>
                <span className="frame__title">{frame.subject}</span>
                <span className="frame__meta">{meta(frame)}</span>
              </figcaption>
            ) : null}
          </figure>
        ))}
      </div>

      <Lightbox
        items={items.map((f) => ({ ...f, title: f.subject, caption: meta(f) }))}
        index={index}
        restoreFocusTo={openerRef}
        onClose={() => setIndex(null)}
        onStep={(delta) =>
          setIndex((current) =>
            current === null ? current : (current + delta + items.length) % items.length,
          )
        }
      />
    </>
  );
}

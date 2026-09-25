'use client';

import { useRef, useState } from 'react';

import Lightbox from '@/components/Lightbox';
import { frames, type WorkPiece } from '@/lib/content';

/**
 * A portfolio grid in the reference's format: tall tiles, the title and place
 * laid over the foot of the photograph. Stills open the shared viewer; films
 * play in place, with sound, only when asked.
 */
export default function WorkGrid({ items, ratio }: { items: WorkPiece[]; ratio: string }) {
  const stills = items.filter((p) => !p.video);
  const films = items.filter((p) => p.video);
  const [index, setIndex] = useState<number | null>(null);
  const openerRef = useRef<HTMLButtonElement | null>(null);

  return (
    <>
      {stills.length ? (
        <div className="work-grid">
          {stills.map((piece, i) => {
            const f = frames[piece.frame];
            return (
              <button
                key={piece.id}
                type="button"
                className="work-tile reveal"
                style={{ aspectRatio: ratio }}
                aria-label={`Open ${piece.title}`}
                onClick={(event) => {
                  openerRef.current = event.currentTarget;
                  setIndex(i);
                }}
              >
                <img
                  src={f.src}
                  alt={f.alt}
                  width={f.w}
                  height={f.h}
                  loading={i < 4 ? 'eager' : 'lazy'}
                  style={'pos' in f ? { objectPosition: f.pos } : undefined}
                />
                <span className="work-tile__scrim" aria-hidden="true" />
                <span className="work-tile__text">
                  <span className="work-tile__title">{piece.title}</span>
                  {piece.meta ? <span className="work-tile__meta">{piece.meta}</span> : null}
                </span>
              </button>
            );
          })}
        </div>
      ) : null}

      {films.length ? (
        <div className="film-grid">
          {films.map((piece) => (
            <Film key={piece.id} piece={piece} />
          ))}
        </div>
      ) : null}

      <Lightbox
        items={stills.map((p) => ({ ...frames[p.frame], title: p.title, caption: p.meta }))}
        index={index}
        restoreFocusTo={openerRef}
        onClose={() => setIndex(null)}
        onStep={(delta) =>
          setIndex((current) =>
            current === null ? current : (current + delta + stills.length) % stills.length,
          )
        }
      />
    </>
  );
}

function Film({ piece }: { piece: WorkPiece }) {
  const [playing, setPlaying] = useState(false);
  const video = piece.video!;

  return (
    <figure className="film reveal">
      <div className="reel-frame">
        {playing ? (
          // Phones take the 720p cut; the browser picks the first source
          // whose media query matches.
          <video poster={video.poster} controls autoPlay playsInline preload="none">
            {video.srcSm ? <source src={video.srcSm} type="video/mp4" media="(max-width: 860px)" /> : null}
            <source src={video.src} type="video/mp4" />
          </video>
        ) : (
          <button
            type="button"
            className="reel-frame__play"
            aria-label={`Play ${piece.title}`}
            data-track="cta_click"
            data-cta-location="work_film"
            onClick={() => setPlaying(true)}
          >
            <img src={video.poster} alt="" width={1600} height={900} loading="lazy" />
            <span className="reel-frame__button" aria-hidden="true">
              &#9654;
            </span>
          </button>
        )}
      </div>
      <figcaption className="film__caption">
        <span className="work-tile__title film__title">{piece.title}</span>
        {piece.meta ? <span className="film__meta">{piece.meta}</span> : null}
      </figcaption>
    </figure>
  );
}

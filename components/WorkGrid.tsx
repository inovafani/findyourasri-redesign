'use client';

import Link from 'next/link';
import { useState } from 'react';

import type { WorkPiece } from '@/lib/content';

/**
 * A portfolio grid in the reference's format: tall tiles, the title and place
 * laid over the foot of the photograph. A tile opens its project page; films
 * play in place, with sound, only when asked.
 */
export default function WorkGrid({ items, ratio }: { items: WorkPiece[]; ratio: string }) {
  const stills = items.filter((p) => !p.video);
  const films = items.filter((p) => p.video);

  return (
    <>
      {stills.length ? (
        <div className="work-grid">
          {stills.map((piece, i) => {
            const cover = piece.cover!;
            return (
              <Link
                key={piece.id}
                href={piece.href!}
                className="work-tile reveal"
                style={{ aspectRatio: ratio }}
                aria-label={`${piece.title}: open the project`}
              >
                <img
                  src={cover.src}
                  alt={cover.alt}
                  width={cover.w}
                  height={cover.h}
                  loading={i < 4 ? 'eager' : 'lazy'}
                  style={cover.pos ? { objectPosition: cover.pos } : undefined}
                />
                <span className="work-tile__scrim" aria-hidden="true" />
                {piece.logo ? (
                  // A masked block, not an <img>, so the mark renders white
                  // over any photograph.
                  <span
                    className="work-tile__logo"
                    aria-hidden="true"
                    style={{
                      width: piece.logo.w,
                      height: piece.logo.h,
                      WebkitMaskImage: `url(${piece.logo.src})`,
                      maskImage: `url(${piece.logo.src})`,
                    }}
                  />
                ) : null}
                <span className="work-tile__text">
                  <span className="work-tile__title">{piece.title}</span>
                  {piece.meta ? <span className="work-tile__meta">{piece.meta}</span> : null}
                </span>
              </Link>
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

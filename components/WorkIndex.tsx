'use client';

import { useLayoutEffect, useMemo, useRef, useState } from 'react';

import Lightbox from '@/components/Lightbox';
import { EASE, gsap, initGsap, motionIsOff } from '@/lib/gsap';
import { projects } from '@/lib/content';

const ALL = 'All work';

/**
 * The work page proper.
 *
 * Deliberately not the homepage's rail. A rail is a taste — it shows three and
 * hides the rest behind a gesture. An index is the opposite: everything at
 * once, at size, sortable, with the client and the scope readable without
 * opening anything. The first project runs full width and the rest pair up, so
 * the page has rhythm rather than being a uniform dump.
 */
export default function WorkIndex() {
  const [filter, setFilter] = useState<string>(ALL);
  const [index, setIndex] = useState<number | null>(null);
  const openerRef = useRef<HTMLButtonElement | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  const sectors = useMemo(
    () => [ALL, ...Array.from(new Set(projects.map((p) => p.sector)))],
    [],
  );

  // The viewer steps through what is on screen, not through everything — being
  // filtered to Hospitality and arrowing into a global brand would be a bug.
  const shown = useMemo(
    () => (filter === ALL ? [...projects] : projects.filter((p) => p.sector === filter)),
    [filter],
  );

  /**
   * The entries animate themselves rather than wearing `clip-reveal` and
   * waiting on the page-wide Motion pass. That pass runs once per route, so
   * anything the filter brings in afterwards would never be animated — and a
   * `clip-path` that never opens is not merely invisible, it also swallows the
   * clicks, which is what made filtered results unopenable.
   */
  useLayoutEffect(() => {
    initGsap();
    if (motionIsOff()) return;

    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('.entry').forEach((el, i) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 22 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: EASE,
            delay: (i % 2) * 0.08,
            scrollTrigger: { trigger: el, start: 'top 93%', once: true },
          },
        );
      });
    }, gridRef);

    return () => ctx.revert();
  }, [filter]);

  return (
    <>
      <div className="filters" role="tablist" aria-label="Filter work by sector">
        {sectors.map((s) => (
          <button
            key={s}
            type="button"
            role="tab"
            aria-selected={filter === s}
            className={`filter${filter === s ? ' is-on' : ''}`}
            onClick={() => {
              setFilter(s);
              setIndex(null);
            }}
          >
            {s}
            <span className="filter__n">
              {s === ALL ? projects.length : projects.filter((p) => p.sector === s).length}
            </span>
          </button>
        ))}
      </div>

      <div className="index" ref={gridRef}>
        {shown.map((project, i) => (
          <article
            key={project.src}
            className={`entry${i === 0 ? ' entry--lead' : ''}`}
          >
            <button
              type="button"
              className="entry__media"
              aria-label={`Open ${project.client}: ${project.alt}`}
              onClick={(event) => {
                openerRef.current = event.currentTarget;
                setIndex(i);
              }}
            >
              <img
                src={project.src}
                alt={project.alt}
                width={project.w}
                height={project.h}
                loading={i < 3 ? 'eager' : 'lazy'}
              />
            </button>

            <div className="entry__meta">
              <span
                className="entry__logo"
                aria-hidden="true"
                style={{
                  width: project.logoW,
                  height: project.logoH,
                  WebkitMaskImage: `url(${project.logo})`,
                  maskImage: `url(${project.logo})`,
                }}
              />
              <h2 className="entry__client">{project.client}</h2>
              <p className="entry__services">{project.services}</p>
              <p className="entry__sector">{project.sector}</p>
            </div>
          </article>
        ))}
      </div>

      <Lightbox
        items={shown}
        index={index}
        restoreFocusTo={openerRef}
        onClose={() => setIndex(null)}
        onStep={(delta) =>
          setIndex((current) =>
            current === null ? current : (current + delta + shown.length) % shown.length,
          )
        }
      />
    </>
  );
}

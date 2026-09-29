import Link from 'next/link';

import ArrowButton from '@/components/ArrowButton';
import { frames, getSector, type FrameId } from '@/lib/content';

/**
 * Home: four tiles, each one link to its sector page: the frame, then the
 * name and who it covers, with a round arrow button beside them. The numbers each is measured on
 * live on the sector pages. Hidden pages such as /marine/ never appear here.
 */
export default function SectorTiles() {
  const order = ['hospitality', 'operators', 'brands', 'destinations'] as const;

  return (
    <section className="section" data-section-view="sectors">
      <div className="stack stack--head stack--head-center">
        <h2 className="sec-title line-mask">Your Experts on Everything Travel and Hospitality</h2>
        <p className="markets reveal">Working globally with brands in 100+ countries.</p>
      </div>

      <div className="tiles">
        {order.map((slug) => {
          const s = getSector(slug);
          const f = frames[s.frame as FrameId];
          return (
            <Link key={s.slug} href={`/sectors/${s.slug}/`} className="tile reveal">
              <span className="tile__media">
                <img
                  src={f.src}
                  alt=""
                  width={f.w}
                  height={f.h}
                  loading="lazy"
                  style={'pos' in f ? { objectPosition: f.pos } : undefined}
                />
              </span>
              <span className="tile__meta">
                <span className="tile__text">
                  <span className="tile__name">{s.name}</span>
                  <span className="tile__covers">{s.covers}</span>
                </span>
                <ArrowButton />
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

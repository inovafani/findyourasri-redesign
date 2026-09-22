import Link from 'next/link';

import SectionHead from '@/components/SectionHead';
import { sectors } from '@/lib/content';

/**
 * The homepage's take on the sectors: four photographs with a name on them.
 *
 * The full rows — body copy, the proof line, the alternating layout — live on
 * /sectors. Showing both would be the same content twice, and the homepage's
 * job here is to make you want the page, not to be it.
 */
export default function SectorTiles({ num }: { num?: string }) {
  return (
    <section className="section">
      <SectionHead
        num={num}
        label="Who we work with"
        title="Four Kinds of Client, One Way of Working"
        lede="Destinations, hospitality, global brands and experience operators. Same crew, same system, four different problems."
      />

      <div className="tiles">
        {sectors.map((s) => (
          <Link key={s.kicker} href="/sectors" className="tile clip-reveal">
            <img
              className="parallax-media"
              src={s.img}
              alt={s.alt}
              width={s.w}
              height={s.h}
              loading="lazy"
              style={'tilePos' in s ? { objectPosition: s.tilePos } : undefined}
            />
            <span className="tile__body">
              <span className="tile__name">{s.kicker}</span>
            </span>
          </Link>
        ))}
      </div>

      <p className="section__more">
        <Link href="/sectors" className="pill pill--outline magnetic">
          How we work with each
          <span className="pill__arrow" aria-hidden="true">
            &#8599;
          </span>
        </Link>
      </p>
    </section>
  );
}

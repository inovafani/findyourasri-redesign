import type { Frame } from '@/lib/content';

/**
 * What a sector asks to be measured on: one white card, the heading with its
 * lede under it and the numbers ticked off the way the package cards on
 * /services/ tick theirs, beside a frame from the sector's own archive.
 * Left out where nothing is on record (W7).
 */
export default function Measured({ items, frame }: { items?: readonly string[]; frame?: Frame }) {
  if (!items?.length) return null;

  return (
    <section className="section">
      <div className={`measured${frame ? '' : ' measured--solo'}`}>
        <div className="measured__body">
          <div className="stack">
            <h2 className="sec-title line-mask">What We Ask to Be Measured On</h2>
            <p className="text reveal">We agree your numbers in month one and report monthly.</p>
          </div>
          <ul className="ticks ticks--lg">
            {items.map((item) => (
              <li key={item} className="reveal">
                {item}
              </li>
            ))}
          </ul>
        </div>
        {frame ? (
          <div className="measured__media clip-reveal">
            <img
              src={frame.src}
              alt={frame.alt}
              width={frame.w}
              height={frame.h}
              loading="lazy"
              style={frame.pos ? { objectPosition: frame.pos } : undefined}
            />
          </div>
        ) : null}
      </div>
    </section>
  );
}

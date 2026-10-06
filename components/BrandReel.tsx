import type { CSSProperties } from "react";

import { brands } from "@/lib/content";

/**
 * The name, then the wall, as the proposals and decks set them: the
 * dictionary line Asri is named for, then the brands our team has worked
 * with in a hairline grid.
 *
 * The wall is still, not a loop: a wall reads at a glance, a reel makes the
 * reader wait for the logo they came for. Twelve cells, the label in the
 * first, so the grid closes as a rectangle at every width (6 x 2, 4 x 3,
 * 3 x 4). BluePass is off it, as it is off every proposal wall (24 Sep:
 * not named in client-facing material).
 */
export default function BrandReel() {
  return (
    <section className="reel" aria-labelledby="reel-title">
      <div className="defn">
        <h2 id="reel-title" className="defn__line reveal">
          <span className="defn__word">Asri</span>
          <span className="defn__pos">adj. &middot; Bahasa Indonesia</span>
        </h2>
        <span className="defn__rule rule-draw" aria-hidden="true" />
        <p className="defn__meaning reveal">
          &#8220;A unique type of natural beauty that inspires creativity&#8221;
        </p>
      </div>

      <ul className="wall" aria-label="Brands our team has worked with">
        <li className="wall__label reveal" aria-hidden="true">
          <span className="kick">Our team has worked with</span>
          <span className="wall__rule" />
        </li>
        {brands.map((b) => (
          <li key={b.alt} className="wall__cell reveal">
            <img
              src={b.src}
              alt={b.alt}
              width={b.w}
              height={b.h}
              style={{ "--h": `${b.size}px` } as CSSProperties}
              loading="lazy"
              decoding="async"
            />
          </li>
        ))}
      </ul>
    </section>
  );
}

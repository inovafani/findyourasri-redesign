import Gallery from '@/components/Gallery';

/** 05 · the archive. Twelve frames, each wiping open, each opening a viewer. */
export default function Work() {
  return (
    <section id="work" className="section section--anchor">
      <div className="sec-head">
        <div>
          <div className="eyebrow">
            <span className="eyebrow__num reveal">[05]</span>
            <span className="eyebrow__label reveal">The archive</span>
          </div>
          <h2 className="sec-head__title line-mask">
            A Ten-Year Archive of Indonesia&#8217;s Rarest Locations
          </h2>
        </div>
        <p className="sec-head__lede reveal">
          Three hundred islands worked on the ground, not scouted from a deck. Everything here was
          shot by the same crew that would shoot yours.
        </p>
      </div>

      <Gallery />
    </section>
  );
}

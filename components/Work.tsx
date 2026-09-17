import WorkRail from '@/components/WorkRail';

/** 03 · featured work. A rail of project cards, each opening a viewer. */
export default function Work() {
  return (
    <section id="work" className="section section--anchor">
      <div className="sec-head">
        <div>
          <div className="eyebrow">
            <span className="eyebrow__num reveal">[03]</span>
            <span className="eyebrow__label reveal">Featured work</span>
          </div>
          <h2 className="sec-head__title line-mask">
            A Ten-Year Archive of the Hardest Locations to Reach
          </h2>
        </div>
        <p className="sec-head__lede reveal">
          Three hundred locations worked on the ground, not scouted from a deck. Everything here was
          shot by the same crew that would shoot yours.
        </p>
      </div>

      <WorkRail />
    </section>
  );
}

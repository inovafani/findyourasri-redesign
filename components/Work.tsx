import SectionHead from '@/components/SectionHead';
import WorkRail from '@/components/WorkRail';

/** 03 · featured work. A rail of project cards, each opening a viewer. */
export default function Work({ num, heading }: { num?: string; heading?: 'h1' | 'h2' }) {
  return (
    <section id="work" className="section section--anchor">
      <SectionHead
        num={num}
        heading={heading}
        label="Featured work"
        title="A Ten-Year Archive of the Hardest Locations to Reach"
        lede="Three hundred locations worked on the ground, not scouted from a deck. Everything here was shot by the same crew that would shoot yours."
      />
      <WorkRail />
    </section>
  );
}

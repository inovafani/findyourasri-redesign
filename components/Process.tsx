import SectionHead from '@/components/SectionHead';
import { steps } from '@/lib/content';

/** 06 · how we work. Each step's rail draws itself before the card arrives. */
export default function Process({ num, heading }: { num?: string; heading?: 'h1' | 'h2' }) {
  return (
    <section id="process" className="section section--anchor">
      <SectionHead
        num={num}
        heading={heading}
        label="How we work"
        title="Build. Launch. Learn. Scale."
        lede="Every cycle ends where the next one starts: data, then learnings, then the next ninety days."
      />

      <ol className="steps">
        {steps.map((step, i) => (
          <li key={step.title} className="step">
            <div className="step__rail">
              <span className="step__dot dot-pop" aria-hidden="true" />
              <span className="step__line rule-draw" />
              <span className="step__when reveal">{step.when}</span>
            </div>
            <div className="card step__card reveal">
              <div className="step__head">
                <h3 className="step__title">{step.title}</h3>
                <p className="step__n">{String(i + 1).padStart(2, '0')}</p>
              </div>
              <p className="step__body">{step.body}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}

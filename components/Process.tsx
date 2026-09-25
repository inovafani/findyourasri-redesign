import PageHead from '@/components/PageHead';
import { steps } from '@/lib/content';

/** How a partnership runs: three months, one cycle. Each step's rail draws itself before the card arrives. */
export default function Process() {
  return (
    <section id="process" className="section section--anchor">
      <PageHead
        heading="h2"
        title="The First Ninety Days"
        lede="Every cycle ends where the next one starts: data, then what it taught us, then the next ninety days."
      />

      <ol className="steps">
        {steps.map((step) => (
          <li key={step.title} className="step">
            <div className="step__rail">
              <span className="step__dot dot-pop" aria-hidden="true" />
              <span className="step__line rule-draw" />
              <span className="step__when reveal">{step.when}</span>
            </div>
            <div className="card step__card reveal">
              <h3 className="step__title">{step.title}</h3>
              <p className="step__body">{step.body}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}

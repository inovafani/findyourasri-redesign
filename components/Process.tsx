import { steps } from '@/lib/content';

/** 06 · how we work. Each step's rail draws itself before the card arrives. */
export default function Process() {
  return (
    <section id="process" className="section section--anchor">
      <div className="sec-head">
        <div>
          <div className="eyebrow">
            <span className="eyebrow__num reveal">[06]</span>
            <span className="eyebrow__label reveal">How we work</span>
          </div>
          <h2 className="sec-head__title line-mask">Build. Launch. Learn. Scale.</h2>
        </div>
        <p className="sec-head__lede reveal">
          Every cycle ends where the next one starts: data, then learnings, then the next ninety
          days.
        </p>
      </div>

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

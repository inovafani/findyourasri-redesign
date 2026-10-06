import PageHead from "@/components/PageHead";
import { frames, steps, type Frame } from "@/lib/content";

/**
 * How a partnership runs: three months, one cycle. Each month carries a
 * frame across its top, as the proposals' plan page does; the rail draws
 * itself before the card arrives.
 */
export default function Process() {
  return (
    <section id="process" className="section section--anchor">
      <PageHead
        heading="h2"
        title="The First Ninety Days"
        lede="Every 90 days, we evaluate and adjust. Our team stays on top of marketing trends and strategy developments"
      />

      <ol className="steps">
        {steps.map((step) => {
          const f = step.frame ? (frames[step.frame] as Frame) : null;
          return (
            <li key={step.title} className="step">
              <div className="step__rail">
                <span className="step__dot dot-pop" aria-hidden="true" />
                <span className="step__line rule-draw" />
                <span className="step__when reveal">{step.when}</span>
              </div>
              <div className="card step__card reveal">
                {f ? (
                  <figure className="step__top">
                    <img
                      src={f.src}
                      alt={f.alt}
                      width={f.w}
                      height={f.h}
                      loading="lazy"
                      style={f.pos ? { objectPosition: f.pos } : undefined}
                    />
                  </figure>
                ) : null}
                <h3 className="step__title">{step.title}</h3>
                <p className="step__body">{step.body}</p>
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}

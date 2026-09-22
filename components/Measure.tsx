import { measures } from '@/lib/content';

/** 07 · accountability. The two lists of numbers the work is judged on. */
export default function Measure({ num }: { num?: string }) {
  return (
    <section className="section">
      <div className="measure">
        <div>
          <div className="eyebrow">
            {num ? <span className="eyebrow__num reveal">{num}</span> : null}
            <span className="eyebrow__label reveal">Accountability</span>
          </div>
          <h2 className="measure__title line-mask">What We Ask to Be Measured On</h2>
          <p className="measure__lede reveal">
            Beautiful work that does not sell anything is a hobby. From month one we agree the
            commercial numbers that matter to you, and we report against them every month, in plain
            language.
          </p>
        </div>

        <div className="measure__cols">
          {measures.map((column, i) => (
            <ul key={i} className="measure__list">
              {column.map((item) => (
                <li key={item} className="reveal">
                  {item}
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>
    </section>
  );
}

import SectionHead from '@/components/SectionHead';
import { sectors } from '@/lib/content';

/** 03 · who we work with. Four alternating rows, each with its own slow parallax. */
export default function Sectors({ num, heading }: { num?: string; heading?: 'h1' | 'h2' }) {
  return (
    <section id="sectors" className="section section--anchor">
      <SectionHead
        num={num}
        heading={heading}
        label="Who we work with"
        title="Four Kinds of Client, One Way of Working"
        lede="Destinations, hospitality, global brands and experience operators. Same crew, same system, four different problems."
      />

      <div className="sectors__list">
        {sectors.map((s) => (
          <article key={s.kicker} className={`sector${s.flip ? ' sector--flip' : ''}`}>
            <div className="sector__media clip-reveal">
              <img
                className="parallax-media"
                src={s.img}
                alt={s.alt}
                width={s.w}
                height={s.h}
                loading="lazy"
                style={'pos' in s ? { objectPosition: s.pos } : undefined}
              />
            </div>
            <div className="sector__body">
              <p className="sector__kicker reveal">{s.kicker}</p>
              <h3 className="sector__title reveal">{s.title}</h3>
              <p className="sector__body-text reveal">{s.body}</p>
              <p className="sector__proof reveal">{s.proof}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

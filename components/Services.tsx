import { services, stages } from '@/lib/content';

/**
 * Hidden on request, not deleted — flip to `true` to bring the
 * "[ HOW WE SHOOT ]" panel back exactly as it was. Its markup below and its
 * `.production*` styles in globals.css are both left untouched.
 */
const SHOW_HOW_WE_SHOOT = false;

/** 04 · what we do. The stage chips, the four service cards, the production note. */
export default function Services() {
  return (
    <section id="services" className="section section--anchor">
      <div className="sec-head">
        <div>
          <div className="eyebrow">
            <span className="eyebrow__num reveal">[04]</span>
            <span className="eyebrow__label reveal">What we do</span>
          </div>
          <h2 className="sec-head__title line-mask">Four Services, One Growth System</h2>
        </div>
        <p className="sec-head__lede reveal">
          We do not simply fill a content calendar. We connect creative, search, paid media and data
          into one growth system.
        </p>
      </div>

      <ol className="stages">
        {stages.map((label, i) => (
          <li key={label} className={`stage reveal${i === stages.length - 1 ? ' stage--on' : ''}`}>
            <span className="stage__n">{String(i + 1).padStart(2, '0')}</span>
            <span className="stage__label">{label}</span>
          </li>
        ))}
      </ol>

      <div className="services__grid">
        {services.map((s, i) => (
          <article key={s.name} className="card service reveal">
            <div className="service__head">
              <p className="service__name">{s.name}</p>
              <p className="service__n">{String(i + 1).padStart(2, '0')}</p>
            </div>
            <h3 className="service__claim">{s.claim}</h3>
            <p className="service__body">{s.body}</p>
            <ul className="service__list">
              {s.points.map((point) => (
                <li key={point}>
                  <span aria-hidden="true">&#10003;</span>
                  {point}
                </li>
              ))}
            </ul>
            <p className="service__terms">{s.terms}</p>
          </article>
        ))}
      </div>

      {SHOW_HOW_WE_SHOOT && (
        <div className="production">
          <div className="reveal">
            <p className="kicker" style={{ color: 'rgba(255,255,255,.62)' }}>
              [ HOW WE SHOOT ]
            </p>
            <p className="production__title">Full crew. Permits. Finishing.</p>
          </div>
          <p className="production__body reveal">
            Full in-house crew: direction, camera, drone, underwater, edit. Permits, fixers, boats
            and remote logistics handled by us.
          </p>
          <p className="production__body reveal">
            Colour, sound and finishing to broadcast standard. Every asset cut to platform-native
            ratios, not cropped as an afterthought.
          </p>
        </div>
      )}
    </section>
  );
}

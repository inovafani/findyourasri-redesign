import Link from 'next/link';

import SectionHead from '@/components/SectionHead';
import { services, stages } from '@/lib/content';

/**
 * The homepage's take on the services: the growth stages, then the four names
 * and what each one promises. The checklists — the part people read once they
 * are already interested — are on /services.
 */
export default function ServicesBrief({ num }: { num?: string }) {
  return (
    <section className="section">
      <SectionHead
        num={num}
        label="What we do"
        title="Four Services, One Growth System"
        lede="We do not simply fill a content calendar. We connect creative, search, paid media and data into one growth system."
      />

      <ol className="stages">
        {stages.map((label, i) => (
          <li key={label} className={`stage reveal${i === stages.length - 1 ? ' stage--on' : ''}`}>
            <span className="stage__n">{String(i + 1).padStart(2, '0')}</span>
            <span className="stage__label">{label}</span>
          </li>
        ))}
      </ol>

      <div className="brief">
        {services.map((s, i) => (
          <Link key={s.name} href="/services" className="brief__item reveal">
            <span className="brief__n">{String(i + 1).padStart(2, '0')}</span>
            <span className="brief__text">
              <span className="brief__name">{s.name}</span>
              <span className="brief__claim">{s.claim}</span>
            </span>
            <span className="brief__arrow" aria-hidden="true">
              &#8599;
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}

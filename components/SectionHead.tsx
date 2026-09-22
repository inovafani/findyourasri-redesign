import type { ReactNode } from 'react';

/**
 * The heading block every section and page opens with.
 *
 * `num` is the running [01]…[0n] counter. It is the homepage's narrative
 * device — it says "you are this far through the argument" — so subpages leave
 * it off: "[03]" at the top of /work would be a third of nothing.
 */
export default function SectionHead({
  num,
  label,
  title,
  lede,
  heading = 'h2',
}: {
  num?: string;
  label: string;
  title: ReactNode;
  lede: ReactNode;
  heading?: 'h1' | 'h2';
}) {
  const Title = heading;

  return (
    <div className="sec-head">
      <div>
        <div className="eyebrow">
          {num ? <span className="eyebrow__num reveal">{num}</span> : null}
          <span className="eyebrow__label reveal">{label}</span>
        </div>
        <Title className="sec-head__title line-mask">{title}</Title>
      </div>
      <p className="sec-head__lede reveal">{lede}</p>
    </div>
  );
}

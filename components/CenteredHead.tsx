import type { ReactNode } from 'react';

import Contours, { type PatternName } from '@/components/Contours';

/** A page opening in one centred stack over its own faint chart motif. */
export default function CenteredHead({
  title,
  lede,
  pattern,
  children,
}: {
  title: ReactNode;
  lede?: ReactNode;
  pattern: PatternName;
  children?: ReactNode;
}) {
  return (
    <div className="stack stack--head about-head">
      <Contours name={pattern} />
      <h1 className="page-title line-mask">{title}</h1>
      {lede ? <p className="text reveal">{lede}</p> : null}
      {children}
    </div>
  );
}

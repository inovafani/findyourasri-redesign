import type { ReactNode } from 'react';

/**
 * A heading block: the title with its lede always underneath it, never
 * beside it. An `aside` (an action such as "See the work") may sit on the
 * right, on the title's baseline.
 */
export default function PageHead({
  title,
  lede,
  aside,
  heading = 'h1',
}: {
  title: ReactNode;
  lede?: ReactNode;
  aside?: ReactNode;
  heading?: 'h1' | 'h2';
}) {
  const Title = heading;
  return (
    <div className="head2">
      <div className="head2__main">
        <Title className={`${heading === 'h1' ? 'page-title' : 'sec-title'} line-mask`}>{title}</Title>
        {lede ? <p className="text reveal">{lede}</p> : null}
      </div>
      {aside ? <div className="head2__aside">{aside}</div> : null}
    </div>
  );
}

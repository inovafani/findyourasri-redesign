import { Fragment } from 'react';

import { marketPlaces, marketsLead } from '@/lib/content';

/**
 * The six markets, two-tone: the places carry the weight and the words
 * between them step back, so the line reads as reach rather than as a caption.
 */
export default function Markets({ className = 'markets' }: { className?: string }) {
  return (
    <p className={`${className} reveal`}>
      {marketsLead}{' '}
      {marketPlaces.map((place, i) => (
        <Fragment key={place}>
          <b>{place}</b>
          {i < marketPlaces.length - 2 ? ', ' : i === marketPlaces.length - 2 ? ' and ' : '.'}
        </Fragment>
      ))}
    </p>
  );
}

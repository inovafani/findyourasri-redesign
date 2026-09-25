import Link from 'next/link';

import ArrowButton from '@/components/ArrowButton';
import { getService, type ServiceSlug } from '@/lib/content';

/**
 * Service cards that link to their pages: the service's name with the round
 * arrow mark, its line, and the terms where asked for. Four across on sector and hidden
 * pages; `auto` fills the row on /services/. A card for a service that is not
 * live yet (W2) is left out rather than linking nowhere.
 */
export default function ServiceCards({
  items,
  showTerms,
  auto,
}: {
  items: { slug: ServiceSlug; line?: string }[];
  showTerms?: boolean;
  auto?: boolean;
}) {
  const live = items.map((x) => ({ ...x, service: getService(x.slug) })).filter((x) => x.service.live);

  return (
    // Up to four across; fewer when W2 holds a card back, so the row still fills.
    <div
      className={`cards${auto ? ' cards--auto' : ''}`}
      style={auto ? undefined : ({ '--cols': Math.min(live.length, 4) } as React.CSSProperties)}
    >
      {live.map(({ slug, line, service }) => (
        <Link key={slug} href={`/services/${slug}/`} className="card svc reveal">
          <span className="svc__head">
            <span className="svc__name">{service.name}</span>
            <ArrowButton />
          </span>
          <span className="svc__line">{line ?? service.claim}</span>
          {showTerms ? <span className="svc__terms">{service.terms}</span> : null}
        </Link>
      ))}
    </div>
  );
}

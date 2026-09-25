import Link from 'next/link';

import JsonLd from '@/components/JsonLd';
import { site } from '@/lib/site';

export type Crumb = { href: string; label: string };

/**
 * Shared component H. Every page below the home page opens with it; the last
 * item is the current page and is not a link. The BreadcrumbList carries the
 * same items.
 */
export default function Breadcrumbs({ items }: { items: Crumb[] }) {
  const trail = [{ href: '/', label: 'Home' }, ...items];

  return (
    <>
      <nav className="crumbs" aria-label="Breadcrumb">
        <ol>
          {trail.map((crumb, i) => (
            <li key={crumb.href}>
              {i < trail.length - 1 ? (
                <Link href={crumb.href}>{crumb.label}</Link>
              ) : (
                <span aria-current="page">{crumb.label}</span>
              )}
            </li>
          ))}
        </ol>
      </nav>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: trail.map((crumb, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            name: crumb.label,
            item: `${site.url}${crumb.href}`,
          })),
        }}
      />
    </>
  );
}

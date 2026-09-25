import Link from 'next/link';

import Breadcrumbs from '@/components/Breadcrumbs';
import Contours from '@/components/Contours';
import CtaLine from '@/components/CtaLine';
import JsonLd from '@/components/JsonLd';
import WorkGrid from '@/components/WorkGrid';
import WorkTabs from '@/components/WorkTabs';
import {
  getWorkCategory,
  workCategories,
  workFor,
  type WorkCategorySlug,
  type WorkTabSlug,
} from '@/lib/content';
import { site } from '@/lib/site';

export function categoryHref(slug: WorkCategorySlug, tab?: WorkTabSlug) {
  const category = getWorkCategory(slug);
  const first = category.tabs?.[0]?.slug;
  return !tab || tab === first ? `/work/${slug}/` : `/work/${slug}/${tab}/`;
}

/**
 * One Work category: the title, the switch between categories, the category's
 * own tabs where it has them, then the grid.
 */
export default function WorkCategoryView({
  slug,
  tab,
}: {
  slug: WorkCategorySlug;
  tab?: WorkTabSlug;
}) {
  const category = getWorkCategory(slug);
  const activeTab = tab ?? category.tabs?.[0]?.slug;
  const tabLabel = category.tabs?.find((t) => t.slug === activeTab)?.label;
  const here = categoryHref(slug, activeTab);

  const crumbs = [
    { href: '/work/', label: 'Work' },
    { href: `/work/${slug}/`, label: category.name },
    ...(tab && tab !== category.tabs?.[0]?.slug ? [{ href: here, label: tabLabel! }] : []),
  ];

  return (
    <>
      <Breadcrumbs items={crumbs} />
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          name: `${category.name}${tabLabel ? `: ${tabLabel}` : ''} | Asri`,
          url: `${site.url}${here}`,
          isPartOf: { '@id': `${site.url}/#website` },
        }}
      />

      <section className="section section--first">
        <div className="work-head about-head">
          <Contours name={category.pattern} />
          <h1 className="page-title line-mask">{category.name}</h1>
          <p className="text reveal">{category.line}</p>
          <nav className="work-switch" aria-label="Work categories">
            {workCategories.map((c) => (
              <Link
                key={c.slug}
                href={`/work/${c.slug}/`}
                className={`chip${c.slug === slug ? ' is-on' : ''}`}
                aria-current={c.slug === slug ? 'page' : undefined}
              >
                {c.name}
              </Link>
            ))}
          </nav>
        </div>

        {category.tabs ? (
          <WorkTabs
            current={here}
            tabs={category.tabs.map((t) => ({ href: categoryHref(slug, t.slug), label: t.label }))}
          />
        ) : null}

        <WorkGrid items={workFor(slug, category.tabs ? activeTab : undefined)} ratio={category.ratio} />
      </section>

      <CtaLine location="work_page" />
    </>
  );
}

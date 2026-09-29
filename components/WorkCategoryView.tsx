import Link from 'next/link';
import { notFound } from 'next/navigation';

import Breadcrumbs from '@/components/Breadcrumbs';
import Contours from '@/components/Contours';
import CtaLine from '@/components/CtaLine';
import JsonLd from '@/components/JsonLd';
import SmoothLink from '@/components/SmoothLink';
import WorkGrid from '@/components/WorkGrid';
import WorkTabs from '@/components/WorkTabs';
import {
  getWorkCategory,
  liveWorkCategories,
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
 * own tabs where it has them, then the grid, then the rest of its story where
 * it has one.
 */
export default function WorkCategoryView({
  slug,
  tab,
}: {
  slug: WorkCategorySlug;
  tab?: WorkTabSlug;
}) {
  const category = getWorkCategory(slug);
  // Off until its work exists: the route stays built but answers 404.
  if (!liveWorkCategories.includes(category)) notFound();
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
          <h1 className="page-title line-mask">{category.title ?? category.name}</h1>
          {category.story ? (
            <p className="text work-head__story reveal">
              {category.story.lead}{' '}
              <SmoothLink href="#story" className="text-link">
                Read more
              </SmoothLink>
            </p>
          ) : (
            <p className="text reveal">{category.line}</p>
          )}
          {liveWorkCategories.length > 1 ? (
          <nav className="work-switch" aria-label="Work categories">
            {liveWorkCategories.map((c) => (
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
          ) : null}
        </div>

        {category.tabs ? (
          <WorkTabs
            current={here}
            tabs={category.tabs.map((t) => ({ href: categoryHref(slug, t.slug), label: t.label }))}
          />
        ) : null}

        <WorkGrid items={workFor(slug, category.tabs ? activeTab : undefined)} ratio={category.ratio} />
      </section>

      {category.story ? (
        <section id="story" className="section section--anchor">
          <div className="stack stack--prose about-story">
            {category.story.paragraphs.map((p) => (
              <p key={p} className="text reveal">
                {p}
              </p>
            ))}
          </div>
        </section>
      ) : null}

      <CtaLine location="work_page" />
    </>
  );
}

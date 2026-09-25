import Link from 'next/link';

/**
 * The tabs inside a Work category, centred above the grid as in the
 * reference. Each is its own URL, so a tab can be linked to directly.
 */
export default function WorkTabs({
  tabs,
  current,
}: {
  tabs: { href: string; label: string }[];
  current: string;
}) {
  return (
    <nav className="work-tabs" aria-label="Work">
      {tabs.map((tab) => {
        const on = tab.href === current;
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={`work-tabs__tab${on ? ' is-on' : ''}`}
            aria-current={on ? 'page' : undefined}
            scroll={false}
          >
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}

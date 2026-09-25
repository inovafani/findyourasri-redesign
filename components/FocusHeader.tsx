import Link from 'next/link';

import SmoothLink from '@/components/SmoothLink';

/**
 * Shared component A, focused variant, for hidden pages: the logo, linking
 * home, and one call to action that scrolls to the form. No nav and no sheet:
 * the page goes to one reader with one job.
 */
export default function FocusHeader({ location = 'vertical_page' }: { location?: string }) {
  return (
    <header className="header header--focus">
      <div className="header__row">
        <Link href="/" className="header__logo hdr-item" aria-label="Asri, home">
          <img src="/img/asri-white.png" alt="Asri" width={1171} height={320} />
        </Link>
        <SmoothLink
          href="#start"
          className="pill pill--ink pill--sm hdr-item magnetic"
          data-track="cta_click"
          data-cta-location={location}
        >
          Start a conversation
          <span className="pill__arrow" aria-hidden="true">
            &#8599;
          </span>
        </SmoothLink>
      </div>
    </header>
  );
}

import SmoothLink from '@/components/SmoothLink';
import { site } from '@/lib/site';

/**
 * The site-day button. With a scheduler link (A11) it opens the scheduler and
 * fires booking_start; until then it scrolls to the form on the same page.
 */
export default function BookSiteDay() {
  const label = (
    <>
      Book a site day
      <span className="pill__arrow" aria-hidden="true">
        &#8599;
      </span>
    </>
  );

  if (site.bookingUrl) {
    return (
      <a
        href={site.bookingUrl}
        target="_blank"
        rel="noopener"
        className="pill pill--ink magnetic"
        data-track="booking_start"
        data-link-location="contact"
      >
        {label}
      </a>
    );
  }

  return (
    <SmoothLink href="#form" className="pill pill--ink magnetic" data-track="cta_click" data-cta-location="site_day">
      {label}
    </SmoothLink>
  );
}

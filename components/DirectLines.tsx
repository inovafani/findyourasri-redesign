import { mailto, site } from '@/lib/site';

/**
 * Email, WhatsApp once W4 gives a number, and the phone, one per ruled row.
 * `extra` appends rows such as the hours and the base. Clicks are tracked by
 * Tracking.tsx.
 */
export default function DirectLines({
  location,
  extra = [],
}: {
  location: string;
  extra?: { label: string; value: string }[];
}) {
  return (
    <dl className="lines" data-link-location={location}>
      <div>
        <dt>Email</dt>
        <dd>
          <a href={mailto}>{site.email}</a>
        </dd>
      </div>
      {site.whatsapp && (
        <div>
          <dt>WhatsApp</dt>
          <dd>
            <a
              href={`https://wa.me/${site.whatsapp}?text=${encodeURIComponent('Hello Asri, I found you on findyourasri.com.')}`}
            >
              +{site.whatsapp}
            </a>
          </dd>
        </div>
      )}
      <div>
        <dt>Phone</dt>
        <dd>
          <a href={`tel:${site.phoneHref}`} data-phone-country={site.phoneCountry}>
            {site.phone}
          </a>
        </dd>
      </div>
      {extra.map((row) => (
        <div key={row.label}>
          <dt>{row.label}</dt>
          <dd>{row.value}</dd>
        </div>
      ))}
    </dl>
  );
}

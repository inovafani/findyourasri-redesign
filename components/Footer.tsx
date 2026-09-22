import Link from 'next/link';
import ToTop from '@/components/ToTop';
import { navLinks, services } from '@/lib/content';
import { site } from '@/lib/site';

/** The closing slab. The wordmark rises out of its own mask as the slab arrives. */
export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__top">
        <Link href="/" className="footer__mark" aria-label="Asri, home">
          <img
            className="mark-rise"
            src="/img/asri-white.png"
            alt="Asri"
            width={1171}
            height={320}
            loading="lazy"
          />
          <sup className="reveal">&#174;</sup>
        </Link>

        <div className="footer__year">
          <p className="reveal">&#169; 20&#8202;&#8211;&#8202;26&#176;</p>
          <span className="footer__rule rule-draw" />
        </div>
      </div>

      <div className="footer__cols">
        <div>
          <p className="footer__blurb reveal">
            Marketing &amp; production for destinations, hospitality groups and global brands.
          </p>
          <a href={`mailto:${site.email}`} className="footer__email reveal">
            {site.email}
          </a>
        </div>

        <div>
          <p className="footer__label reveal">Navigation</p>
          <ul className="footer__list">
            {[...navLinks, { href: '/contact', label: 'Contact' }].map((link) => (
              <li key={link.href} className="reveal">
                <Link href={link.href}>{link.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="footer__label reveal">Services</p>
          <ul className="footer__list">
            {services.map((s) => (
              <li key={s.name} className="reveal">
                <Link href="/services">{s.name}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="footer__label reveal">Contact</p>
          <ul className="footer__list">
            <li className="reveal">
              <a href={`tel:${site.phoneHref}`}>{site.phone}</a>
            </li>
            <li className="reveal">Bali, Indonesia</li>
            <li className="reveal">Mon &#8211; Fri &#183; 09.00 &#8211; 17.00 GMT+8</li>
          </ul>
        </div>
      </div>

      <div className="footer__bar">
        <p className="footer__fine reveal">
          &#169; 2026 Asri. All photography shot by Asri.
        </p>
        <div className="footer__sign">
          <ToTop />
        </div>
      </div>
    </footer>
  );
}

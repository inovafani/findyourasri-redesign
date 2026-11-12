import type { Metadata, Viewport } from 'next';
import { Bodoni_Moda, Nunito_Sans, Oswald } from 'next/font/google';

import Motion from '@/components/Motion';
import NavGuard from '@/components/NavGuard';
import Tracking from '@/components/Tracking';
import { site } from '@/lib/site';

import './globals.css';
import './brand.css';

/**
 * The type of the proposals and decks: a Didone display, Avenir Next for
 * text, and Avenir Next Condensed for the occasional tall caps line.
 *
 * Apple devices have Didot and Avenir Next built in and render the site
 * exactly as the proposals print. Everyone else gets the open fallbacks the
 * proposal engine itself names (new-business/proposals/_engine/asri-a4.css):
 * Bodoni Moda, Nunito Sans and Oswald, self-hosted here. They are not
 * preloaded, so a Mac never downloads a face it will not use; the stacks
 * live in app/brand.css.
 */
const display = Bodoni_Moda({
  subsets: ['latin'],
  style: ['normal', 'italic'],
  axes: ['opsz'],
  variable: '--font-bodoni',
  display: 'swap',
  preload: false,
});

const text = Nunito_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-nunito',
  display: 'swap',
  preload: false,
});

const condensed = Oswald({
  subsets: ['latin'],
  weight: ['200', '300'],
  variable: '--font-oswald',
  display: 'swap',
  preload: false,
});

/** Defaults only. Every page sets its own title, description and canonical via pageMetadata(). */
export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: site.title,
  description: site.description,
  icons: {
    icon: [
      { url: '/img/favicon-32.png', sizes: '32x32', type: 'image/png' },
      { url: '/img/favicon-48.png', sizes: '48x48', type: 'image/png' },
      { url: '/img/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: '/img/apple-touch-icon.png',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: site.themeColor,
};

/**
 * Runs before the body parses, so animated elements are hidden without a flash
 * — and, just as importantly, stay visible when JavaScript never arrives or the
 * visitor has asked for less motion.
 *
 * It also carries the ?shot verification hook: ?shot disables motion and pins
 * the page for a screenshot, and ?shot=<px> lifts the document so a lower
 * section lands in the capture region, since headless always captures from the
 * document origin.
 */
const boot = `(function(){try{var d=document.documentElement,s=new URLSearchParams(location.search).get('shot');
if(s!==null){var o=parseInt(s,10);if(o>0)document.documentElement.style.scrollBehavior='auto',addEventListener('DOMContentLoaded',function(){scrollTo(0,o)});return;}
if(!matchMedia('(prefers-reduced-motion: reduce)').matches)d.classList.add('anim-ready');}catch(e){}})();`;

/**
 * Google Analytics 4 (NEXT_PUBLIC_GA_ID) and Google Tag Manager (W11,
 * NEXT_PUBLIC_GTM_ID), each loaded only when its ID is set at build time.
 * Consent Mode v2 defaults are declared first, in the same script, so no tag
 * reads them late: denied for EEA and UK visitors (cookieless pings only, as
 * there is no consent banner yet to grant them) and granted elsewhere.
 * GA4 is tagged here directly, so it must not also be configured inside the
 * GTM container, or every page view counts twice.
 */
const GA_ID = process.env.NEXT_PUBLIC_GA_ID;
const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID;
const EEA_UK = ['AT','BE','BG','HR','CY','CZ','DK','EE','FI','FR','DE','GR','HU','IS','IE','IT','LV','LI','LT','LU','MT','NL','NO','PL','PT','RO','SK','SI','ES','SE','GB'];
const tags =
  GA_ID || GTM_ID
    ? `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}
gtag('consent','default',{ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',analytics_storage:'denied',region:${JSON.stringify(EEA_UK)}});
gtag('consent','default',{ad_storage:'granted',ad_user_data:'granted',ad_personalization:'granted',analytics_storage:'granted'});
${GA_ID ? `gtag('js',new Date());gtag('config',${JSON.stringify(GA_ID)});
(function(d){var j=d.createElement('script');j.async=true;j.src='https://www.googletagmanager.com/gtag/js?id='+${JSON.stringify(encodeURIComponent(GA_ID))};d.head.appendChild(j);})(document);` : ''}
${GTM_ID ? `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer',${JSON.stringify(GTM_ID)});` : ''}`
    : '';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // The boot script below stamps `anim-ready` on <html> before hydration, so
    // the class list legitimately differs from what the server sent.
    <html
      lang="en"
      className={`${display.variable} ${text.variable} ${condensed.variable}`}
      suppressHydrationWarning
    >
      <body>
        <script dangerouslySetInnerHTML={{ __html: boot }} />
        {tags ? <script dangerouslySetInnerHTML={{ __html: tags }} /> : null}

        {/* The phone header hands navigation to a JS-driven sheet, so without
            JS there would be no nav at all. Fall back to the inline links. */}
        <noscript>
          <style>{`.burger{display:none!important}
          @media (max-width: 860px){
            .nav{display:flex!important;flex-wrap:wrap;gap:10px 14px;font-size:13.5px}
            .nav__sep{display:none}
          }`}</style>
        </noscript>

        <a className="skip-link" href="#main">
          Skip to content
        </a>

        {children}

        <Motion />
        <Tracking />
        <NavGuard />
      </body>
    </html>
  );
}

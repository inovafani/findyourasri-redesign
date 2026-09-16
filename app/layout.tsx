import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';

import Footer from '@/components/Footer';
import Header from '@/components/Header';
import Motion from '@/components/Motion';
import { site, structuredData } from '@/lib/site';

import './globals.css';

/**
 * Geist stands in for the design system's proprietary Saans / SaansMono, as
 * flagged in the system's own readme: same geometric build, and weight 500
 * reads correctly against the spec. Swapping in the real binaries is a change
 * to these two declarations and nothing else.
 */
const sans = Geist({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-geist-sans',
  display: 'swap',
});

const mono = Geist_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-geist-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: site.title,
  description: site.description,
  alternates: { canonical: '/' },
  openGraph: {
    siteName: site.name,
    title: site.title,
    description: site.socialDescription,
    type: 'website',
    url: `${site.url}/`,
    locale: site.locale,
    images: [site.ogImage],
  },
  twitter: {
    card: 'summary_large_image',
    title: site.title,
    description: site.socialDescription,
    images: [site.ogImage.url],
  },
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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // The boot script below stamps `anim-ready` on <html> before hydration, so
    // the class list legitimately differs from what the server sent.
    <html lang="en" className={`${sans.variable} ${mono.variable}`} suppressHydrationWarning>
      <body>
        <script dangerouslySetInnerHTML={{ __html: boot }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />

        <a className="skip-link" href="#main">
          Skip to content
        </a>

        <div className="wrap">
          <Header />
          <main id="main">{children}</main>
          <Footer />
        </div>

        <Motion />
      </body>
    </html>
  );
}

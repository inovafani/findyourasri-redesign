/**
 * Single source of truth for the things that appear in more than one place:
 * metadata, structured data, and the two contact routes.
 */
export const site = {
  name: 'Asri',
  title: 'Asri — Marketing & Production',
  url: 'https://findyourasri.com',
  locale: 'en_GB',
  themeColor: '#EDEFEA',
  description:
    'Content production, performance marketing and creator campaigns for destinations, hospitality groups and global brands. Operators and marketers in the same room.',
  socialDescription:
    'Operators and marketers in the same room. Content production, performance marketing and creator campaigns for destinations, hospitality groups and global brands.',
  ogImage: {
    url: 'https://findyourasri.com/img/og-card.jpg',
    width: 1200,
    height: 630,
    alt: 'Three phinisi sailing yachts under full sail, with the Asri logotype',
  },
  email: 'hello@findyourasri.com',
  phone: '+61 422 755 457',
  phoneHref: '+61422755457',
} as const;

export const serviceNames = [
  'Social Media Management',
  'Website Management & SEO',
  'Ads Campaign Management',
  'Bespoke Production',
] as const;

/** schema.org ProfessionalService, emitted as JSON-LD in the document head. */
export const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  name: site.name,
  url: `${site.url}/`,
  logo: `${site.url}/img/icon-512.png`,
  image: site.ogImage.url,
  description:
    'Content production, performance marketing and creator campaigns for destinations, hospitality groups and global brands.',
  email: site.email,
  telephone: site.phoneHref,
  areaServed: 'Indonesia',
  makesOffer: serviceNames.map((name) => ({
    '@type': 'Offer',
    itemOffered: { '@type': 'Service', name },
  })),
};

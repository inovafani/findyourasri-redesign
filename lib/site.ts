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
  areaServed: 'Worldwide',
  makesOffer: serviceNames.map((name) => ({
    '@type': 'Offer',
    itemOffered: { '@type': 'Service', name },
  })),
};


/**
 * Per-route metadata. Split pages only earn their keep if each one targets its
 * own query — one page can realistically rank for one cluster, four can rank
 * for four.
 */
export const pageMeta = {
  work: {
    title: 'Work — Asri',
    description:
      'Selected campaigns, destination films and production for Canon, DJI, National Geographic, Corona, Rosewood London and more.',
  },
  sectors: {
    title: 'Sectors — Asri',
    description:
      'Marketing and production for destinations and tourism boards, hospitality, global brands, and travel and experience operators.',
  },
  services: {
    title: 'Services — Asri',
    description:
      'Social media management, website management and SEO including GEO, ads campaign management, and bespoke production.',
  },
  process: {
    title: 'How We Work — Asri',
    description:
      'A ninety-day cycle: foundation, distribution, optimisation — and the commercial numbers we report against every month.',
  },
  contact: {
    title: 'Contact — Asri',
    description:
      'Start a conversation. The first step is a day on site, then a plan and a number before you commit to anything.',
  },
} as const;

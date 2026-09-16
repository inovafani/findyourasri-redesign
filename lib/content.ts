/**
 * Every string on the page, as data. Sections stay layout-only, so copy edits
 * never touch a component and nothing drifts out of sync with lib/site.ts.
 */

export const navLinks = [
  { href: '#sectors', label: 'Sectors' },
  { href: '#services', label: 'Services' },
  { href: '#work', label: 'Work' },
  { href: '#process', label: 'Process' },
] as const;

export const brands = [
  { src: '/img/logo-corona.png', alt: 'Corona', w: 297, h: 120, size: 20 },
  { src: '/img/logo-marriott.png', alt: 'Marriott', w: 244, h: 120, size: 22 },
  { src: '/img/logo-dji.png', alt: 'DJI', w: 208, h: 120, size: 17 },
  { src: '/img/logo-indonesia.png', alt: 'Wonderful Indonesia', w: 300, h: 120, size: 24 },
  { src: '/img/logo-canon.png', alt: 'Canon', w: 573, h: 120, size: 19 },
  { src: '/img/logo-pressplay.png', alt: 'Press Play', w: 215, h: 120, size: 21 },
  { src: '/img/logo-natgeo.png', alt: 'National Geographic', w: 408, h: 120, size: 18 },
  { src: '/img/logo-rosewood.png', alt: 'Rosewood London', w: 1227, h: 120, size: 14 },
  { src: '/img/logo-jamaica.png', alt: 'Jamaica Tourist Board', w: 351, h: 120, size: 24 },
  { src: '/img/logo-talalla.png', alt: 'Talalla Retreat, Sri Lanka', w: 741, h: 120, size: 17 },
  { src: '/img/logo-boattime.png', alt: 'Boattime Yacht Charters', w: 212, h: 120, size: 22 },
] as const;

export const sectors = [
  {
    kicker: 'Destinations & tourism boards',
    title: 'Seventeen Thousand Islands. The World Can Name Three.',
    body: 'Story-led destination films, regional campaigns and creator programmes built to open a region, not to expire with a quarter.',
    proof: 'We are not describing Indonesia from a deck. We have filmed in the regions you are trying to open.',
    img: '/img/v-destinations.jpg',
    alt: 'Aerial view of forested karst islands and turquoise lagoons in Raja Ampat',
    w: 863,
    h: 1400,
    flip: false,
  },
  {
    kicker: 'Hospitality',
    title: 'You Sell a Feeling. Your Marketing Sells a Rate.',
    body: 'Beach clubs, resorts, villas, hotels and restaurants. Content, campaigns and channel management for Indonesia’s best venues.',
    proof: 'One production block, an entire year of content you actually own.',
    img: '/img/v-hospitality.jpg',
    alt: 'Rows of white parasols and daybeds on a beach club terrace',
    w: 1054,
    h: 703,
    // The terrace sits low in the frame; the design pulls the crop down to it.
    pos: '50% 70%',
    flip: true,
  },
  {
    kicker: 'Global brands',
    title: 'Indonesia, Shot Properly, Without the Production Risk.',
    body: 'Campaign creative and full production service across the archipelago, from scout to master.',
    proof: 'You are not briefing a fixer and hoping. You are briefing a director who lives here.',
    img: '/img/v-brands.jpg',
    alt: 'Aerial view of a surf coastline meeting dense jungle',
    w: 1008,
    h: 630,
    flip: false,
  },
  {
    kicker: 'Travel & experience operators',
    title: 'The Best Trip in Indonesia Is Also the Hardest to See Online.',
    body: 'Liveaboards, phinisi, dive and tour operators. Content, direct-booking campaigns and creator expeditions.',
    proof: 'Every point of direct share you win is margin you keep, permanently.',
    img: '/img/v-operators.jpg',
    alt: 'A phinisi under black sails with a fleet anchored behind it',
    w: 1400,
    h: 788,
    flip: true,
  },
] as const;

export const stages = [
  'Content',
  'Attention',
  'Discovery',
  'Traffic',
  'Conversion',
  'Growth',
] as const;

export const services = [
  {
    name: 'Social Media Management',
    claim: 'Always on.',
    body: 'Fifteen feed posts, fifteen supporting stories and two or more reels a month, planned against a calendar rather than posted on instinct.',
    points: [
      'Monthly content calendar, captions and copywriting.',
      'Scheduling, publishing and community response.',
      'Creative direction and repurposing of existing assets.',
      'Content pillars: product, people, story, campaigns.',
    ],
    terms: 'Monthly retainer',
  },
  {
    name: 'Website Management & SEO',
    claim: 'Social creates demand. Search captures it.',
    body: 'The site kept current and the search position built, so the attention social earns has somewhere to land.',
    points: [
      'Content, page, product and offer updates.',
      'Site health, UX and conversion improvements.',
      'On-page and technical SEO, keyword research, internal linking.',
      'Search Console, brand and product discovery, monthly reporting.',
    ],
    terms: 'Monthly retainer',
  },
  {
    name: 'Ads Campaign Management',
    claim: 'Turn attention into measurable growth.',
    body: 'Meta and Google run as one system, with the tracking underneath it so every number can be traced back to a decision.',
    points: [
      'Meta: campaign setup, audience strategy, retargeting, creative testing.',
      'Google: search campaigns, keyword strategy, brand and category demand.',
      'GA4, GTM and Meta Pixel, conversion tracking and UTM.',
      'Budget, ceiling and objective agreed before anything goes live.',
    ],
    terms: 'Monthly retainer · ad spend excluded',
  },
  {
    name: 'Bespoke Production',
    claim: 'One shoot. Months of content.',
    body: 'One strategically planned production, built to yield sixty to ninety days of reusable social, advertising and website assets.',
    points: [
      'Creative direction, moodboard and shot list.',
      'Campaign concepts and production planning.',
      'Social and advertising asset requirements scoped up front.',
      'Product, lifestyle, motion and hospitality in one block.',
    ],
    terms: 'Per project',
  },
] as const;

/**
 * The archive grid. Each frame is placed by name through `grid-template-areas`
 * (see `.mosaic` in globals.css) rather than by span count: the span-based
 * layout tiled to 20 cells in a 21-cell grid, which is what left the hole in
 * the bottom-right corner. Named areas make the packing exact at every
 * breakpoint instead of leaving it to `grid-auto-flow: dense`.
 *
 * `area` is the placement name; the three templates place all twelve.
 */
export const mosaic = [
  { area: 'venue', src: '/img/w-venue.jpg', alt: 'A clifftop resort with terraced pools above the sea, from the air', w: 1200, h: 675 },
  { area: 'lagoon', src: '/img/w-lagoon.jpg', alt: 'Karst islands and turquoise channels in Raja Ampat', w: 674, h: 1200 },
  { area: 'coast', src: '/img/w-coast.jpg', alt: 'Aerial view of a surf coastline meeting dense jungle', w: 1008, h: 630 },
  { area: 'karst', src: '/img/w-karst.jpg', alt: 'Forested karst rising from a shallow lagoon', w: 678, h: 1100 },
  { area: 'beach', src: '/img/w-beach.jpg', alt: 'White parasols and daybeds on a beach club terrace', w: 1054, h: 703 },
  { area: 'table', src: '/img/w-table.jpg', alt: 'Guests dining together in a warm-lit saloon', w: 1200, h: 1125 },
  { area: 'deck', src: '/img/w-deck.jpg', alt: 'A long table laid for dinner on an open deck', w: 1200, h: 1125 },
  { area: 'daybed', src: '/img/w-daybed.jpg', alt: 'A guest reading on a daybed under a canopy', w: 1200, h: 1026 },
  { area: 'dj', src: '/img/w-dj.jpg', alt: 'A DJ performing under magenta stage light', w: 1024, h: 1100 },
  { area: 'night', src: '/img/w-night.jpg', alt: 'Guests dancing at a night event, lit in deep magenta', w: 1200, h: 1026 },
  { area: 'sails', src: '/img/w-sails.jpg', alt: 'Two phinisi under full sail on a bright sea', w: 1200, h: 1096 },
  { area: 'fleet', src: '/img/w-fleet.jpg', alt: 'A fleet of phinisi under tan sails on a calm sea', w: 1200, h: 1125 },
] as const;

export const steps = [
  {
    when: 'Month one',
    title: 'Foundation',
    body: 'Strategy and content planning, SEO and analytics setup, hero shoot and the first campaigns.',
  },
  {
    when: 'Month two',
    title: 'Distribution',
    body: 'Social publishing and SEO content, paid campaigns and creative testing, retargeting.',
  },
  {
    when: 'Month three',
    title: 'Optimization',
    body: 'Analyse what won, scale the creative that worked, grow the search position, plan the next cycle.',
  },
] as const;

export const measures = [
  [
    'Direct bookings, and direct share against OTA.',
    'Cost per direct booking across paid channels.',
    'Average daily rate and length of stay.',
    'Covers and spend per head on target nights.',
  ],
  [
    'Event and ticket sell-through.',
    'Occupancy in the shoulder season, not just peak.',
    'Repeat and returning guest rate.',
    'Owned audience growth: email list and followers.',
  ],
] as const;

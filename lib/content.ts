/**
 * Every string on the site, as data. Sections stay layout-only, so copy edits
 * never touch a component and nothing drifts out of sync with lib/site.ts.
 *
 * Copy follows the Asri Copy Deck (wireframe v4, 24 Sep 2026). Two rules hold
 * everywhere, and scripts/check-build.mjs fails the build if either breaks:
 * no em dash in any string, and "Cam", never the long form of the name.
 */

/* ============================================================
   Types
   ============================================================ */

export type SectorSlug = 'hospitality' | 'operators' | 'brands' | 'destinations';
export type ServiceSlug =
  | 'social-media'
  | 'web-and-seo'
  | 'paid-media'
  | 'production'
  | 'creator-campaigns';
export type Stage = 'Content' | 'Attention' | 'Discovery' | 'Traffic' | 'Conversion' | 'Scale';

/** The value the contact form's sector field reports to the pipeline. */
export type LeadSector = 'hospitality' | 'operator' | 'brand' | 'destination';

export type Frame = {
  id: string;
  src: string;
  alt: string;
  w: number;
  h: number;
  /** What is in the frame. Captions use this, never a client name. */
  subject: string;
  /** From Cam's shoot record only, never guessed. */
  place?: string;
  sectors: SectorSlug[];
  /** CSS object-position for tight crops, where the subject sits off centre. */
  pos?: string;
};

export type PriceKey =
  | 'growth'
  | 'performance'
  | 'productionDay'
  | 'eventShoot'
  | 'heroFilm'
  | 'webBuild'
  | 'creatorCampaign';

export type Service = {
  slug: ServiceSlug;
  name: string;
  /** Sentence case, for cards. */
  claim: string;
  /** Title case, for the service page's H1. */
  title: string;
  body: string;
  points: string[];
  terms: string;
  /** The hero's price line, where the wireframe words it differently from the card. */
  heroTerms?: string;
  stages: Stage[];
  /** How the partnerships include it, in one line. */
  inPartnership: string;
  units?: { label: string; price: PriceKey }[];
  /** FAQPage markup renders only for questions the page answers (GEO finding 8). */
  faqs?: { q: string; a: string }[];
  /** Gate W2: Creator Campaigns stays off the site until the offer list is decided. */
  live: boolean;
};

export type Sector = {
  slug: SectorSlug;
  lead: LeadSector;
  /** Short name for tiles, links and breadcrumbs. */
  name: string;
  kicker: string;
  title: string;
  /** Who it covers, in one line. */
  covers: string;
  body: string;
  proof: string;
  frame: string;
  /** Cards for "What we run", each with the sector's own line where one exists. */
  services: { slug: ServiceSlug; line?: string }[];
  /** Gate W7. Left out where nothing is on record. */
  measures?: string[];
  /** Gate W8: each sector's first step, from its deck's closing slide. */
  firstStep: { title: string; body: string };
  formTitle: string;
};

export type Partnership = {
  slug: 'growth' | 'performance';
  name: string;
  line: string;
  includes: string[];
  term: string;
  reporting: string;
  price: PriceKey;
};

export type Person = {
  name: string;
  fullName: string;
  role: string;
  /** One verified line; left out until written. */
  line?: string;
  /** Portrait path once a decided row exists; an empty frame shows until then. */
  photo?: string;
  /** Gate W3. Built and hidden until Anthony and Cam decide who appears. */
  show: boolean;
};

export type HiddenPage = {
  /** At the root. Must not match a public route or a legacy store path. */
  slug: string;
  audience: string;
  sector: SectorSlug;
  vertical: string;
  title: string;
  body: string;
  /** Gate W15: renders only once Brandon confirms it. */
  proof?: { text: string; verified: boolean };
  people: string[];
  peopleNote?: string;
  credential?: string;
  shoot: { title: string; lead: string; items: string[] };
  frames: string[];
  services: { slug: ServiceSlug; line: string }[];
  closer: string;
  measures: string[];
  firstStep: { title: string; body: string; line: string };
  og: { title: string; description: string };
};

/* ============================================================
   Navigation
   ============================================================ */

/**
 * The Work categories that are on the site.
 *
 * Marketing and Social Media are off until their work exists (Anthony,
 * 28 Sep: nothing half-finished while people are looking at the site). Add a
 * slug back here and it returns to the Work menu, the /work/ tiles, the
 * category switch and the sitemap, and its page stops answering 404.
 */
export const liveWorkSlugs: WorkCategorySlug[] = ['production'];

/** The header's page links. The call to action to /contact/ sits beside them. */
export const navLinks: {
  href: string;
  label: string;
  children?: { href: string; label: string }[];
}[] = [
  {
    href: '/work/',
    label: 'Work',
    children: (
      [
        { slug: 'production', href: '/work/production/', label: 'Production' },
        { slug: 'marketing', href: '/work/marketing/', label: 'Marketing' },
        { slug: 'social-media', href: '/work/social-media/', label: 'Social Media' },
      ] as const
    ).filter((c) => liveWorkSlugs.includes(c.slug)),
  },
  { href: '/sectors/', label: 'Sectors' },
  { href: '/services/', label: 'Services' },
  { href: '/about/', label: 'About' },
];

/* ============================================================
   Brands
   ============================================================ */

/** The logo reel on the home page. */
export const brands = [
  { src: "/img/logo-corona.png", alt: "Corona", w: 297, h: 120, size: 20 },
  { src: "/img/logo-marriott.png", alt: "Marriott", w: 244, h: 120, size: 22 },
  { src: "/img/logo-dji.png", alt: "DJI", w: 208, h: 120, size: 17 },
  {
    src: "/img/logo-indonesia.png",
    alt: "Wonderful Indonesia",
    w: 300,
    h: 120,
    size: 24,
  },
  { src: "/img/logo-canon.png", alt: "Canon", w: 573, h: 120, size: 19 },
  {
    src: "/img/logo-pressplay.png",
    alt: "Press Play",
    w: 215,
    h: 120,
    size: 21,
  },
  {
    src: "/img/logo-natgeo.png",
    alt: "National Geographic",
    w: 408,
    h: 120,
    size: 18,
  },
  {
    src: "/img/logo-rosewood.png",
    alt: "Rosewood London",
    w: 1227,
    h: 120,
    size: 14,
  },
  {
    src: "/img/logo-jamaica.png",
    alt: "Jamaica Tourist Board",
    w: 351,
    h: 120,
    size: 24,
  },
  {
    src: "/img/logo-talalla.png",
    alt: "Talalla Retreat, Sri Lanka",
    w: 741,
    h: 120,
    size: 17,
  },
  {
    src: "/img/logo-boattime.png",
    alt: "Boattime Yacht Charters",
    w: 212,
    h: 120,
    size: 22,
  },
] as const;

/* ============================================================
   Prices
   ============================================================ */

/**
 * One object, like the decks' PRICING. `null` renders "On application" until
 * D2 applies the rate card to the site. Rates rise from January 2027, which is
 * one more reason they are data and not copy.
 */
export const PRICING: Record<PriceKey, string | null> = {
  growth: null,
  performance: null,
  productionDay: null,
  eventShoot: null,
  heroFilm: null,
  webBuild: null,
  creatorCampaign: null,
};

export const ON_APPLICATION = 'On application';

export function price(key: PriceKey) {
  return PRICING[key] ?? ON_APPLICATION;
}

/* ============================================================
   Frames
   ============================================================ */

/**
 * The archive, by id. Savaya's five frames (rows 4, 5, 7, 9, 11) are off the
 * site, and so is every frame with identifiable guests, a DJ or a reader until
 * a release is on record. None of what is left has Cam's rights decision yet
 * (C2, C6): this list is what master already showed, minus what had to go.
 */
export const frames = {
  fleet: {
    id: 'fleet',
    src: '/img/w-fleet.jpg',
    alt: 'A fleet of phinisi under tan sails on a calm sea',
    w: 1200,
    h: 1125,
    subject: 'Phinisi fleet under sail',
    sectors: ['operators', 'destinations'],
  },
  karst: {
    id: 'karst',
    src: '/img/w-karst.jpg',
    alt: 'Forested karst rising from a shallow lagoon',
    w: 678,
    h: 1100,
    subject: 'Karst in a shallow lagoon',
    sectors: ['destinations', 'brands'],
  },
  deck: {
    id: 'deck',
    src: '/img/w-deck.jpg',
    alt: 'A long table laid for lunch on the shaded deck of a phinisi',
    w: 1200,
    h: 1125,
    subject: 'Lunch laid on deck',
    sectors: ['hospitality', 'operators'],
    pos: '30% 60%',
  },
  sails: {
    id: 'sails',
    src: '/img/w-sails.jpg',
    alt: 'Two phinisi under full sail on a bright sea',
    w: 1200,
    h: 1096,
    subject: 'Two phinisi under full sail',
    sectors: ['operators', 'brands'],
  },
  lagoon: {
    id: 'lagoon',
    src: '/img/w-lagoon.jpg',
    alt: 'Karst islands and turquoise channels seen from the air',
    w: 674,
    h: 1200,
    subject: 'Karst islands from the air',
    sectors: ['destinations', 'hospitality'],
  },
  islands: {
    id: 'islands',
    src: '/img/v-destinations.jpg',
    alt: 'Aerial view of forested karst islands and turquoise lagoons',
    w: 863,
    h: 1400,
    subject: 'Forested islands and lagoons',
    sectors: ['destinations', 'brands'],
  },
  blackSails: {
    id: 'blackSails',
    src: '/img/v-operators.jpg',
    alt: 'A phinisi under black sails with a fleet anchored behind it',
    w: 1400,
    h: 788,
    subject: 'Phinisi under black sails',
    sectors: ['operators', 'hospitality'],
  },
  sunset: {
    id: 'sunset',
    src: '/img/band-close.jpg',
    alt: 'A fleet of phinisi at anchor in the path of the setting sun',
    w: 843,
    h: 1500,
    subject: 'Phinisi fleet at sunset',
    sectors: ['operators', 'destinations'],
  },
  about: {
    id: 'about',
    src: '/img/about.jpg',
    alt: 'Guests on the deck of a phinisi, facing the sunset over the islands',
    w: 2400,
    h: 1600,
    subject: 'Sunset on deck',
    sectors: ['operators', 'hospitality'],
    pos: '50% 58%',
  },
  hospitalityVilla: {
    id: 'hospitalityVilla',
    src: '/img/sector-hospitality.jpg',
    alt: 'A guest carrying a surfboard past a private plunge pool at a villa in the jungle',
    w: 1600,
    h: 2000,
    subject: 'Villa and plunge pool',
    sectors: ['hospitality'],
  },
  operatorsSunset: {
    id: 'operatorsSunset',
    src: '/img/sector-operators.jpg',
    alt: 'Guests on the deck of a phinisi at sunset, the rigging against an orange sky',
    w: 2400,
    h: 1600,
    subject: 'Sunset on deck',
    sectors: ['operators'],
    pos: '55% 50%',
  },
  brandsBeach: {
    id: 'brandsBeach',
    src: '/img/sector-brands.jpg',
    alt: 'Aerial view of a white-sand beach and palms, a small boat on turquoise water',
    w: 1600,
    h: 2000,
    subject: 'Beach from the air',
    sectors: ['brands'],
  },
  destinationsPool: {
    id: 'destinationsPool',
    src: '/img/sector-destinations.jpg',
    alt: 'An infinity pool on a lawn beneath palms in the morning light',
    w: 1600,
    h: 2000,
    subject: 'Pool beneath the palms',
    sectors: ['destinations'],
  },
  travelBhutan: {
    id: 'travelBhutan',
    src: '/img/travel/bhutan.jpg',
    alt: 'A young monk in red robes crossing a covered wooden bridge',
    w: 2400,
    h: 1500,
    subject: 'A monk crossing the bridge',
    sectors: ['destinations'],
  },
  travelIndia: {
    id: 'travelIndia',
    src: '/img/travel/india.jpg',
    alt: 'A holy man in an orange turban and prayer beads at dusk by the river',
    w: 2400,
    h: 1600,
    subject: 'A sadhu at dusk',
    sectors: ['destinations'],
    pos: '66% 40%',
  },
  travelMantas: {
    id: 'travelMantas',
    src: '/img/travel/mantas.jpg',
    alt: 'A manta ray gliding over a reef among schools of small fish',
    w: 1600,
    h: 2000,
    subject: 'A manta over the reef',
    sectors: ['destinations'],
  },
  travelNepal: {
    id: 'travelNepal',
    src: '/img/travel/nepal.jpg',
    alt: 'Three young monks seated before a golden Buddha in a temple',
    w: 1600,
    h: 2000,
    subject: 'Young monks at the temple',
    sectors: ['destinations'],
  },
  travelSanMarzano: {
    id: 'travelSanMarzano',
    src: '/img/travel/san-marzano.jpg',
    alt: 'A fleet of phinisi on still water under a rising sun',
    w: 2400,
    h: 1350,
    subject: 'Phinisi fleet at sunrise',
    sectors: ['destinations'],
    pos: '56% 50%',
  },
  travelVietnam: {
    id: 'travelVietnam',
    src: '/img/travel/vietnam.jpg',
    alt: 'A man on a bicycle loaded with woven bamboo fish traps',
    w: 1080,
    h: 1350,
    subject: 'A basket seller on his bicycle',
    sectors: ['destinations'],
  },
  travelAfrica: {
    id: 'travelAfrica',
    src: '/img/travel/africa.jpg',
    alt: 'A rider on a pale horse before a tall waterfall',
    w: 1600,
    h: 2000,
    subject: 'A rider below the falls',
    sectors: ['destinations'],
  },
  travelIndonesia: {
    id: 'travelIndonesia',
    src: '/img/travel/indonesia.jpg',
    alt: 'A procession in white ceremonial dress walking up a jungle path',
    w: 1600,
    h: 2000,
    subject: 'A temple procession',
    sectors: ['destinations'],
  },
  clientCoast: { id: 'clientCoast', src: '/img/w-coast.jpg', alt: 'Aerial view of a surf coastline meeting dense jungle', w: 1008, h: 630, subject: 'Surf coast from the air', sectors: ['destinations'] },
  clientBeach: { id: 'clientBeach', src: '/img/w-beach.jpg', alt: 'White parasols and daybeds on a beach club terrace', w: 1054, h: 703, subject: 'Beach club terrace', sectors: ['brands'], pos: '50% 80%' },
  clientDaybed: { id: 'clientDaybed', src: '/img/w-daybed.jpg', alt: 'A guest reading on a daybed under a canopy', w: 1200, h: 1026, subject: 'A daybed under the canopy', sectors: ['hospitality'] },
  clientNight: { id: 'clientNight', src: '/img/whitsundays-1.jpg', alt: 'Guests dancing at a night event, lit in deep magenta', w: 1200, h: 1026, subject: 'A night event', sectors: ['operators'] },
  clientDj: { id: 'clientDj', src: '/img/w-dj.jpg', alt: 'A DJ performing under magenta stage light', w: 1024, h: 1100, subject: 'A DJ set', sectors: ['hospitality'] },
} as const satisfies Record<string, Frame>;

export type FrameId = keyof typeof frames;

/** The Work grid, in order. Six, so the rows fill at two and three across. */
export const archive: FrameId[] = ['fleet', 'karst', 'deck', 'sails', 'lagoon', 'blackSails'];

/** The home page shows the first three. */
export const featured: FrameId[] = archive.slice(0, 3);

export function sectorFrames(slug: SectorSlug): Frame[] {
  const tagged = archive.map((id) => frames[id] as Frame).filter((f) => f.sectors.includes(slug));
  // Three or six, so the row always fills.
  return tagged.length >= 6 ? tagged.slice(0, 6) : tagged.length >= 3 ? tagged.slice(0, 3) : [];
}

/**
 * The Work page showreel (C5). Until Cam cuts the 60 to 90 second reel, it
 * plays the hero film. Swap `src` and `poster` for the real reel; it plays
 * only on request, with sound, and never preloads.
 */
export const showreel = {
  src: '/video/hero.mp4',
  poster: '/video/hero-poster.jpg',
  label: 'Play the showreel',
};

/**
 * Long films live on the Bunny CDN (storage and pull zone `asri-media`), not
 * in the repo. NEXT_PUBLIC_MEDIA_URL is the pull zone's address; the files sit
 * at the root of the storage zone.
 */
const MEDIA = (process.env.NEXT_PUBLIC_MEDIA_URL ?? '').replace(/\/$/, '');
/** A file at the root of the Bunny storage zone, or in /public/video without it. */
export const media = (file: string) => (MEDIA ? `${MEDIA}/${file}` : `/video/${file}`);

/* ============================================================
   Work: the portfolio (Cam, 25 Sep)
   ============================================================ */

/**
 * The Work menu opens on three categories. Production splits into Travel,
 * Client and Films, the way Emmett's portfolio does; Marketing and Social
 * Media are single grids for now.
 *
 * ⚠ PLACEHOLDER CONTENT. Cam's production team is choosing the campaigns and
 * sends them from the week of 28 Sep. Until then every piece below reuses a
 * frame already on the site, so the structure can be reviewed. Replace the
 * titles, places and frames as the real work lands, and never put a client's
 * name here without their written approval (C10, C12).
 */
export type WorkCategorySlug = 'production' | 'marketing' | 'social-media';
export type WorkTabSlug = 'travel' | 'client' | 'films';

export type WorkCategory = {
  slug: WorkCategorySlug;
  name: string;
  line: string;
  cover: FrameId;
  /** Tabs inside the category; the first is the category's own page. */
  tabs?: { slug: WorkTabSlug; label: string }[];
  /** The tile shape for this category's grid: 2:3 in every category, so the pages match. */
  ratio: string;
  /** The chart motif behind the category's opening. */
  pattern: 'swell' | 'isobars' | 'drops';
};

export type WorkPiece = {
  id: string;
  title: string;
  /** Shown under the title: the place for travel, the client or format elsewhere. */
  meta?: string;
  category: WorkCategorySlug;
  tab?: WorkTabSlug;
  frame: FrameId;
  /** A client's mark, drawn white in the tile's corner. */
  logo?: { src: string; w: number; h: number };
  /**
   * Films play in place; everything else opens the viewer. `srcSm` is the
   * 720p cut phones get; both are web encodes of the masters in _src/video.
   */
  video?: { src: string; srcSm?: string; poster: string };
};

export const workCategories: WorkCategory[] = [
  {
    slug: 'production',
    name: 'Production',
    line: 'Travel, client campaigns and films, shot by our own crew.',
    cover: 'fleet',
    tabs: [
      { slug: 'travel', label: 'Travel' },
      { slug: 'client', label: 'Client' },
      { slug: 'films', label: 'Films' },
    ],
    ratio: '2 / 3',
    pattern: 'swell',
  },
  {
    slug: 'marketing',
    name: 'Marketing',
    line: 'Campaigns built to fill rooms, boats and dates.',
    cover: 'deck',
    ratio: '2 / 3',
    pattern: 'isobars',
  },
  {
    slug: 'social-media',
    name: 'Social Media',
    line: 'Always-on content, planned ahead and posted on schedule.',
    cover: 'islands',
    ratio: '2 / 3',
    pattern: 'drops',
  },
];

export const liveWorkCategories = workCategories.filter((c) => liveWorkSlugs.includes(c.slug));

export function getWorkCategory(slug: WorkCategorySlug) {
  return workCategories.find((c) => c.slug === slug)!;
}

export const workPieces: WorkPiece[] = [
  // Production · Travel: one tile per place, from Cam's travel frames in
  // public/img/travel.
  { id: 't1', title: 'Bhutan', meta: 'A monk crossing the bridge', category: 'production', tab: 'travel', frame: 'travelBhutan' },
  { id: 't2', title: 'India', meta: 'A sadhu at dusk', category: 'production', tab: 'travel', frame: 'travelIndia' },
  { id: 't3', title: 'Mantas', meta: 'A manta over the reef', category: 'production', tab: 'travel', frame: 'travelMantas' },
  { id: 't4', title: 'Nepal', meta: 'Young monks at the temple', category: 'production', tab: 'travel', frame: 'travelNepal' },
  { id: 't5', title: 'San Marzano', meta: 'Phinisi fleet at sunrise', category: 'production', tab: 'travel', frame: 'travelSanMarzano' },
  { id: 't6', title: 'Vietnam', meta: 'A basket seller on his bicycle', category: 'production', tab: 'travel', frame: 'travelVietnam' },
  { id: 't7', title: 'Indonesia', meta: 'A temple procession', category: 'production', tab: 'travel', frame: 'travelIndonesia' },
  { id: 't8', title: 'Africa', meta: 'A rider below the falls', category: 'production', tab: 'travel', frame: 'travelAfrica' },
  // Production · Client: the client cards from the original design, each with
  // its logo. The line under each name is the sector, not the invented service
  // lines the first build carried.
  { id: 'c1', title: 'Canon', meta: 'Global brands', category: 'production', tab: 'client', frame: 'deck', logo: { src: '/img/logo-canon.png', w: 81, h: 17 } },
  { id: 'c2', title: 'DJI', meta: 'Global brands', category: 'production', tab: 'client', frame: 'fleet', logo: { src: '/img/logo-dji.png', w: 35, h: 20 } },
  { id: 'c3', title: 'National Geographic', meta: 'Global brands', category: 'production', tab: 'client', frame: 'karst', logo: { src: '/img/logo-natgeo.png', w: 95, h: 28 } },
  { id: 'c4', title: 'Jamaica Tourist Board', meta: 'Destinations & tourism boards', category: 'production', tab: 'client', frame: 'clientCoast', logo: { src: '/img/logo-jamaica.png', w: 70, h: 24 } },
  { id: 'c5', title: 'Corona', meta: 'Global brands', category: 'production', tab: 'client', frame: 'clientBeach', logo: { src: '/img/logo-corona.png', w: 69, h: 28 } },
  { id: 'c6', title: 'Rosewood London', meta: 'Hospitality', category: 'production', tab: 'client', frame: 'clientDaybed', logo: { src: '/img/logo-rosewood.png', w: 143, h: 14 } },
  { id: 'c7', title: 'Boattime Yacht Charters', meta: 'Travel & experience operators', category: 'production', tab: 'client', frame: 'sails', logo: { src: '/img/logo-boattime.png', w: 53, h: 30 } },
  { id: 'c8', title: 'Wonderful Indonesia', meta: 'Destinations & tourism boards', category: 'production', tab: 'client', frame: 'lagoon', logo: { src: '/img/logo-indonesia.png', w: 70, h: 28 } },
  { id: 'c9', title: 'BluePass', meta: 'Travel & experience operators', category: 'production', tab: 'client', frame: 'clientNight', logo: { src: '/img/logo-bluepass.png', w: 19, h: 28 } },
  { id: 'c10', title: 'Press Play', meta: 'Hospitality', category: 'production', tab: 'client', frame: 'clientDj', logo: { src: '/img/logo-pressplay.png', w: 50, h: 28 } },
  // Production · Films: DUMMY titles until Cam names the films.
  {
    id: 'f1',
    title: 'Nets at First Light',
    meta: 'Brand film · 1 min 12',
    category: 'production',
    tab: 'films',
    frame: 'fleet',
    video: {
      src: media('film-marriott.mp4'),
      srcSm: media('film-marriott-sm.mp4'),
      poster: media('film-marriott-poster.jpg'),
    },
  },
  {
    id: 'f2',
    title: 'Seven Days, One Sea',
    meta: 'Expedition film · 2 min 21',
    category: 'production',
    tab: 'films',
    frame: 'islands',
    video: {
      src: media('film-san-mazarno.mp4'),
      srcSm: media('film-san-mazarno-sm.mp4'),
      poster: media('film-san-mazarno-poster.jpg'),
    },
  },
  // Marketing: empty until the real campaigns land (Anthony, 28 Sep: no
  // placeholder content on the live site).
  // Social Media: empty for the same reason.
];

export function workFor(category: WorkCategorySlug, tab?: WorkTabSlug) {
  return workPieces.filter((p) => p.category === category && (!tab || p.tab === tab));
}

/* ============================================================
   Case studies (Phase 2)
   ============================================================ */

export type Result = { value: string; label: string; source: string; measuredOn: string };

export type CaseStudy = {
  /** Lives at /work/{slug}/, so never 'production', 'marketing' or 'social-media'. */
  slug: string;
  client: string;
  sector: SectorSlug;
  /** From the case record, never inferred from a brief. */
  services: ServiceSlug[];
  /** The one line after the client's name in the H1. Cam and Anthony write it. */
  line: string;
  /** The client's written approval. null: the route is not built. */
  approval: { by: string; on: string } | null;
  /** A layout preview with the wireframe's placeholders. Built by `next dev` only. */
  preview?: boolean;
  where?: string;
  when?: string;
  crew?: string[];
  /** The client's own words, with their approval. */
  brief: string;
  /** Three to five steps, in order. */
  did: string[];
  hero: FrameId;
  frames: FrameId[];
  /** Empty renders "Results: pending measurement". */
  results: Result[];
  /** Only with written permission, dated. */
  quote?: { text: string; name: string; role: string; permissionOn: string };
};

/**
 * None is approved yet: the first candidates are the multi-phinisi flagship
 * event (C10) and the pilot shoot (C12). The entry below is the wireframe's
 * placeholder, kept so the template can be reviewed in `next dev`.
 */
export const caseStudies: CaseStudy[] = [
  {
    slug: 'preview',
    client: '{Client}',
    sector: 'operators',
    services: ['production', 'paid-media'],
    line: '{what was done, in one line}',
    approval: null,
    preview: true,
    where: '{Where, from the shoot record}',
    when: '{When}',
    crew: ['{Crew, from the call sheet}'],
    brief: '{The brief, in the client\'s own words, with their approval.}',
    did: ['{Step one}', '{Step two}', '{Step three}', '{Step four}'],
    hero: 'fleet',
    frames: ['sails', 'blackSails', 'deck'],
    results: [],
    quote: {
      text: '{Quote}',
      name: '{Name}',
      role: '{role}',
      permissionOn: '{date}',
    },
  },
];

/** Approved case studies, plus the preview entries while developing. */
export function publishedCaseStudies() {
  const dev = process.env.NODE_ENV !== 'production';
  return caseStudies.filter((c) => c.approval || (dev && c.preview));
}

/* ============================================================
   Stages and the ninety days
   ============================================================ */

export const stages: Stage[] = [
  'Content',
  'Attention',
  'Discovery',
  'Traffic',
  'Conversion',
  'Scale',
];

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
    title: 'Optimisation',
    body: 'Analyse what won, scale the creative that worked, grow the search position, plan the next cycle.',
  },
] as const;

/* ============================================================
   Services
   ============================================================ */

export const services: Service[] = [
  {
    slug: 'social-media',
    name: 'Social Media Management',
    claim: 'Consistency is the whole game.',
    title: 'Consistency Is the Whole Game',
    // The monthly counts wait on the contract-pack check (W9).
    body: 'Fifteen posts, fifteen stories and two reels a month, planned against a calendar.',
    points: [
      'Calendar, captions and copywriting.',
      'Publishing and community response.',
      'Creative direction and asset repurposing.',
      'Pillars: product, people, story, campaigns.',
    ],
    terms: 'Monthly retainer',
    stages: ['Content', 'Attention'],
    inPartnership: 'Included in Growth and Performance.',
    live: true,
  },
  {
    slug: 'web-and-seo',
    name: 'Website Management & SEO',
    claim: 'Social creates demand. Search captures it.',
    title: 'Social Creates Demand. Search Captures It.',
    body: 'The site kept current, and found in both search and AI answers.',
    points: [
      'Content, page and offer updates.',
      'Site health, UX and conversion fixes.',
      'Technical and on-page SEO, keyword research.',
      'GEO and AI search: cited in AI answers, not just ranked.',
      'Search Console and monthly reporting.',
    ],
    terms: 'Monthly retainer',
    stages: ['Discovery', 'Traffic', 'Conversion'],
    inPartnership: 'SEO is included in Growth. Website management and conversion work are in Performance.',
    units: [{ label: 'Website design and build, per project', price: 'webBuild' }],
    live: true,
  },
  {
    slug: 'paid-media',
    name: 'Ads Campaign Management',
    claim: 'Every number traced to a decision.',
    title: 'Every Number Traced to a Decision',
    body: 'Meta and Google run together, with the tracking underneath them.',
    points: [
      'Meta: setup, audiences, retargeting, creative testing.',
      'Google: search, keywords, brand and category demand.',
      'Conversion tracking, set up and checked.',
    ],
    terms: 'Monthly retainer · ad spend excluded',
    heroTerms: 'Monthly fee · ad spend excluded',
    stages: ['Traffic', 'Conversion'],
    inPartnership: 'Included in Growth and Performance.',
    faqs: [
      {
        q: 'Is ad spend included?',
        a: 'No. Ad spend is yours, billed by the platform directly.',
      },
    ],
    live: true,
  },
  {
    slug: 'production',
    name: 'Bespoke Production',
    claim: 'One shoot. Months of content.',
    title: 'One Shoot. Months of Content.',
    body: 'One planned production, built to yield sixty to ninety days of reusable assets.',
    points: [
      'Creative direction, moodboard and shot list.',
      'Campaign concepts and production planning.',
      'Asset requirements scoped up front.',
      'Product, lifestyle, motion and hospitality in one block.',
    ],
    terms: 'Per project',
    stages: ['Content'],
    inPartnership: 'Shoots are included in both Growth and Performance.',
    units: [
      { label: 'A production day', price: 'productionDay' },
      { label: 'An event shoot', price: 'eventShoot' },
      { label: 'A hero brand film', price: 'heroFilm' },
    ],
    live: true,
  },
  {
    slug: 'creator-campaigns',
    name: 'Creator Campaigns',
    claim: 'Chosen on audience fit, not follower count.',
    title: 'Chosen on Audience Fit, Not Follower Count',
    body: 'Creators matched to the guest you want, with a network reaching tens of millions.',
    points: [
      'Creators chosen on audience fit, not follower count.',
      'Briefs, contracts and usage rights handled by us.',
      'Content planned around your departures and seasons.',
    ],
    terms: 'Per campaign',
    stages: ['Attention', 'Discovery'],
    inPartnership: 'Included in Performance.',
    // W2 still open: shown so the site matches the wireframe. Set to false to
    // take the card, the page and the footer link down together.
    live: true,
  },
];

/** Only the services that are on the site today (W2). */
export const liveServices = services.filter((s) => s.live);

export function getService(slug: ServiceSlug) {
  return services.find((s) => s.slug === slug)!;
}

/**
 * The "How we shoot" panel that used to sit hidden in Services.tsx. It lives
 * on the production page now.
 */
export const howWeShoot = {
  title: 'Full crew. Permits. Finishing.',
  lines: [
    'Full in-house crew: direction, camera, drone, underwater, edit. Permits, fixers, boats and remote logistics handled by us.',
    'Colour, sound and finishing to broadcast standard. Every asset cut to platform-native ratios, not cropped as an afterthought.',
  ],
};

/* ============================================================
   Partnerships
   ============================================================ */

/**
 * The two names are decided (16 Sep). The inclusions are a draft from Rate
 * Card v1 as amended on 14 Sep; Anthony confirms them against the contract
 * pack (B5, W9).
 */
export const partnerships: Partnership[] = [
  {
    slug: 'growth',
    name: 'Growth',
    line: 'Social, search and paid media, fed by shoots included in the scope.',
    includes: [
      'Social media management',
      'Meta and Google campaigns',
      'Event and product shoots',
      'A monthly report',
    ],
    term: 'Six-month minimum',
    reporting: 'Monthly',
    price: 'growth',
  },
  {
    slug: 'performance',
    name: 'Performance',
    line: 'Everything in Growth, plus website management, conversion work, funnels and creator campaigns.',
    includes: [
      'Everything in Growth',
      'Website management and conversion optimisation',
      'Creator campaigns',
      'A fortnightly report',
    ],
    term: 'Six-month minimum',
    reporting: 'Fortnightly',
    price: 'performance',
  },
];

/* ============================================================
   Sectors
   ============================================================ */

export const sectors: Sector[] = [
  {
    slug: 'hospitality',
    lead: 'hospitality',
    name: 'Hospitality',
    kicker: 'Hospitality',
    title: 'Most Agencies Pitching You Have Never Had to Fill a Tuesday. We Have.',
    covers: 'Beach clubs, resorts, villas, hotels and restaurants.',
    body: 'Content, campaigns and channel management, wherever the property is.',
    proof: 'We have run the floor: restaurants, clubs and hotels in Bali.',
    frame: 'hospitalityVilla',
    services: [
      { slug: 'social-media', line: 'Planned ahead, in your voice, on schedule.' },
      { slug: 'web-and-seo', line: 'The site kept current. The search position built.' },
      { slug: 'paid-media', line: 'Meta and Google, pointed at direct bookings.' },
      { slug: 'production', line: 'One shoot. Months of content.' },
    ],
    measures: [
      'Direct bookings, and direct share against OTA.',
      'Cost per direct booking across paid channels.',
      'Average daily rate and length of stay.',
      'Covers and spend per head on target nights.',
      'Event and ticket sell-through.',
      'Occupancy in the shoulder season, not just peak.',
      'Repeat and returning guest rate.',
      'Owned audience growth: email list and followers.',
    ],
    firstStep: {
      title: 'Come and See the Property With Us',
      body: 'We see the property the way a guest does, then come back with a plan and a number.',
    },
    formTitle: 'Tell Us Which Nights Need Filling',
  },
  {
    slug: 'operators',
    lead: 'operator',
    name: 'Operators',
    kicker: 'Travel & experience operators',
    title: 'The Best Trip You Run Is the Hardest One to See Online.',
    covers: 'Liveaboards, charter, dive and tour operators.',
    body: 'Content, direct-booking campaigns and creator expeditions, planned around your departures.',
    proof: 'Every point of direct share you win is margin you keep, permanently.',
    frame: 'operatorsSunset',
    services: [
      { slug: 'production', line: 'One shoot. Months of content.' },
      { slug: 'paid-media', line: 'Meta and Google pointed at direct enquiries.' },
      { slug: 'creator-campaigns', line: 'Creator expeditions on your vessels and routes.' },
      { slug: 'web-and-seo', line: 'Your booking funnel, kept current and built for search.' },
    ],
    // Draft (W7): three of the Operators deck's eight lines, as on /marine/.
    measures: [
      'Direct bookings, and direct share against OTA.',
      'Commission paid away, tracked month by month.',
      'Charter and cabin occupancy by month.',
    ],
    firstStep: {
      title: 'Put Us on the Next Trip',
      body: 'We join a scheduled departure, shoot it, and come back with the assets and a plan for the season.',
    },
    formTitle: 'Tell Us Which Departures Need Filling',
  },
  {
    slug: 'brands',
    lead: 'brand',
    name: 'Global brands',
    kicker: 'Global brands',
    title: 'The Footage Is Rarely the Risk. The Country Is.',
    covers: 'Brands and their agencies.',
    body: 'Campaign creative and full production service on location, from scout to master.',
    proof:
      'You are not briefing a fixer and hoping. You are briefing the director who will be on set.',
    frame: 'brandsBeach',
    services: [{ slug: 'production' }, { slug: 'creator-campaigns' }],
    firstStep: {
      title: 'Send Us the Brief',
      body: 'We come back with a treatment, a location plan and a budget.',
    },
    formTitle: 'Send Us the Brief',
  },
  {
    slug: 'destinations',
    lead: 'destination',
    name: 'Destinations',
    kicker: 'Destinations & tourism boards',
    title: 'Films About People, Set in Places.',
    covers: 'Tourism boards and regional programmes.',
    body: 'Story-led destination films, regional campaigns and creator programmes built to open a region, not to expire with a quarter.',
    proof:
      'We are not pitching your region from a deck. We have filmed in the places you are trying to open.',
    frame: 'destinationsPool',
    services: [{ slug: 'production' }, { slug: 'creator-campaigns' }, { slug: 'paid-media' }],
    firstStep: {
      title: 'Start With One Region',
      body: 'We scout one region and film one story, then come back with a plan for the rest.',
    },
    formTitle: 'Tell Us Which Region to Open',
  },
];

export function getSector(slug: SectorSlug) {
  return sectors.find((s) => s.slug === slug)!;
}

/** The sectors that list a service, for "Who it is for" on the service page. */
export function sectorsFor(slug: ServiceSlug) {
  return sectors.filter((s) => s.services.some((x) => x.slug === slug));
}

/** The contact form's sector options, in the order the wireframe gives them. */
export const leadSectors: { value: LeadSector; label: string }[] = [
  { value: 'destination', label: 'Destinations and tourism boards' },
  { value: 'hospitality', label: 'Hospitality' },
  { value: 'brand', label: 'Global brands' },
  { value: 'operator', label: 'Travel and experience operators' },
];

/* ============================================================
   About
   ============================================================ */

/** Anthony, 24 Sep. Verify first: the brief's older line says the EU, not the UK. */
export const marketPlaces = ['Indonesia', 'Australia', 'South Africa', 'Sri Lanka', 'the UK', 'the United States'];
export const marketsLead = 'Our team has worked with companies in';
export const markets = `${marketsLead} ${marketPlaces.slice(0, -1).join(', ')} and ${marketPlaces.at(-1)}.`;

/**
 * The only names on the public site, with /marine/. First names on the page,
 * full names in Person schema only. W3 still decides who stays: set `show`
 * to false to take someone off both pages.
 */
export const people: Person[] = [
  { name: 'Anthony', fullName: 'Anthony Cargill', role: 'GTM & Performance Director', line: 'A decade of performance marketing: paid search, social and SEO.', photo: '/img/people/anthony.jpg', show: true },
  { name: 'Hannah', fullName: 'Hannah', role: 'Marketing Director', photo: '/img/people/hannah.jpg', show: true },
  { name: 'Brandon', fullName: 'Brandon Vaughne', role: 'Business Director', line: 'Founding partner in Boatique Charters, a Singapore charter company.', photo: '/img/people/brandon.jpg', show: true },
  { name: 'Cam', fullName: 'Cam Vaughne', role: 'Production and Content Director', line: '10+ years as photographer, cinematographer and director, commissioned by Corona, Canon, DJI and National Geographic.', photo: '/img/people/cam.jpg', show: true },
  { name: 'Daffa', fullName: 'Daffa', role: 'Marketing Manager', photo: '/img/people/daffa.jpg', show: true },
  { name: 'Inov', fullName: 'Inov', role: 'Web and Software Developer', photo: '/img/people/inov.jpg', show: true },
  // Yoga has not sent a photo yet, so his frame stays empty.
  { name: 'Yoga', fullName: 'Yoga', role: 'Social Media Manager', show: true },
];

/**
 * "Why Asri exists": the founder story (C11), as supplied on 28 Sep.
 */
export const whyAsri = {
  title: 'Why Asri Exists',
  paragraphs: [
    'Cam spent a decade behind the camera, commissioned by Corona, Canon, DJI and National Geographic. Brandon spent a decade in luxury hospitality, running the floor, the sales and the teams. Between them, they had made the work and run the places the marketing is meant to sell.',
    'Anthony and Hannah are the marketing. Anthony ran a full-service agency for a decade and leads performance and go-to-market. Hannah is our Marketing Director.',
    'Operators and marketers rarely sit in the same room. At Asri they do, and one team answers for the result.',
  ],
};

/** From the allowed list. "14+ years" (C1) and anything delivered for Corona (B10) are barred. */
export const record = [
  '300+ islands worked on the ground.',
  'A ten-year photo and video archive.',
  'Commissioned by Corona, Canon, DJI, National Geographic and Indonesian tourism boards.',
  'Vessel access at favourable rates through Boatique Charters.',
  'A multi-phinisi flagship event.',
];

/* ============================================================
   Hidden pages
   ============================================================ */

/**
 * Sent by link from a founder's own email or WhatsApp, never linked from the
 * site, never indexed. Adding one here builds its page; the build check makes
 * sure it stays out of the sitemap, llms.txt and every internal link.
 */
export const hiddenPages: HiddenPage[] = [
  {
    slug: 'marine',
    audience: 'For charter, liveaboard and dive operators',
    sector: 'operators',
    vertical: 'marine',
    title: 'The Best Trip You Run Is the Hardest One to See Online.',
    body: 'Content, direct-booking campaigns and creator expeditions, planned around your departures.',
    proof: {
      text: 'There are agencies who can market a boat, and crews who can film one. Very few who have run one.',
      // W15: Brandon confirms before the first link goes out.
      verified: true,
    },
    people: ['Brandon', 'Cam', 'Anthony'],
    peopleNote: 'Your enquiries, your guest list and your data stay yours.',
    credential: 'A multi-phinisi flagship event',
    shoot: {
      title: 'What We Shoot at Sea',
      lead: 'A crew that can dive the site and hold the shot.',
      items: [
        'A hero expedition film that sells the route, not just the vessel.',
        'Vertical cuts per destination and trip type, ready to publish.',
      ],
    },
    frames: ['fleet', 'sails', 'blackSails'],
    services: [
      { slug: 'production', line: 'One shoot. Months of content.' },
      { slug: 'paid-media', line: 'Meta and Google pointed at direct enquiries.' },
      { slug: 'creator-campaigns', line: 'Creator expeditions on your vessels and routes.' },
      { slug: 'web-and-seo', line: 'Your booking funnel, kept current and built for search.' },
    ],
    closer: 'The goal is not to leave the platforms. It is to stop needing them.',
    measures: [
      'Direct bookings, and direct share against OTA.',
      'Commission paid away, tracked month by month.',
      'Charter and cabin occupancy by month.',
    ],
    firstStep: {
      title: 'Put Us on the Next Trip',
      body: 'We join a scheduled departure, shoot it, and come back with the assets and a plan for the season.',
      line: 'One trip. Real footage, and a plan built on what we saw.',
    },
    og: {
      title: 'For Charter, Liveaboard and Dive Operators | Asri',
      description:
        'Content, direct-booking campaigns and creator expeditions for charter, liveaboard and dive operators, planned around your departures.',
    },
  },
];

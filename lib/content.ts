/**
 * Every string on the page, as data. Sections stay layout-only, so copy edits
 * never touch a component and nothing drifts out of sync with lib/site.ts.
 */

/** Ordered to match the page, so the numbered eyebrows read in sequence. */
export const navLinks = [
  { href: "#work", label: "Work" },
  { href: "#sectors", label: "Sectors" },
  { href: "#services", label: "Services" },
  { href: "#process", label: "Process" },
] as const;

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

export const sectors = [
  {
    kicker: "Destinations & tourism boards",
    title: "The World Knows Three of Your Regions. You Have Thirty.",
    body: "Story-led destination films, regional campaigns and creator programmes built to open a region, not to expire with a quarter.",
    proof:
      "We are not pitching your region from a deck. We have filmed in the places you are trying to open.",
    img: "/img/v-destinations.jpg",
    alt: "Aerial view of forested karst islands and turquoise lagoons in Raja Ampat",
    w: 863,
    h: 1400,
    flip: false,
  },
  {
    kicker: "Hospitality",
    title: "You Sell a Feeling. Your Marketing Sells a Rate.",
    body: "Beach clubs, resorts, villas, hotels and restaurants. Content, campaigns and channel management, wherever the property is.",
    proof: "One production block, an entire year of content you actually own.",
    img: "/img/v-hospitality.jpg",
    alt: "Rows of white parasols and daybeds on a beach club terrace",
    w: 1054,
    h: 703,
    // The terrace sits low in the frame; the design pulls the crop down to it.
    pos: "50% 70%",
    flip: true,
  },
  {
    kicker: "Global brands",
    title: "Remote Locations, Shot Properly, Without the Production Risk.",
    body: "Campaign creative and full production service on location, from scout to master.",
    proof:
      "You are not briefing a fixer and hoping. You are briefing the director who will be on set.",
    img: "/img/v-brands.jpg",
    alt: "Aerial view of a surf coastline meeting dense jungle",
    w: 1008,
    h: 630,
    flip: false,
  },
  {
    kicker: "Travel & experience operators",
    title: "The Best Trip You Run Is the Hardest One to See Online.",
    body: "Liveaboards, charter, dive and tour operators. Content, direct-booking campaigns and creator expeditions.",
    proof:
      "Every point of direct share you win is margin you keep, permanently.",
    img: "/img/v-operators.jpg",
    alt: "A phinisi under black sails with a fleet anchored behind it",
    w: 1400,
    h: 788,
    flip: true,
  },
] as const;

export const stages = [
  "Content",
  "Attention",
  "Discovery",
  "Traffic",
  "Conversion",
  "Growth",
] as const;

export const services = [
  {
    name: "Social Media Management",
    claim: "Always on.",
    body: "Fifteen posts, fifteen stories and two reels a month, planned against a calendar.",
    points: [
      "Calendar, captions and copywriting.",
      "Publishing and community response.",
      "Creative direction and asset repurposing.",
      "Pillars: product, people, story, campaigns.",
    ],
    terms: "Monthly retainer",
  },
  {
    name: "Website Management & SEO",
    claim: "Social creates demand. Search captures it.",
    body: "The site kept current, and found in both search and AI answers.",
    points: [
      "Content, page and offer updates.",
      "Site health, UX and conversion fixes.",
      "Technical and on-page SEO, keyword research.",
      "GEO / AI search: cited in AI answers, not just ranked.",
      "Search Console and monthly reporting.",
    ],
    terms: "Monthly retainer",
  },
  {
    name: "Ads Campaign Management",
    claim: "Every number traced to a decision.",
    body: "Meta and Google run as one system, with the tracking underneath it.",
    points: [
      "Meta: setup, audiences, retargeting, creative testing.",
      "Google: search, keywords, brand and category demand.",
      "GA4, GTM and Meta Pixel.",
      "Budget and objective agreed before launch.",
    ],
    terms: "Monthly retainer · ad spend excluded",
  },
  {
    name: "Bespoke Production",
    claim: "One shoot. Months of content.",
    body: "One planned production, built to yield sixty to ninety days of reusable assets.",
    points: [
      "Creative direction, moodboard and shot list.",
      "Campaign concepts and production planning.",
      "Asset requirements scoped up front.",
      "Product, lifestyle, motion and hospitality in one block.",
    ],
    terms: "Per project",
  },
] as const;

/**
 * Featured work.
 *
 * ⚠ PLACEHOLDER CONTENT. The client names are real — they are the same ones
 * already shown in the logo strip — but the **service lines are
 * invented** to show the layout, and the pairing of a client to a
 * photograph is arbitrary. Replace every `services` value, and check every `client`, before this goes anywhere near production.
 */
export const projects = [
  {
    client: "Canon",
    logo: "/img/logo-canon.png",
    logoH: 17,
    services: "Campaign production, photography and motion",
    src: "/img/w-deck.jpg",
    alt: "A long table laid for dinner on an open deck",
    w: 1200,
    h: 1125,
  },
  {
    client: "DJI",
    logo: "/img/logo-dji.png",
    logoH: 20,
    services: "Aerial unit, campaign creative, social content",
    src: "/img/w-fleet.jpg",
    alt: "A fleet of phinisi under tan sails on a calm sea",
    w: 1200,
    h: 1125,
  },
  {
    client: "National Geographic",
    logo: "/img/logo-natgeo.png",
    logoH: 28,
    services: "Production service, drone and underwater unit",
    src: "/img/w-karst.jpg",
    alt: "Forested karst rising from a shallow lagoon",
    w: 678,
    h: 1100,
  },
  {
    client: "Jamaica Tourist Board",
    logo: "/img/logo-jamaica.png",
    logoH: 24,
    services: "Destination film, social content, creator campaign",
    src: "/img/w-coast.jpg",
    alt: "Aerial view of a surf coastline meeting dense jungle",
    w: 1008,
    h: 630,
  },
  {
    client: "Corona",
    logo: "/img/logo-corona.png",
    logoH: 28,
    services: "Campaign creative, production service, paid media",
    src: "/img/w-beach.jpg",
    alt: "White parasols and daybeds on a beach club terrace",
    w: 1054,
    h: 703,
  },
  {
    client: "Rosewood London",
    logo: "/img/logo-rosewood.png",
    logoH: 14,
    services: "Photography, social content, website and SEO",
    src: "/img/w-daybed.jpg",
    alt: "A guest reading on a daybed under a canopy",
    w: 1200,
    h: 1026,
  },
  {
    client: "Boattime Yacht Charters",
    logo: "/img/logo-boattime.png",
    logoH: 30,
    services: "Website and SEO, direct-booking campaigns",
    src: "/img/w-sails.jpg",
    alt: "Two phinisi under full sail on a bright sea",
    w: 1200,
    h: 1096,
  },
  {
    client: "Wonderful Indonesia",
    logo: "/img/logo-indonesia.png",
    logoH: 28,
    services: "Destination film, creator programme, paid distribution",
    src: "/img/w-lagoon.jpg",
    alt: "Karst islands and turquoise channels seen from the air",
    w: 674,
    h: 1200,
  },
  {
    client: "BluePass",
    logo: "/img/logo-bluepass.png",
    logoH: 28,
    services: "Brand film, paid media, conversion tracking",
    src: "/img/w-night.jpg",
    alt: "Guests dancing at a night event, lit in deep magenta",
    w: 1200,
    h: 1026,
  },
  {
    client: "Press Play",
    logo: "/img/logo-pressplay.png",
    logoH: 28,
    services: "Event content, social media management",
    src: "/img/w-dj.jpg",
    alt: "A DJ performing under magenta stage light",
    w: 1024,
    h: 1100,
  },
] as const;

export const steps = [
  {
    when: "Month one",
    title: "Foundation",
    body: "Strategy and content planning, SEO and analytics setup, hero shoot and the first campaigns.",
  },
  {
    when: "Month two",
    title: "Distribution",
    body: "Social publishing and SEO content, paid campaigns and creative testing, retargeting.",
  },
  {
    when: "Month three",
    title: "Optimization",
    body: "Analyse what won, scale the creative that worked, grow the search position, plan the next cycle.",
  },
] as const;

export const measures = [
  [
    "Direct bookings, and direct share against OTA.",
    "Cost per direct booking across paid channels.",
    "Average daily rate and length of stay.",
    "Covers and spend per head on target nights.",
  ],
  [
    "Event and ticket sell-through.",
    "Occupancy in the shoulder season, not just peak.",
    "Repeat and returning guest rate.",
    "Owned audience growth: email list and followers.",
  ],
] as const;

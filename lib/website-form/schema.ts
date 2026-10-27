/**
 * The website form: every section and question, the layout of the cards, and the "team follow-ups" derived from
 * the answers. The rules and helpers shared with the client profile live in lib/forms/engine.ts.
 *
 * Ported from the brief prototype (_src/Asri Website Brief.html), question for question, except the platform
 * preference ("Do you have a preference for the website platform?"): Hannah does not want to offer clients that
 * choice, so `platform_pref` is gone from the form and from the summary.
 */

import { applyLayout, any, filled, hasValue, is, makeForm, not, type FollowUp, type FormConfig, type Getter, type Section } from '../forms/engine';

const YNS = ['Yes', 'No', 'Not sure'] as const;

export const sections: Section[] = [
  {
    id: 'project',
    title: 'The project',
    lede: "What we're building and what it needs to achieve.",
    fields: [
      { id: 'biz_name', label: 'Business or brand name', type: 'text', req: true },
      { id: 'contact_name', label: 'Who is our main contact for the website?', type: 'text', req: true, help: "If it's someone other than the person who filled in your client profile, tell us here." },
      { id: 'contact_email', label: 'Their email', type: 'email', req: true },
      { id: 'project_type', label: 'What are we building?', type: 'radio', req: true, opts: ['A brand new website', 'A redesign of our existing website', 'A landing page or microsite for a launch or campaign', 'Not sure, advise us'] },
      { id: 'current_keep', label: 'What should we keep from the current site?', type: 'textarea', help: 'Pages, sections, features or content that work well today.', show: is('project_type', 'A redesign of our existing website') },
      { id: 'page_count', label: 'Roughly how many pages and blog posts does the current site have?', type: 'text', show: is('project_type', 'A redesign of our existing website') },
      { id: 'why_now', label: "Why now? What's prompting this project?", type: 'textarea' },
      { id: 'site_goals', label: 'What should the website do for the business?', type: 'checks', opts: ['Drive direct bookings or reservations', 'Generate enquiries or leads', 'Sell products online', 'Build credibility with partners, agents or press', 'Launch or announce something new', 'Show up on Google and in AI search', 'Grow an email list', 'Recruit staff'] },
      { id: 'primary_action', label: 'The one thing you most want a visitor to do', type: 'radio', req: true, opts: ['Book a stay', 'Reserve a table', 'Book an experience or tour', 'Send an enquiry', 'Buy a product', 'Message on WhatsApp or call', 'Sign up or join a waitlist', 'Other'] },
      { id: 'primary_other', label: 'What is it?', type: 'text', show: is('primary_action', 'Other') },
      { id: 'hard_deadline', label: 'Is there a date the website must be live by?', type: 'radio', opts: ["Yes, it's tied to an opening, event or campaign", 'No'], help: "Timelines depend on the size of the project, and we'll confirm yours once it's scoped. Projects needed faster than our standard timeline may carry a rush fee." },
      { id: 'deadline_date', label: "What's the date?", type: 'text', show: is('hard_deadline', "Yes, it's tied to an opening, event or campaign") },
      { id: 'deadline_reason', label: 'What is it tied to?', type: 'text', show: is('hard_deadline', "Yes, it's tied to an opening, event or campaign") },
    ],
  },
  {
    id: 'inspiration',
    title: 'Look and feel',
    lede: 'This is where we get inside your head. The more you share, the closer our first design will be.',
    fields: [
      { id: 'refs', label: 'Up to five websites you love', type: 'refs', help: "They don't need to be in your industry. For each one, tell us what you like: the colours, layout, imagery, fonts, how easy it is to book or buy, the way it moves. Descriptions are optional, but they help a lot.", notesPh: 'What do you like about it? Colours, layout, imagery, fonts, how it feels to use...', notesMultiline: true, optionalFrom: 0 },
      { id: 'competitor_sites', label: "Competitor websites, and anything you'd want to do better than them", type: 'textarea' },
      { id: 'dislike_sites', label: "Any websites or styles you definitely don't want?", type: 'textarea' },
      { id: 'feel_words', label: 'How should the website feel?', type: 'checks', opts: ['Refined', 'Warm and personal', 'Playful', 'Adventurous', 'Bold', 'Minimal', 'Romantic', 'Editorial', 'Earthy', 'Exclusive', 'Calm', 'Energetic'] },
      { id: 'light_dark', label: 'Overall tone', type: 'radio', opts: ['Light and airy', 'Dark and moody', 'Somewhere in between', 'No preference'] },
      { id: 'image_text', label: 'Image-led or text-led?', type: 'radio', opts: ['Big, immersive imagery', 'A balance', 'More words and detail'] },
      { id: 'motion', label: 'How much movement?', type: 'radio', opts: ['Still and calm', 'Subtle movement', 'Bold animation and video'] },
      { id: 'inspo_upload', label: 'Upload anything that shows your taste', type: 'file', category: 'Inspiration', help: 'Vision boards, mood boards, screenshots, photos, magazine pages, colour swatches, sketches. Anything that helps us see what you see.' },
      { id: 'inspo_link', label: 'Or link to a Pinterest board, Drive folder or Are.na channel', type: 'url' },
      { id: 'inspo_notes', label: 'Anything else about the look you have in your head?', type: 'textarea' },
    ],
  },
  {
    id: 'content',
    title: 'Pages and content',
    lede: "What goes on the site, and what we'll shoot for it. We'll use the brand files and imagery from your client profile, and for most websites our production team also shoots fresh photo and video so the site looks like no one else's.",
    fields: [
      { id: 'want_shoot', label: 'Will we be shooting for your website?', type: 'radio', opts: ["Yes, it's part of our package", "We'd like a quote", 'Not sure yet', "No, we'll use existing imagery"] },
      { id: 'shoot_capture', label: 'What should the shoot capture?', type: 'textarea', help: 'The spaces, rooms, dishes, products, people or moments that matter most. Tell us the shots you can already picture on the homepage.', show: not('want_shoot', "No, we'll use existing imagery") },
      { id: 'shoot_type', label: 'What would you like shot?', type: 'checks', opts: ['Photography', 'Video', 'Drone and aerial', 'A homepage film', 'Team and founder portraits'], show: not('want_shoot', "No, we'll use existing imagery") },
      { id: 'shoot_timing', label: 'When could we shoot, and is there anything we should know?', type: 'textarea', help: 'Best season or time of day, whether we can film while open, areas to avoid, guest privacy.', show: not('want_shoot', "No, we'll use existing imagery") },
      { id: 'pages', label: 'Which pages do you think you need?', type: 'checks', help: "These are common for travel and hospitality, but we build websites for all kinds of businesses. If yours looks different, skip this list and tell us what you need below.", opts: ['Home', 'About or our story', 'Rooms, villas or accommodation', 'Menus', 'Experiences, tours or activities', "Events or what's on", 'Private hire and weddings', 'Spa or wellness', 'Shop', 'Gallery', 'Journal or blog', 'Offers and packages', 'Press', 'Careers', 'FAQs', 'Contact and location', 'Gift vouchers'] },
      { id: 'pages_other', label: "Pages or sections we haven't listed", type: 'textarea', help: "Describe them in your own words. We'll work out the structure with you." },
      { id: 'sub_pages', label: 'Do any venues, properties or sub-brands need their own pages or sections?', type: 'radio', opts: ['Yes', 'No'] },
      { id: 'sub_pages_detail', label: 'Which ones, and how separate should they feel?', type: 'textarea', show: is('sub_pages', 'Yes') },
      { id: 'copy_owner', label: 'Who will write the words for the website?', type: 'radio', opts: ['Asri writes everything', "We'll provide it and Asri polishes it", "We'll write it ourselves", 'Not sure'], help: 'Copy is the most common reason website launches slip. Knowing who owns it lets us plan for it.' },
      { id: 'copy_upload', label: 'Upload any existing copy', type: 'file', category: 'Website copy', help: 'Old website text, room descriptions, your story, FAQs.', show: not('copy_owner', 'Asri writes everything') },
      { id: 'supporting', label: 'Which of these do you have for the site?', type: 'checks', opts: ['Team bios and headshots', 'Guest reviews or testimonials', 'Partner, award or certification logos', 'Room, menu or experience details', 'Product photos and descriptions', 'FAQs'] },
      { id: 'supporting_upload', label: 'Upload them here', type: 'file', category: 'Supporting content', show: filled('supporting') },
      { id: 'new_assets', label: 'Any new photos, video or brand files since you filled in your client profile?', type: 'file', category: 'auto' },
    ],
  },
  {
    id: 'features',
    title: 'Features and integrations',
    lede: 'What the website needs to do, and which systems it has to connect to.',
    fields: [
      { id: 'booking', label: 'Do guests need to book or reserve on the website?', type: 'radio', opts: ['Yes', 'No'] },
      { id: 'booking_system', label: 'Which booking or reservations system?', type: 'text', ph: 'SiteMinder, Cloudbeds, Mews, SevenRooms, OpenTable, FareHarbor, Rezdy...', show: is('booking', 'Yes') },
      { id: 'booking_access', label: 'Do you have admin access to that system?', type: 'radio', opts: [...YNS], show: is('booking', 'Yes') },
      { id: 'shop', label: 'Will you sell products online?', type: 'radio', opts: ['Yes', 'Maybe later', 'No'] },
      { id: 'shop_products', label: 'Roughly how many products, and do they have sizes or variants?', type: 'text', show: is('shop', 'Yes') },
      { id: 'shop_ship', label: 'Where will you ship to?', type: 'text', show: is('shop', 'Yes') },
      { id: 'features', label: 'Which of these do you need?', type: 'checks', opts: ['Enquiry or contact form', 'Newsletter sign-up', 'WhatsApp chat button', 'Events calendar', 'Instagram feed', 'Guest reviews shown on site', 'Map and directions', 'Downloadable menus or brochures', 'Gift vouchers or memberships', 'Members or trade login', 'Job applications', 'Search', 'Other'] },
      { id: 'features_other', label: 'What else do you need the site to do?', type: 'textarea', show: is('features', 'Other') },
      { id: 'payments', label: 'Which payment provider do you use or prefer?', type: 'text', ph: 'Stripe, PayPal, Xendit, Midtrans...', show: any(is('shop', 'Yes'), is('features', 'Gift vouchers or memberships')) },
      { id: 'form_routing', label: 'Which email address should enquiries go to?', type: 'email', show: is('features', 'Enquiry or contact form') },
      { id: 'multilingual', label: 'Does the website need more than one language?', type: 'radio', opts: ['Yes', 'Maybe later', 'No'] },
      { id: 'languages', label: 'Which languages, and who will translate?', type: 'text', show: not('multilingual', 'No') },
      { id: 'currencies', label: 'Should prices show in more than one currency?', type: 'radio', opts: ['Yes', 'No'] },
      { id: 'integrations', label: 'Other systems the website should connect to', type: 'textarea', ph: 'CRM, PMS, POS, review platforms, chat tools...' },
      { id: 'accessibility', label: 'Any accessibility requirements?', type: 'textarea', help: 'Some brands, hotel groups and government bodies have formal standards.' },
    ],
  },
  {
    id: 'technical',
    title: 'Technical and legal',
    lede: "A few practical details. If you're not sure, say so and we'll find out.",
    note: "Please don't put passwords in this form. We'll ask for access securely once we start.",
    fields: [
      { id: 'domain_ideas', label: "If you don't have a domain yet, which names would you like us to check?", type: 'text', help: "We'll check availability and register it in your name." },
      { id: 'email_domain', label: 'Do you use email on your domain, like hello@yourbrand.com?', type: 'radio', opts: ['Yes, through Google Workspace', 'Yes, through Microsoft 365', 'Yes, through another provider', 'No'], help: 'We need to know this so your email keeps working when the new site goes live.' },
      { id: 'hosting', label: 'Where is the current website hosted?', type: 'text', show: is('project_type', 'A redesign of our existing website') },
      { id: 'eu_visitors', label: 'Do you get visitors or guests from the UK or EU?', type: 'radio', opts: [...YNS], help: 'If so, the site needs a cookie consent banner under their privacy laws.' },
      { id: 'legal_pages', label: 'Which legal pages do you already have?', type: 'checks', opts: ['Privacy policy', 'Terms and conditions', 'Booking or cancellation policy', 'Cookie policy', 'Shipping and returns', 'None yet'] },
      { id: 'legal_upload', label: 'Upload them here', type: 'file', category: 'Legal pages', show: not('legal_pages', 'None yet') },
      { id: 'footer_details', label: 'Business details for the footer', type: 'textarea', help: 'Registered name, address, phone, opening hours, company or licence number if required where you operate.' },
    ],
  },
  {
    id: 'seo',
    title: 'Search and discovery',
    lede: 'So the new site is built to be found from day one.',
    fields: [
      { id: 'search_terms', label: 'What would people type into Google or ChatGPT to find a business like yours?', type: 'textarea', ph: 'e.g. luxury villa Uluwatu, Greek restaurant Seminyak, sunset cruise Komodo' },
      { id: 'target_locations', label: 'Which locations do you want to be found for?', type: 'text' },
      { id: 'traffic_matters', label: 'Does the current site bring in meaningful traffic or bookings from Google?', type: 'radio', opts: ['Yes', 'A little', 'No', 'Not sure'], help: "If it does, we'll carefully carry over what's ranking so you don't lose it in the move.", show: is('project_type', 'A redesign of our existing website') },
      { id: 'blog_plan', label: 'Do you plan to publish articles or guides on the site?', type: 'radio', opts: ['Yes, regularly', 'Occasionally', 'No'] },
    ],
  },
  {
    id: 'after',
    title: 'Sign-off and after launch',
    lede: "How we'll approve the design, and who looks after the site once it's live.",
    fields: [
      { id: 'approver', label: 'Who signs off on the website design?', type: 'radio', opts: ['The main contact above', 'Someone else', 'A group (owners, partners, board)'] },
      { id: 'approver_detail', label: 'Name and role of everyone who needs to approve', type: 'textarea', help: 'Fewer decision-makers means faster rounds. If several people approve, tell us who has the final say.', show: not('approver', 'The main contact above') },
      { id: 'updates_who', label: 'Who will update the website after launch?', type: 'radio', opts: ['Asri', 'Your team', 'Both', 'Other'] },
      { id: 'updates_other', label: 'Who will it be?', type: 'text', show: is('updates_who', 'Other') },
      { id: 'update_freq', label: 'How often will things change?', type: 'radio', opts: ['Weekly, such as menus, events or offers', 'Monthly', 'Rarely'] },
      { id: 'training', label: 'Would you like training on how to edit the site?', type: 'radio', opts: ['Yes', 'No'], show: not('updates_who', 'Asri') },
      { id: 'care_plan', label: 'Are you interested in an ongoing plan covering hosting, updates, security and SEO?', type: 'radio', opts: ['Yes', 'Tell me more', 'No'] },
      { id: 'anything_else', label: 'Anything else we should know?', type: 'textarea' },
    ],
  },
];

/* ---------- how the form is laid out on screen ---------- */

/** The seven sections in three chapters, for the side list. */
export const CHAPTERS: { title: string; ids: string[] }[] = [
  { title: 'The idea', ids: ['project', 'inspiration'] },
  { title: 'What goes on the site', ids: ['content', 'features'] },
  { title: 'Behind the scenes', ids: ['technical', 'seo', 'after'] },
];

/** About 19 minutes in all; the brief promises 15 to 20, and most questions can be skipped. */
const MINUTES: Record<string, number> = { project: 3, inspiration: 4, content: 4, features: 3, technical: 2, seo: 1, after: 2 };

/** Questions of a section, in order, split into titled cards. Every question must appear in exactly one. */
const GROUPS: Record<string, [string, string[]][]> = {
  project: [
    ['Who we are building for', ['biz_name', 'contact_name', 'contact_email']],
    ['The project', ['project_type', 'current_keep', 'page_count', 'why_now']],
    ['What it should achieve', ['site_goals', 'primary_action', 'primary_other']],
    ['Timing', ['hard_deadline', 'deadline_date', 'deadline_reason']],
  ],
  inspiration: [
    ['Websites you love', ['refs', 'competitor_sites', 'dislike_sites']],
    ['The feel', ['feel_words', 'light_dark', 'image_text', 'motion']],
    ['Your own references', ['inspo_upload', 'inspo_link', 'inspo_notes']],
  ],
  content: [
    ['Photo and video', ['want_shoot', 'shoot_capture', 'shoot_type', 'shoot_timing']],
    ['Pages', ['pages', 'pages_other', 'sub_pages', 'sub_pages_detail']],
    ['Words and material', ['copy_owner', 'copy_upload', 'supporting', 'supporting_upload', 'new_assets']],
  ],
  features: [
    ['Booking and shop', ['booking', 'booking_system', 'booking_access', 'shop', 'shop_products', 'shop_ship', 'payments']],
    ['What the site does', ['features', 'features_other', 'form_routing']],
    ['Languages and currency', ['multilingual', 'languages', 'currencies']],
    ['Systems and access', ['integrations', 'accessibility']],
  ],
  technical: [
    ['Domain and email', ['domain_ideas', 'email_domain', 'hosting']],
    ['Legal', ['eu_visitors', 'legal_pages', 'legal_upload', 'footer_details']],
  ],
  seo: [['Being found', ['search_terms', 'target_locations', 'traffic_matters', 'blog_plan']]],
  after: [
    ['Sign-off', ['approver', 'approver_detail']],
    ['After launch', ['updates_who', 'updates_other', 'update_freq', 'training', 'care_plan']],
    ['Before you send', ['anything_else']],
  ],
};

applyLayout(sections, MINUTES, GROUPS);

const form = makeForm(sections, 'Website brief');
export const fields = form.fields;
export const makeGetter = form.makeGetter;
export const collectAnswers = form.collectAnswers;
export const answersAsText = form.answersAsText;

/* ---------- follow-ups for the team ---------- */

/**
 * What the team should do next, read off the answers. Stored with the brief
 * and never shown to the client: it is written for us.
 */
export function followUps(get: Getter): FollowUp[] {
  const out: FollowUp[] = [];
  const add = (kind: FollowUp['kind'], text: string) => out.push({ kind, text });
  const v = (id: string) => get(id);
  const inc = (id: string, val: string) => {
    const x = get(id);
    return Array.isArray(x) ? (x as string[]).includes(val) : x === val;
  };

  add('note', "Read this alongside the client's profile for brand files, domain, analytics and account access.");
  if (inc('project_type', 'A redesign of our existing website')) {
    add('setup', 'Redesign. Crawl the current site and build a redirect map before launch.');
    if (!inc('traffic_matters', 'No')) add('check', 'Current site may have rankings to protect. Pull Search Console data before changing URLs.');
  }
  if (inc('hard_deadline', "Yes, it's tied to an opening, event or campaign")) add('check', `Fixed deadline: ${v('deadline_date') || 'date not given'} (${v('deadline_reason') || 'reason not given'}). Check it against our standard timeline and quote a rush fee if needed.`);
  if (hasValue(v('domain_ideas'))) add('setup', `Domain to register: check ${v('domain_ideas')} and register in the client's name.`);
  if (v('email_domain') && !inc('email_domain', 'No')) add('check', 'Email runs on the domain. Copy the MX and email records before touching DNS.');
  if (inc('copy_owner', "We'll write it ourselves") || inc('copy_owner', "We'll provide it and Asri polishes it")) add('check', 'Client is supplying copy. Set a hard content deadline. This is the most common cause of delay.');
  if (inc('copy_owner', 'Asri writes everything')) add('note', 'Asri writing all copy. Include it in the quote.');
  if (inc('want_shoot', "Yes, it's part of our package")) add('setup', 'Website shoot in scope. Brief production from the shot list and schedule it before design is finalised.');
  if (inc('want_shoot', "We'd like a quote") || inc('want_shoot', 'Not sure yet')) add('note', 'Shoot not confirmed. Send a production quote.');
  if (inc('booking', 'Yes')) add('check', `Booking integration: ${v('booking_system') || 'system not named'}. Confirm embed or API options${inc('booking_access', 'Yes') ? '' : ' and get admin access'}.`);
  if (inc('shop', 'Yes')) add('note', 'Ecommerce needed. Scope products, payments and shipping.');
  if (inc('multilingual', 'Yes')) add('note', `Multilingual site: ${v('languages') || 'languages not given'}. Confirm who translates.`);
  if (inc('eu_visitors', 'Yes') || inc('eu_visitors', 'Not sure')) add('setup', 'UK or EU visitors. Add cookie consent.');
  if (inc('legal_pages', 'None yet')) add('setup', 'No legal pages. Client needs a privacy policy at minimum.');
  if (inc('approver', 'A group (owners, partners, board)')) add('check', 'Several approvers. Agree who has the final say before the first design round.');
  if (inc('care_plan', 'Yes') || inc('care_plan', 'Tell me more')) add('note', 'Interested in an ongoing care plan. Include it in the proposal.');
  return out;
}

export const config: FormConfig = {
  id: 'website_brief',
  title: 'Website brief',
  sub: 'It takes around 15 to 20 minutes, and most questions are optional. Your answers are saved on this device as you go, so you can stop and come back.',
  noun: 'brief',
  storeKey: 'asri-website-brief-v1',
  sections,
  fields,
  chapters: CHAPTERS,
  exclusive: { legal_pages: 'None yet' },
  followUps,
  makeGetter,
  collectAnswers,
  answersAsText,
  doneFields: ['biz_name', 'contact_name', 'contact_email', 'project_type', 'primary_action'],
};

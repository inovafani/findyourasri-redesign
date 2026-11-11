'use client';

import { useState } from 'react';

import './social-calendar.css';

const IMG = '/madoonna-social-proposal';

type Phase = 'Tease' | 'Reveal' | 'Build-up' | 'Countdown';
type Pillar = 'People & energy' | 'World-building' | 'Food & craft' | 'Behind the scenes';
type Post = { id: number; date: string; week: string; phase: Phase; format: string; pillar: Pillar; post: string; hook: string; cta: string; note?: string };

const posts: Post[] = [
  { id: 1, date: 'Tue 1 Dec', week: 'Week 1 · Tease', phase: 'Tease', format: 'Reel', pillar: 'People & energy', post: 'Coming-soon Reel 1 (photo progression)', hook: 'from happy hour to dancing into the night', cta: 'Waitlist in bio', note: 'Pin this post.' },
  { id: 2, date: 'Thu 3 Dec', week: 'Week 1 · Tease', phase: 'Tease', format: 'Carousel', pillar: 'Food & craft', post: 'Meet ONNÀ: golden-hour dining, show dinners, cocktails', hook: 'This is ONNÀ', cta: 'Follow for opening news' },
  { id: 3, date: 'Sat 5 Dec', week: 'Week 1 · Tease', phase: 'Tease', format: 'Carousel', pillar: 'People & energy', post: 'Meet MADÒ: members club, VIP tables, bottle service, late nights', hook: 'This is MADÒ', cta: 'Join the waitlist' },
  { id: 4, date: 'Sun 6 Dec', week: 'Week 1 · Tease', phase: 'Tease', format: 'Static', pillar: 'World-building', post: 'Brand artwork', hook: 'Dinner to dancing, all under one roof', cta: 'Share with your table' },
  { id: 5, date: 'Tue 8 Dec', week: 'Week 2 · Reveal', phase: 'Reveal', format: 'Reel', pillar: 'People & energy', post: 'Coming-soon Reel 2 (video progression)', hook: 'Start at the table. End up dancing on it.', cta: 'Waitlist in bio', note: 'Pin this post.' },
  { id: 6, date: 'Thu 10 Dec', week: 'Week 2 · Reveal', phase: 'Reveal', format: 'Carousel', pillar: 'Food & craft', post: 'Menu teaser: 4-5 Mediterranean dishes', hook: 'First look at the menu', cta: 'Save for later' },
  { id: 7, date: 'Sat 12 Dec', week: 'Week 2 · Reveal', phase: 'Reveal', format: 'Reel', pillar: 'Behind the scenes', post: 'The venue coming together: build, team, fit-out', hook: 'Building something in Berawa', cta: 'Follow for opening news' },
  { id: 8, date: 'Sun 13 Dec', week: 'Week 2 · Reveal', phase: 'Reveal', format: 'Static', pillar: 'World-building', post: 'MADÒ membership: what members get, how to apply', hook: 'Not everyone gets in', cta: 'Apply for the waitlist', note: 'Pin this post.' },
  { id: 9, date: 'Tue 15 Dec', week: 'Week 3 · Build-up', phase: 'Build-up', format: 'Reel', pillar: 'People & energy', post: 'Show-dinner teaser: performer rehearsal or concept', hook: 'Dinner comes with a show', cta: 'Waitlist in bio' },
  { id: 10, date: 'Thu 17 Dec', week: 'Week 3 · Build-up', phase: 'Build-up', format: 'Carousel', pillar: 'Food & craft', post: '3 signature cocktails, one per slide', hook: 'Your first round', cta: 'Save for later' },
  { id: 11, date: 'Sat 19 Dec', week: 'Week 3 · Build-up', phase: 'Build-up', format: 'Reel (collab)', pillar: 'Behind the scenes', post: 'Meet the chef, posted as a collab with the chef', hook: 'Meet the chef', cta: 'Follow both accounts', note: 'Depends on the chef being confirmed.' },
  { id: 12, date: 'Sun 20 Dec', week: 'Week 3 · Build-up', phase: 'Build-up', format: 'Static', pillar: 'World-building', post: 'January programming preview (Desa Kitsuné style)', hook: "What's coming in January", cta: 'Save the dates' },
  { id: 13, date: 'Tue 22 Dec', week: 'Week 4 · Build-up', phase: 'Build-up', format: 'Reel (collab)', pillar: 'People & energy', post: 'Meet the resident DJ, posted as a collab with the DJ', hook: 'The sound of MADÒ', cta: 'Follow both accounts', note: 'Depends on the DJ being confirmed.' },
  { id: 14, date: 'Thu 24 Dec', week: 'Week 4 · Build-up', phase: 'Build-up', format: 'Static', pillar: 'World-building', post: 'Seasonal series reveal: first named themed series, festive artwork in the brand system', hook: 'Long dinners. Later nights.', cta: 'Save the dates', note: 'Series name and drinks sponsor TBC.' },
  { id: 15, date: 'Sun 27 Dec', week: 'Week 4 · Build-up', phase: 'Build-up', format: 'Carousel', pillar: 'Behind the scenes', post: 'Shoot day BTS from the first content shoot', hook: 'Behind the first shoot', cta: 'Follow for opening news' },
  { id: 16, date: 'Tue 29 Dec', week: 'Week 5 · Countdown', phase: 'Countdown', format: 'Reel', pillar: 'People & energy', post: 'Year-end teaser: one night, dinner to dancing, cut to black', hook: '2027 starts at the table', cta: 'Waitlist in bio' },
  { id: 17, date: 'Thu 31 Dec', week: 'Week 5 · Countdown', phase: 'Countdown', format: 'Static', pillar: 'World-building', post: 'NYE artwork + opening date reveal (if confirmed)', hook: 'See you in the new year', cta: 'Join the waitlist' },
];

const weeks = ['Week 1 · Tease', 'Week 2 · Reveal', 'Week 3 · Build-up', 'Week 4 · Build-up', 'Week 5 · Countdown'];
const phases = ['All', 'Tease', 'Reveal', 'Build-up', 'Countdown'];
const pillars = ['All', 'People & energy', 'World-building', 'Food & craft', 'Behind the scenes'];

type Scene = { scene: string; overlay: string; direction: string };

const reel1: Scene[] = [
  { scene: 'Table with starters in daylight', overlay: 'from happy hour', direction: 'Top-down or 45°, natural light, linen, olive oil, bread, bright whites' },
  { scene: 'Main course', overlay: '', direction: 'Mediterranean plates, hands reaching in, sharing style' },
  { scene: 'Drinks at sunset', overlay: 'to golden hour', direction: 'Cocktails backlit by the sunset, orange and amber tones' },
  { scene: 'Dancers and cocktail lounge', overlay: 'to show time', direction: 'Performers in costume among the tables, low warm light' },
  { scene: 'Nightclub', overlay: 'to dancing into the night', direction: 'Crowd, flash photography, hands up, deep red and black' },
  { scene: 'End card', overlay: 'all at one place', direction: 'Black screen, overlay holds 1 s' },
  { scene: 'Name reveal', overlay: 'COMING SOON', direction: '"MADÒ" flashes up first, then "ONNÀ" lands beside it, then "COMING SOON" below' },
];

const reel2: Scene[] = [
  { scene: 'Wine poured at a daylit table', overlay: 'start at the table', direction: 'Slow pour, close-up, natural sound' },
  { scene: 'Plates landing, people laughing', overlay: '', direction: 'Handheld, warm, real moments' },
  { scene: 'Cocktail shaken, sunset behind', overlay: 'stay for the sunset', direction: 'Bartender at work, silhouette against the sky' },
  { scene: 'Performer moving between tables', overlay: 'stay for the show', direction: 'Slow motion, candlelight' },
  { scene: 'Guests dancing on and around tables', overlay: 'end up dancing on it', direction: 'Fast cuts, the client\'s "show-dinner energy" moment' },
  { scene: 'DJ booth and club crowd', overlay: '', direction: 'Strobe, low angle' },
  { scene: 'Name reveal', overlay: 'COMING SOON', direction: 'Same end card as Reel 1, so both reels read as a set' },
];

const caption1 =
  'Starters in the sun. Mains as it sets. Cocktails, dancers, then the lights go down.\n\nMADÒ ONNÀ, dinner to dancing under one roof in Berawa. Coming soon.\n\nJoin the MADÒ waitlist through the link in bio.';
const caption2 =
  'Start at the table. End up dancing on it. 🍸\nONNÀ for show dinners and cocktails. MADÒ for after dark. Opening soon in Berawa, Canggu.\n\nWaitlist in bio.';

const storyRhythm = [
  { day: 'Post days', plan: 'Reshare the feed post plus a link sticker to the waitlist or reservations' },
  { day: 'Mon', plan: 'Poll: "Dinner first or straight to the dance floor?"' },
  { day: 'Wed', plan: 'BTS clip from the venue or team (phone footage is fine)' },
  { day: 'Fri', plan: '"This or that" on dishes or cocktails from the menu teasers' },
  { day: 'Sat', plan: 'Countdown sticker to the opening (once the date is set)' },
];

function Facts({ items }: { items: [string, string][] }) {
  return (
    <dl className="msp-facts">
      {items.map(([k, v]) => (
        <div key={k}>
          <dt>{k}</dt>
          <dd>{v}</dd>
        </div>
      ))}
    </dl>
  );
}

function Steps({ items, numbered }: { items: { name: string; detail: string; value?: string }[]; numbered?: boolean }) {
  const List = numbered ? 'ol' : 'ul';
  return (
    <List className={'msp-steps' + (numbered ? ' is-numbered' : '')}>
      {items.map((s) => (
        <li key={s.name}>
          <div>
            <strong>{s.name}</strong>
            <span>{s.detail}</span>
          </div>
          {s.value ? <em>{s.value}</em> : null}
        </li>
      ))}
    </List>
  );
}

function Caption({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // Clipboard blocked (insecure origin or denied): the caption stays selectable above.
    }
  };
  return (
    <div className="msp-caption">
      <p>{text}</p>
      <button type="button" className="msp-copy" onClick={copy}>
        <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          {copied ? (
            <path d="M20 6 9 17l-5-5" />
          ) : (
            <>
              <rect x="8" y="8" width="14" height="14" rx="2" />
              <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
            </>
          )}
        </svg>
        {copied ? 'Copied' : 'Copy caption'}
      </button>
    </div>
  );
}

function Filter({ label, options, value, onChange }: { label: string; options: string[]; value: string; onChange: (v: string) => void }) {
  return (
    <div className="msp-filter" role="group" aria-label={label}>
      <span>{label}</span>
      <div>
        {options.map((o) => (
          <button key={o} type="button" aria-pressed={value === o} onClick={() => onChange(o)}>
            {o}
          </button>
        ))}
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="msp-section">
      <h2>{title}</h2>
      {children}
    </section>
  );
}

export default function SocialCalendar() {
  const [phase, setPhase] = useState('All');
  const [pillar, setPillar] = useState('All');
  const [open, setOpen] = useState<number | null>(null);
  const visible = posts.filter((p) => (phase === 'All' || p.phase === phase) && (pillar === 'All' || p.pillar === pillar));

  return (
    <div className="msp">
      <div className="msp-wrap">
        <header className="msp-head">
          <h1>MADÒ ONNÀ: December social calendar</h1>
          <p className="msp-fact">Draft</p>
          <p className="msp-intro">
            17 feed posts plus daily stories, moving from tease to reveal to countdown. Every post points to the MADÒ waitlist or ONNÀ
            reservations.
          </p>
        </header>

        <div className="msp-hero">
          <img src={`${IMG}/logo-gold.png`} alt="MADÒ ONNÀ logo" width={700} height={881} />
          <p className="msp-hero-line">Dinner to dancing, all under one roof</p>
          <p className="msp-hero-sub">Berawa, Canggu · Coming soon</p>
        </div>

        <figure className="msp-figure">
          <img src={`${IMG}/club-render.jpg`} alt="Concept render of the MADÒ club room with arched DJ booth" width={1536} height={1024} />
          <figcaption>
            Concept visual. Concept renders show what the venue will really look like and carry this label until the shoot delivers real venue
            content.
          </figcaption>
        </figure>

        <Section title="The plan">
          <Facts
            items={[
              ['Cadence', '4 feed posts a week, reels-first; 5 a week plus daily stories from countdown week'],
              ['Pillar mix', 'People & energy 35% · world-building 25% · food & craft 20% · behind the scenes 20%'],
              ['Posting time', '6-7 pm WITA for reels, when Bali dinner plans get made'],
              ['Starting point', '9 grid posts already live (MADÒ / MADÒ ONNÀ / ONNÀ layout)'],
              ['One account, two worlds', 'ONNÀ posts live in golden hour; MADÒ posts live after dark'],
              ['CTA rule', '"Waitlist in bio" only once the waitlist link is live; until then "Follow for opening news"'],
            ]}
          />
          <aside className="msp-callout is-warning">
            <strong>Opening date still TBC</strong>
            <p>
              This draft assumes opening lands in early January. If it lands in December, weeks 3-4 switch to the opening-week collab blitz, the
              January preview becomes December programming, and the NYE post becomes an NYE night.
            </p>
          </aside>
        </Section>

        <Section title="Coming-soon reels">
          <p className="msp-body">
            Two reels tell the same story, daylight dinner to late-night club, one with photos and one with video. Both end on the name reveal:
            MADÒ, then ONNÀ beside it.
          </p>

          <h3 className="msp-sub">
            Reel 1: &ldquo;Happy hour to late night&rdquo;
            <span>Photo progression · 10-12 s · photos cut on the beat, 0.4-0.6 s each</span>
          </h3>
          <Steps numbered items={reel1.map((s) => ({ name: s.scene, detail: s.direction, value: s.overlay }))} />
          <Caption text={caption1} />

          <h3 className="msp-sub">
            Reel 2: &ldquo;Start at the table&rdquo;
            <span>Video progression · 12-15 s · clips of 1-2 s each</span>
          </h3>
          <Steps numbered items={reel2.map((s) => ({ name: s.scene, detail: s.direction, value: s.overlay }))} />
          <Caption text={caption2} />

          <aside className="msp-callout is-note">
            <strong>Footage note</strong>
            <p>
              Until the content shoot, both reels use labelled concept visuals. Reel 2 needs real or stock video, so it may move to after the
              shoot. Both reels may move to late November.
            </p>
          </aside>
        </Section>

        <Section title="The 17 posts">
          <p className="msp-body">Filter by phase or pillar. Tap a post for its hook, CTA and notes.</p>
          <Filter label="Phase" options={phases} value={phase} onChange={setPhase} />
          <Filter label="Pillar" options={pillars} value={pillar} onChange={setPillar} />
          <p className="msp-small" aria-live="polite">
            Showing {visible.length} of {posts.length} posts
          </p>

          {weeks.map((week) => {
            const wk = visible.filter((p) => p.week === week);
            if (wk.length === 0) return null;
            return (
              <div className="msp-week" key={week}>
                <h3 className="msp-week-title">{week}</h3>
                <div className="msp-grid">
                  {wk.map((p) => {
                    const isOpen = open === p.id;
                    return (
                      <div className={'msp-card' + (isOpen ? ' is-open' : '')} key={p.id}>
                        <button type="button" className="msp-card-head" aria-expanded={isOpen} onClick={() => setOpen(isOpen ? null : p.id)}>
                          <span className="msp-card-date">{p.date}</span>
                          <span className={'msp-pill msp-phase-' + p.phase.toLowerCase().replace('-', '')}>{p.phase}</span>
                          <span className="msp-pill">{p.format}</span>
                          <span className="msp-card-name">{p.post}</span>
                        </button>
                        {isOpen ? (
                          <dl className="msp-card-body">
                            <div>
                              <dt>Hook</dt>
                              <dd>{p.hook}</dd>
                            </div>
                            <div>
                              <dt>CTA</dt>
                              <dd>{p.cta}</dd>
                            </div>
                            <div>
                              <dt>Pillar</dt>
                              <dd>{p.pillar}</dd>
                            </div>
                            {p.note ? (
                              <div>
                                <dt>Note</dt>
                                <dd>{p.note}</dd>
                              </div>
                            ) : null}
                          </dl>
                        ) : null}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </Section>

        <Section title="Stories and highlights">
          <p className="msp-body">
            Post 1-3 stories every day. Reshare each feed post, then add one interactive frame so the waitlist keeps growing between posts.
          </p>
          <Steps items={storyRhythm.map((s) => ({ name: s.day, detail: s.plan }))} />
          <Facts
            items={[
              ['Highlight covers', 'ONNÀ · MADÒ · Menu · Membership · BTS, same type and colour system as the grid'],
              ['At opening', 'Add "This Week" and "Reservations"'],
            ]}
          />
        </Section>

        <Section title="Where the grid stands">
          <figure className="msp-figure">
            <div className="msp-pair">
              <img src={`${IMG}/grid-now.jpg`} alt="The nine live MADÒ ONNÀ grid posts" width={909} height={1287} loading="lazy" />
              <img src={`${IMG}/onna-membership.jpg`} alt="ONNÀ membership box concept visual" width={1402} height={1122} loading="lazy" />
            </div>
            <figcaption>Left: the nine live grid posts. Right: ONNÀ membership concept visual.</figcaption>
          </figure>
        </Section>

        <p className="msp-source">
          Source: MADÒ ONNÀ December 2026 social calendar (draft), 11 Nov 2026. Nothing is scheduled or posted from this page.
        </p>
      </div>
    </div>
  );
}

'use client';

/**
 * MADÒ ONNÀ December social calendar, behind a password. The page text and images live only in
 * public/portal-data/madoonna-social-proposal/ as AES-GCM ciphertext (same format and lock as PortalApp), built by
 * scripts/encrypt-madoonna-social-proposal.mjs from the gitignored _src/madoonna-social-proposal/.
 */
import { useCallback, useEffect, useState } from 'react';

import { b64, deriveKey, Lock, openBlob, toB64, type Meta } from '@/components/portal/PortalApp';

import './social-calendar.css';

const BASE = '/portal-data/madoonna-social-proposal';
const SESSION_KEY = 'asri-madoonna-social-proposal-key';

type Pair = [string, string];
type Scene = { scene: string; overlay: string; direction: string };
type Post = { id: number; date: string; week: string; phase: string; format: string; pillar: string; post: string; hook: string; cta: string; note?: string };
type Content = {
  title: string;
  fact: string;
  intro: string;
  hero: { logo: string; alt: string; line: string; sub: string };
  render: { src: string; alt: string; caption: string };
  plan: { facts: Pair[]; callout: { title: string; body: string } };
  reels: { intro: string; items: { title: string; sub: string; scenes: Scene[]; caption: string }[]; note: { title: string; body: string } };
  posts: { intro: string; list: Post[] };
  stories: { intro: string; rhythm: { day: string; plan: string }[]; facts: Pair[] };
  grid: { items: { src: string; alt: string }[]; caption: string };
  source: string;
  images: Record<string, string>;
};

const phases = ['All', 'Tease', 'Reveal', 'Build-up', 'Countdown'];
const pillars = ['All', 'People & energy', 'World-building', 'Food & craft', 'Behind the scenes'];

function Facts({ items }: { items: Pair[] }) {
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

function Calendar({ c }: { c: Content }) {
  const [phase, setPhase] = useState('All');
  const [pillar, setPillar] = useState('All');
  const [open, setOpen] = useState<number | null>(null);
  const posts = c.posts.list;
  const weeks = [...new Set(posts.map((p) => p.week))];
  const visible = posts.filter((p) => (phase === 'All' || p.phase === phase) && (pillar === 'All' || p.pillar === pillar));

  return (
    <div className="msp">
      <div className="msp-wrap">
        <header className="msp-head">
          <h1>{c.title}</h1>
          <p className="msp-fact">{c.fact}</p>
          <p className="msp-intro">{c.intro}</p>
        </header>

        <div className="msp-hero">
          <img src={c.images[c.hero.logo]} alt={c.hero.alt} width={700} height={881} />
          <p className="msp-hero-line">{c.hero.line}</p>
          <p className="msp-hero-sub">{c.hero.sub}</p>
        </div>

        <figure className="msp-figure">
          <img src={c.images[c.render.src]} alt={c.render.alt} width={1536} height={1024} />
          <figcaption>{c.render.caption}</figcaption>
        </figure>

        <Section title="The plan">
          <Facts items={c.plan.facts} />
          <aside className="msp-callout is-warning">
            <strong>{c.plan.callout.title}</strong>
            <p>{c.plan.callout.body}</p>
          </aside>
        </Section>

        <Section title="Coming-soon reels">
          <p className="msp-body">{c.reels.intro}</p>
          {c.reels.items.map((r) => (
            <div key={r.title}>
              <h3 className="msp-sub">
                {r.title}
                <span>{r.sub}</span>
              </h3>
              <Steps numbered items={r.scenes.map((s) => ({ name: s.scene, detail: s.direction, value: s.overlay }))} />
              <Caption text={r.caption} />
            </div>
          ))}
          <aside className="msp-callout is-note">
            <strong>{c.reels.note.title}</strong>
            <p>{c.reels.note.body}</p>
          </aside>
        </Section>

        <Section title={`The ${posts.length} posts`}>
          <p className="msp-body">{c.posts.intro}</p>
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
          <p className="msp-body">{c.stories.intro}</p>
          <Steps items={c.stories.rhythm.map((s) => ({ name: s.day, detail: s.plan }))} />
          <Facts items={c.stories.facts} />
        </Section>

        <Section title="Where the grid stands">
          <figure className="msp-figure">
            <div className="msp-pair">
              {c.grid.items.map((i) => (
                <img key={i.src} src={c.images[i.src]} alt={i.alt} />
              ))}
            </div>
            <figcaption>{c.grid.caption}</figcaption>
          </figure>
        </Section>

        <p className="msp-source">{c.source}</p>
      </div>
    </div>
  );
}

export default function SocialCalendar() {
  const [content, setContent] = useState<Content | null>(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const unlock = useCallback(async (key: CryptoKey) => {
    const buf = await fetch(`${BASE}/payload.bin`, { cache: 'no-store' }).then((r) => r.arrayBuffer());
    const plain = await openBlob(key, buf);
    setContent(JSON.parse(new TextDecoder().decode(plain)) as Content);
    try {
      sessionStorage.setItem(SESSION_KEY, toB64(new Uint8Array(await crypto.subtle.exportKey('raw', key))));
    } catch {
      /* storage may be blocked; the reader types the password again next time */
    }
  }, []);

  const onPassword = useCallback(
    async (pw: string) => {
      setBusy(true);
      setError('');
      try {
        const meta: Meta = await fetch(`${BASE}/meta.json`, { cache: 'no-store' }).then((r) => r.json());
        await unlock(await deriveKey(pw, meta));
      } catch {
        setError('That password did not open the page. Check it and try again.');
      } finally {
        setBusy(false);
      }
    },
    [unlock],
  );

  // A reload in the same browser session opens straight away.
  useEffect(() => {
    let raw: string | null = null;
    try {
      raw = sessionStorage.getItem(SESSION_KEY);
    } catch {
      raw = null;
    }
    if (!raw) return;
    crypto.subtle
      .importKey('raw', b64(raw), 'AES-GCM', true, ['decrypt'])
      .then(unlock)
      .catch(() => {
        try {
          sessionStorage.removeItem(SESSION_KEY);
        } catch {
          /* ignore */
        }
      });
  }, [unlock]);

  return content ? <Calendar c={content} /> : <Lock onOpen={onPassword} error={error} busy={busy} />;
}

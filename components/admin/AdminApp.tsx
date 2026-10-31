'use client';

import Link from 'next/link';
import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react';

import { formatAnswer, hasValue, type Answer } from '@/lib/forms/engine';

import { FORMS, typeOf, type FormType } from './forms';

import './admin.css';

/**
 * The team's view of everything clients have sent, at /admin/: client profiles and website briefs.
 *
 * The site is a static export, so this page holds no data. It signs in with a
 * Supabase Auth account (email and password, created in the dashboard), then
 * asks the client-profile Edge Function for the list and for each submission. The
 * function checks the token and the ADMIN_EMAILS list on every request, so
 * nothing here is the lock: it only shows what the function agrees to send.
 */

const API = process.env.NEXT_PUBLIC_CLIENT_PROFILE_API ?? '';
const STORE = 'asri-admin-session';
const CONFIG_STORE = 'asri-admin-config';
const LAYOUT_STORE = 'asri-admin-layout';
const SEEN_STORE = 'asri-admin-seen';
const KIND_STORE = 'asri-admin-kind';
/** A profile opened in the last 20 minutes is shown again at once. Its file links last an hour. */
const DETAIL_TTL = 20 * 60_000;
/** Coming back to the list shows it as it was, and refreshes it quietly if it is older than this. */
const LIST_TTL = 60_000;
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

type Config = { url: string; anonKey: string };
type Session = { access: string; refresh: string; expires: number; email: string };
type Row = {
  id: string;
  business_name: string;
  contact_name: string;
  contact_email: string;
  country: string | null;
  sector: string | null;
  services: string[];
  budget: string | null;
  /** Which form it came from. Missing on rows saved before the column existed: those are client profiles. */
  form_type?: FormType;
  /** Pulled out of the answers of a website brief for the list; empty for client profiles. */
  project_type?: string | null;
  primary_action?: string | null;
  submitted_at: string;
  client_files: { count: number }[];
  followups?: { kind: string; text: string }[];
};
type Profile = Row & {
  answers: Record<string, Answer>;
  followups: { kind: string; text: string }[];
  source: Record<string, string>;
};
type FileRow = { path: string; name: string; size: number; category: string; field?: string | null; url: string | null; thumb?: string | null };
type Detail = { profile: Profile; files: FileRow[] };

/** For files saved before the field was recorded: the question their category most likely came from. */
const CATEGORY_FIELD: Record<string, string> = {
  'Brand guidelines': 'guidelines_file',
  Logo: 'logo_files',
  Photos: 'photo_upload',
  Inspiration: 'inspo_upload',
  'Website copy': 'copy_upload',
  'Supporting content': 'supporting_upload',
  'Legal pages': 'legal_upload',
  Renderings: 'renders_upload',
  'Menu or price list': 'other_upload',
  'Press kit': 'other_upload',
  Other: 'other_upload',
};
const fieldOf = (f: FileRow) => f.field || CATEGORY_FIELD[f.category] || '';

class SignInError extends Error {}

/** The clock, read outside the component body (it is only ever used in event handlers and loaders). */
const now = () => Date.now();

const date = (iso: string) => new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
const megabytes = (n: number) => (n >= 1024 * 1024 ? `${(n / 1024 / 1024).toFixed(1)} MB` : `${Math.max(1, Math.round(n / 1024))} KB`);
const isImage = (name: string) => /\.(png|jpe?g|webp|gif|svg)$/i.test(name);
const ref = (id: string) => `ASRI-${id.slice(0, 8).toUpperCase()}`;

const filesOf = (r: Row) => r.client_files?.[0]?.count ?? 0;
const setupOf = (r: Row) => (r.followups ?? []).filter((f) => f.kind === 'setup').length;
const sectorOf = (r: Row) => (r.sector ?? '').split(' (')[0];
/** The line under the name in the list: the sector of a client profile, the kind of project of a website brief. */
const aboutOf = (r: Row) => (typeOf(r) === 'website_brief' ? r.project_type || '' : [sectorOf(r), r.country].filter(Boolean).join(' · '));
/** The same client sending the other form: same email, or the same business name. */
const sameClient = (a: Row, b: Row) =>
  a.contact_email.trim().toLowerCase() === b.contact_email.trim().toLowerCase() || a.business_name.trim().toLowerCase() === b.business_name.trim().toLowerCase();
const initials = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]!.toUpperCase())
    .join('') || '?';

/** "just now", "3 days ago", "2 weeks ago": how long ago, in the biggest unit that fits. */
function ago(iso: string) {
  const mins = Math.max(0, Math.round((now() - Date.parse(iso)) / 60_000));
  if (mins < 2) return 'just now';
  if (mins < 60) return `${mins} minutes ago`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? '' : 's'} ago`;
  const days = Math.round(hours / 24);
  if (days < 14) return `${days} day${days === 1 ? '' : 's'} ago`;
  if (days < 60) return `${Math.round(days / 7)} weeks ago`;
  return `${Math.round(days / 30)} months ago`;
}

async function post(body: Record<string, unknown>, token?: string) {
  const res = await fetch(API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  return { status: res.status, data };
}

async function tokenRequest(cfg: Config, grant: 'password' | 'refresh_token', payload: Record<string, string>): Promise<Session> {
  const res = await fetch(`${cfg.url}/auth/v1/token?grant_type=${grant}`, {
    method: 'POST',
    headers: { apikey: cfg.anonKey, 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || !data.access_token) {
    throw new SignInError(grant === 'password' ? 'That email and password do not match.' : 'Your session ended. Sign in again.');
  }
  return {
    access: data.access_token,
    refresh: data.refresh_token,
    expires: Date.now() + (data.expires_in ?? 3600) * 1000,
    email: data.user?.email ?? payload.email ?? '',
  };
}

export default function AdminApp() {
  const [phase, setPhase] = useState<'loading' | 'out' | 'in'>('loading');
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  const [rows, setRows] = useState<Row[] | null>(null);
  const [selected, setSelected] = useState('');
  const [detail, setDetail] = useState<{ profile: Profile; files: FileRow[] } | null>(null);
  const [query, setQuery] = useState('');
  const [copied, setCopied] = useState('');
  const [email, setEmail] = useState('');
  const [ready, setReady] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const [layout, setLayout] = useState<'split' | 'list'>('split');
  const [kind, setKind] = useState<'all' | FormType>('all');
  const [seen, setSeen] = useState<string[]>([]);
  const config = useRef<Config | null>(null);
  const configLoad = useRef<Promise<Config | null> | null>(null);
  const listAt = useRef(0);
  const details = useRef(new Map<string, Detail & { at: number }>());
  const inflight = useRef(new Map<string, Promise<Detail & { at: number }>>());
  const session = useRef<Session | null>(null);

  function remember(next: Session | null) {
    session.current = next;
    setEmail(next?.email ?? '');
    try {
      if (next) localStorage.setItem(STORE, JSON.stringify(next));
      else localStorage.removeItem(STORE);
    } catch {
      // Storage can be blocked; you just sign in again next time.
    }
  }

  function signOut(why = '') {
    remember(null);
    details.current.clear();
    inflight.current.clear();
    listAt.current = 0;
    setRows(null);
    setDetail(null);
    setSelected('');
    setMessage(why);
    setPhase('out');
  }

  /** A token that is good for at least another minute, refreshed when it is not. */
  async function freshToken() {
    const s = session.current;
    if (!s) throw new SignInError('Sign in to continue.');
    if (s.expires - 60_000 > now()) return s.access;
    if (!config.current) await loadConfig();
    if (!config.current) throw new SignInError('Sign in to continue.');
    const next = await tokenRequest(config.current, 'refresh_token', { refresh_token: s.refresh });
    remember({ ...next, email: next.email || s.email });
    return next.access;
  }

  async function admin(action: string, extra: Record<string, unknown> = {}) {
    const { status, data } = await post({ action, ...extra }, await freshToken());
    if (status === 401) throw new SignInError('Your session ended. Sign in again.');
    if (status === 403) {
      throw new SignInError(data.error === 'admin_not_configured' ? 'The admin list has not been set up yet.' : 'That account is not on the admin list.');
    }
    if (status >= 400) throw new Error(data.error ?? 'server');
    return data;
  }

  /** The project's sign-in address, from the function. Asked once, and remembered in this browser for next time. */
  function loadConfig(): Promise<Config | null> {
    if (!configLoad.current) {
      configLoad.current = post({ action: 'config' })
        .then(({ data }) => {
          if (!data.url || !data.anonKey) return null;
          config.current = data as Config;
          setReady(true);
          try {
            localStorage.setItem(CONFIG_STORE, JSON.stringify(data));
          } catch {
            // Fine: it is fetched again next time.
          }
          return config.current;
        })
        .catch(() => null);
    }
    return configLoad.current;
  }

  /** `quiet` refreshes behind the scenes: the list on screen stays, with no flash and no error banner. */
  async function loadList(quiet = false) {
    if (quiet) setRefreshing(true);
    try {
      const data = await admin('admin-list');
      setRows(data.profiles as Row[]);
      listAt.current = now();
      setMessage('');
    } catch (e) {
      if (e instanceof SignInError) signOut(e.message);
      else if (!quiet) setMessage('The list did not load. Try again in a moment.');
    } finally {
      setRefreshing(false);
    }
  }

  /** One profile, from memory when it was opened recently, and never asked for twice at the same time. */
  function fetchDetail(id: string): Promise<Detail & { at: number }> {
    const hit = details.current.get(id);
    if (hit && now() - hit.at < DETAIL_TTL) return Promise.resolve(hit);
    let pending = inflight.current.get(id);
    if (!pending) {
      pending = admin('admin-get', { id })
        .then((data) => {
          const value = { profile: data.profile as Profile, files: data.files as FileRow[], at: now() };
          details.current.set(id, value);
          return value;
        })
        .finally(() => inflight.current.delete(id));
      inflight.current.set(id, pending);
    }
    return pending;
  }

  async function loadDetail(id: string) {
    const hit = details.current.get(id);
    const stillOpen = () => window.location.hash.replace('#', '') === id;
    if (hit && now() - hit.at < DETAIL_TTL) {
      setDetail(hit);
      setMessage('');
      markSeen(id);
      return;
    }
    setDetail(null);
    try {
      const value = await fetchDetail(id);
      if (stillOpen()) {
        setDetail(value);
        setMessage('');
        markSeen(id);
      }
    } catch (e) {
      if (e instanceof SignInError) signOut(e.message);
      else if (stillOpen()) setMessage('That one did not load. Go back and try again.');
    }
  }

  /** Starts loading a profile while the pointer is still on its row, so the click shows it at once. */
  function prefetch(id: string) {
    fetchDetail(id).catch(() => {});
  }

  // Start: pick up a saved session and show the list straight away. The sign-in address is read from
  // this browser's memory when it is there, so nothing waits on the network for it.
  useEffect(() => {
    let live = true;
    (async () => {
      if (!API) {
        setMessage('This page is not connected yet.');
        setPhase('out');
        return;
      }
      try {
        const cached = JSON.parse(localStorage.getItem(CONFIG_STORE) ?? 'null') as Config | null;
        if (cached?.url && cached?.anonKey) {
          config.current = cached;
          setReady(true);
        }
      } catch {
        // No saved address: it is fetched below.
      }
      const pending = loadConfig();
      let saved: Session | null = null;
      try {
        saved = JSON.parse(localStorage.getItem(STORE) ?? 'null') as Session | null;
      } catch {
        // No saved session.
      }
      if (saved && live) {
        remember(saved);
        setPhase('in');
        await loadList();
        return;
      }
      if (!config.current && !(await pending) && live) {
        setMessage('The server could not be reached, or has not been updated for this page yet. Reload to try again.');
      }
      if (live) setPhase('out');
    })();
    return () => {
      live = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- runs once on load
  }, []);

  // This browser's layout choice, and which profiles it has already opened (for the "new" dot).
  useEffect(() => {
    try {
      const chosen = localStorage.getItem(LAYOUT_STORE);
      /* eslint-disable react-hooks/set-state-in-effect -- one-off read of saved preferences */
      if (chosen === 'split' || chosen === 'list') setLayout(chosen);
      const which = localStorage.getItem(KIND_STORE);
      if (which === 'client_profile' || which === 'website_brief') setKind(which);
      const opened = JSON.parse(localStorage.getItem(SEEN_STORE) ?? '[]');
      if (Array.isArray(opened)) setSeen(opened.filter((x) => typeof x === 'string'));
      /* eslint-enable react-hooks/set-state-in-effect */
    } catch {
      // Defaults: split view, nothing opened yet.
    }
  }, []);

  function chooseLayout(next: 'split' | 'list') {
    setLayout(next);
    try {
      localStorage.setItem(LAYOUT_STORE, next);
    } catch {
      // The choice just is not remembered.
    }
  }

  function chooseKind(next: 'all' | FormType) {
    setKind(next);
    // An open profile from the other form would sit beside a list that no longer has it, so close it.
    const openRow = rows?.find((r) => r.id === selected);
    if (openRow && next !== 'all' && typeOf(openRow) !== next) {
      history.pushState(null, '', window.location.pathname + window.location.search);
      setSelected('');
      setDetail(null);
    }
    try {
      localStorage.setItem(KIND_STORE, next);
    } catch {
      // The choice just is not remembered.
    }
  }

  function markSeen(id: string) {
    setSeen((prev) => {
      if (prev.includes(id)) return prev;
      const next = [...prev, id].slice(-500);
      try {
        localStorage.setItem(SEEN_STORE, JSON.stringify(next));
      } catch {
        // Fine: the dot comes back next visit.
      }
      return next;
    });
  }

  // The address bar's #id is the open profile, so a profile can be linked and the back button works.
  useEffect(() => {
    const read = () => {
      const id = window.location.hash.replace('#', '');
      setSelected(UUID.test(id) ? id : '');
    };
    read();
    window.addEventListener('hashchange', read);
    window.addEventListener('popstate', read);
    return () => {
      window.removeEventListener('hashchange', read);
      window.removeEventListener('popstate', read);
    };
  }, []);

  useEffect(() => {
    if (phase !== 'in' || !selected) return;
    loadDetail(selected);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- reload only when the chosen profile changes
  }, [phase, selected]);

  async function onSignIn(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!config.current) return;
    const form = new FormData(e.currentTarget);
    setBusy(true);
    setMessage('');
    try {
      const next = await tokenRequest(config.current, 'password', {
        email: String(form.get('email') ?? '').trim(),
        password: String(form.get('password') ?? ''),
      });
      remember(next);
      setPhase('in');
      await loadList();
    } catch (err) {
      setMessage(err instanceof SignInError ? err.message : 'Sign-in did not work. Try again.');
    } finally {
      setBusy(false);
    }
  }

  const shown = useMemo(() => {
    const q = query.trim().toLowerCase();
    return (rows ?? []).filter(
      (r) =>
        (kind === 'all' || typeOf(r) === kind) &&
        (!q || [r.business_name, r.contact_name, r.contact_email, r.country ?? '', r.sector ?? '', r.project_type ?? ''].some((x) => x.toLowerCase().includes(q))),
    );
  }, [rows, query, kind]);
  const counts = useMemo(() => {
    const n = { all: rows?.length ?? 0, client_profile: 0, website_brief: 0 };
    for (const r of rows ?? []) n[typeOf(r)] += 1;
    return n;
  }, [rows]);

  function open(id: string) {
    history.pushState(null, '', `#${id}`);
    setSelected(id);
  }
  function back() {
    history.pushState(null, '', window.location.pathname + window.location.search);
    setSelected('');
    setDetail(null);
    if (now() - listAt.current > LIST_TTL) loadList(true);
  }

  async function copyText() {
    if (!detail) return;
    const { profile, files } = detail;
    const { cfg } = FORMS[typeOf(profile)];
    const text =
      cfg.answersAsText(cfg.makeGetter(profile.answers), []) +
      (files.length ? `\nFiles:\n${files.map((f) => `- ${f.name} (${f.category})`).join('\n')}\n` : '');
    try {
      await navigator.clipboard.writeText(text);
      setCopied('Copied.');
    } catch {
      setCopied('Your browser blocked copying.');
    }
    setTimeout(() => setCopied(''), 3000);
  }

  /* ---------------------------------------------------------------- views */

  if (phase === 'loading') {
    return (
      <div className="tone-cream tm">
        <p className="tm__muted">Loading…</p>
      </div>
    );
  }

  if (phase === 'out') {
    return (
      <div className="tone-cream tm">
        <form className="tm__login" onSubmit={onSignIn}>
          <h1 className="tm__h1">Team sign in</h1>
          <p className="tm__muted">Everything clients send is private. Sign in with your Asri team account.</p>
          <label className="field">
            <span className="field__label">Email</span>
            <input name="email" type="email" autoComplete="username" required />
          </label>
          <div className="field">
            <label className="field__label" htmlFor="admin-password">
              Password
            </label>
            <div className="tm-pw">
              <input id="admin-password" name="password" type={showPw ? 'text' : 'password'} autoComplete="current-password" required />
              <button type="button" className="tm-pw__eye" aria-label={showPw ? 'Hide password' : 'Show password'} aria-pressed={showPw} onClick={() => setShowPw((v) => !v)}>
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12Z" />
                  <circle cx="12" cy="12" r="3" />
                  {showPw ? <path d="M4 4l16 16" /> : null}
                </svg>
              </button>
            </div>
          </div>
          {message ? (
            <p className="tm__error" role="alert">
              {message}
            </p>
          ) : null}
          <button type="submit" className="pill pill--ink" disabled={busy || !ready}>
            {busy ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
      </div>
    );
  }

  const top = (
    <div className="tm__top">
      <div className="tm-view" role="group" aria-label="Layout">
          <button type="button" aria-pressed={layout === 'split'} onClick={() => chooseLayout('split')}>
            Split view
          </button>
          <button type="button" aria-pressed={layout === 'list'} onClick={() => chooseLayout('list')}>
            List
          </button>
        </div>
      <span className="tm__muted">{email}</span>
      <Link href="/admin/manage/" className="tm__link">
        Manage
      </Link>
      <button type="button" className="tm__link" onClick={() => signOut()}>
        Sign out
      </button>
    </div>
  );

  const detailEl =
    detail && detail.profile.id === selected ? (
      <Detail
        profile={detail.profile}
        files={detail.files}
        onCopy={copyText}
        copied={copied}
        related={(rows ?? []).filter((r) => r.id !== detail.profile.id && typeOf(r) !== typeOf(detail.profile) && sameClient(r, detail.profile))}
        onOpen={open}
      />
    ) : message ? null : (
      <Opening row={rows?.find((r) => r.id === selected)} />
    );

  const head = (
    <div className="tm__head">
      <div>
        <h1 className="tm__h1">{kind === 'all' ? 'Submissions' : FORMS[kind].plural}</h1>
        <span className="tm__muted">
          {rows === null ? 'Loading…' : `${counts[kind]} ${counts[kind] === 1 ? 'submission' : 'submissions'}`}
        </span>
      </div>
      <div className="tm-tools-top">
        <div className="tm-view" role="group" aria-label="Show">
          {(['all', 'client_profile', 'website_brief'] as const).map((k) => (
            <button key={k} type="button" aria-pressed={kind === k} onClick={() => chooseKind(k)}>
              {k === 'all' ? 'All' : k === 'client_profile' ? 'Profiles' : 'Websites'} <span className="tm-view__n">{counts[k]}</span>
            </button>
          ))}
        </div>
        <button type="button" className="tm__link" onClick={() => loadList(true)} disabled={refreshing}>
          {refreshing ? 'Refreshing…' : 'Refresh'}
        </button>
      </div>
    </div>
  );

  const listPane = (
    <>
      <div className="tm-tools">
        <label className="tm__search">
          <span className="tm__sr">Search submissions</span>
          <input type="search" placeholder="Search by business, name or email" value={query} onChange={(e) => setQuery(e.target.value)} />
        </label>
      </div>
      {rows === null ? (
        message ? null : <p className="tm__muted">Loading…</p>
      ) : rows.length === 0 ? (
        <p className="tm__empty">Nothing yet. Submissions appear here as soon as a client sends a form.</p>
      ) : shown.length === 0 ? (
        <p className="tm__empty">{query.trim() || kind === 'all' ? 'Nothing matches that.' : `No ${FORMS[kind].plural.toLowerCase()} yet.`}</p>
      ) : (
        <div className={layout === 'split' ? 'tm-compact' : 'tm-rows'}>
          {shown.map((r) => {
            const fresh = !seen.includes(r.id);
            const props = {
              r,
              fresh,
              selected: r.id === selected,
              showType: kind === 'all',
              onOpen: () => open(r.id),
              onHover: () => prefetch(r.id),
            };
            return layout === 'split' ? <CompactRow key={r.id} {...props} /> : <RichRow key={r.id} {...props} />;
          })}
        </div>
      )}
    </>
  );

  if (layout === 'split') {
    return (
      <div className="tone-cream tm tm--wide">
        {top}
        {head}
        {message ? <p className="tm__error" role="alert">{message}</p> : null}
        <div className="tm-split" data-open={selected ? 'true' : 'false'}>
          <div className="tm-split__list">{listPane}</div>
          <div className="tm-split__detail">
            {selected ? (
              <>
                <button type="button" className="tm__link tm-split__back" onClick={back}>
                  All submissions
                </button>
                {detailEl}
              </>
            ) : (
              <p className="tm__empty">Pick a client on the left to read what they sent.</p>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (selected) {
    return (
      <div className="tone-cream tm">
        {top}
        <button type="button" className="tm__link tm__back" onClick={back}>
          All submissions
        </button>
        {message ? <p className="tm__error" role="alert">{message}</p> : null}
        {detailEl}
      </div>
    );
  }

  return (
    <div className="tone-cream tm">
      {top}
      {head}
      {message ? <p className="tm__error" role="alert">{message}</p> : null}
      {listPane}
    </div>
  );
}

/* ---------------------------------------------------------------- list rows */

type RowProps = { r: Row; fresh: boolean; selected: boolean; showType: boolean; onOpen: () => void; onHover: () => void };

/** Which form a row came from, as a small tag. Shown when the list mixes both. */
function TypeTag({ r }: { r: Row }) {
  const t = typeOf(r);
  return <span className={`tm-type tm-type--${t}`}>{t === 'website_brief' ? 'Website' : 'Profile'}</span>;
}

function TodoPill({ r }: { r: Row }) {
  // Until the function sends follow-ups with the list, say nothing rather than claim there is nothing to do.
  if (!r.followups) return null;
  const n = setupOf(r);
  return <span className={`tm-todo${n ? '' : ' tm-todo--none'}`}>{n ? `${n} to set up` : 'Nothing to set up'}</span>;
}

/** The full-width list row: who, what they want, files, what the team has to do, and how long ago. */
function RichRow({ r, fresh, showType, onOpen, onHover }: RowProps) {
  const files = filesOf(r);
  return (
    <a
      href={`#${r.id}`}
      className="tm-row"
      onClick={(e) => {
        e.preventDefault();
        onOpen();
      }}
      onPointerEnter={onHover}
    >
      <span className="tm-mono" aria-hidden="true">
        {initials(r.business_name)}
      </span>
      <span className="tm-row__who">
        <b>
          {r.business_name}
          {fresh ? <i className="tm-dot" title="Not opened yet" /> : null}
        </b>
        <small>
          {showType ? <TypeTag r={r} /> : null}
          {aboutOf(r) || (typeOf(r) === 'website_brief' ? 'Project not given' : 'Sector not given')}
        </small>
      </span>
      <span className="tm-row__who">
        <b className="tm-row__plain">{r.contact_name}</b>
        <small>{r.contact_email}</small>
      </span>
      <span className="tm-svc">
        {typeOf(r) === 'website_brief' ? (
          r.primary_action ? <span>{r.primary_action}</span> : null
        ) : (
          <>
            {r.services.slice(0, 2).map((x) => (
              <span key={x}>{x.split(' (')[0]}</span>
            ))}
            {r.services.length > 2 ? <span>+{r.services.length - 2}</span> : null}
          </>
        )}
      </span>
      <span className="tm-row__files">{files ? `${files} file${files === 1 ? '' : 's'}` : 'No files'}</span>
      <span className="tm-row__end">
        <TodoPill r={r} />
        <small>{ago(r.submitted_at)}</small>
      </span>
    </a>
  );
}

/** The narrow row beside an open profile. */
function CompactRow({ r, fresh, selected, showType, onOpen, onHover }: RowProps) {
  const n = setupOf(r);
  return (
    <a
      href={`#${r.id}`}
      className={`tm-item${selected ? ' is-sel' : ''}`}
      aria-current={selected ? 'true' : undefined}
      onClick={(e) => {
        e.preventDefault();
        onOpen();
      }}
      onPointerEnter={onHover}
    >
      <b>
        {fresh ? <i className="tm-dot" title="Not opened yet" /> : null}
        {r.business_name}
      </b>
      <small>
        {showType ? <TypeTag r={r} /> : null}
        {[typeOf(r) === 'website_brief' ? r.project_type : sectorOf(r), ago(r.submitted_at)].filter(Boolean).join(' · ')}
        {n ? <span className="tm-todo tm-todo--small">{n} to set up</span> : null}
      </small>
    </a>
  );
}

/* --------------------------------------------------------------- one profile */

const KIND: Record<string, string> = { setup: 'Set up', check: 'Check', note: 'Note' };

function Detail({
  profile,
  files,
  onCopy,
  copied,
  related,
  onOpen,
}: {
  profile: Profile;
  files: FileRow[];
  onCopy: () => void;
  copied: string;
  related: Row[];
  onOpen: (id: string) => void;
}) {
  const formType = typeOf(profile);
  const { cfg, label } = FORMS[formType];
  const { sections, fields } = cfg;
  const answers = profile.answers ?? {};
  const text = (id: string) => (typeof answers[id] === 'string' ? (answers[id] as string) : '');
  const phone = text('contact_phone');
  const wa = phone.replace(/\D/g, '');

  const secs = sections
    .map((s) => ({ s, rows: s.fields.filter((f) => (f.type === 'file' ? files.some((x) => fieldOf(x) === f.id) : hasValue(answers[f.id] as Answer))) }))
    .filter((x) => x.rows.length);
  const known = new Set(Object.keys(fields));
  const extra = Object.entries(answers).filter(([k, v]) => !known.has(k) && hasValue(v as Answer));
  const categories = [...new Set(files.map((f) => f.category))];

  const isBrief = formType === 'website_brief';
  const sector = text('sector') === 'Other' ? text('sector_other') : text('sector').split(' (')[0];
  const action = text('primary_action') === 'Other' ? text('primary_other') || 'Other' : text('primary_action');
  const dated = text('hard_deadline').startsWith('Yes');
  const where = [text('city'), text('country')].filter(Boolean).join(', ');
  const wants = Array.isArray(answers.services) ? (answers.services as string[]).map((x) => x.split(' (')[0]) : [];
  const colours = text('colors').split(/[,\s]+/).filter((c) => /^#[0-9a-f]{6}$/i.test(c));

  const jump = (id: string) => {
    const el = document.getElementById(id);
    if (el instanceof HTMLDetailsElement) el.open = true;
    el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  // The system scrollbar hides itself on a Mac, so the section bar carries a thin line that fills as the page is read.
  const article = useRef<HTMLElement>(null);
  const jumpBar = useRef<HTMLElement>(null);
  useEffect(() => {
    let frame = 0;
    const paint = () => {
      frame = 0;
      const bar = jumpBar.current;
      if (!bar) return;
      const room = document.documentElement.scrollHeight - window.innerHeight;
      const read = room > 0 ? Math.min(1, Math.max(0, window.scrollY / room)) : 0;
      bar.style.setProperty('--read', String(read));
    };
    const queue = () => {
      if (!frame) frame = requestAnimationFrame(paint);
    };
    paint();
    window.addEventListener('scroll', queue, { passive: true });
    window.addEventListener('resize', queue);
    // Opening or closing a section changes the page height without a scroll.
    const watch = new ResizeObserver(queue);
    if (article.current) watch.observe(article.current);
    return () => {
      window.removeEventListener('scroll', queue);
      window.removeEventListener('resize', queue);
      watch.disconnect();
      if (frame) cancelAnimationFrame(frame);
    };
  }, [profile.id]);

  return (
    <article className="tm__detail" ref={article}>
      <h1 className="tm__h1">{profile.business_name}</h1>
      <p className="tm__muted">
        {label} received {date(profile.submitted_at)} from {profile.contact_name}. Reference {ref(profile.id)}.
        {related.map((r) => (
          <span key={r.id}>
            {' '}
            Also sent their {FORMS[typeOf(r)].label.toLowerCase()} ({date(r.submitted_at)}):{' '}
            <button type="button" className="tm__link" onClick={() => onOpen(r.id)}>
              open it
            </button>
            .
          </span>
        ))}
      </p>
      <div className="tm-reach">
        <a className="tm-reach__item" href={`mailto:${profile.contact_email}`}>
          <span className="tm-reach__icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="5" width="18" height="14" rx="1.5" />
              <path d="m3.5 6.5 8.5 6.5 8.5-6.5" />
            </svg>
          </span>
          <span className="tm-reach__text">
            <b>Send email</b>
            <small>{profile.contact_email}</small>
          </span>
        </a>
        {wa ? (
          <a className="tm-reach__item" href={`https://wa.me/${wa}`} target="_blank" rel="noopener noreferrer">
            <span className="tm-reach__icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 20l1.3-4.2A8 8 0 1 1 8.4 19L4 20Z" />
                <path d="M9.2 9.5c.3 2 2.6 4.2 5 4.8" />
              </svg>
            </span>
            <span className="tm-reach__text">
              <b>Message on WhatsApp</b>
              <small>{phone}</small>
            </span>
          </a>
        ) : null}
        <button type="button" className="tm-reach__item tm-reach__item--quiet" onClick={onCopy}>
          <span className="tm-reach__icon" aria-hidden="true">
            {copied === 'Copied.' ? (
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="m5 12.5 4.5 4.5L19 7.5" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <rect x="8" y="8" width="12" height="12" rx="1.5" />
                <path d="M16 8V5.5A1.5 1.5 0 0 0 14.5 4h-9A1.5 1.5 0 0 0 4 5.5v9A1.5 1.5 0 0 0 5.5 16H8" />
              </svg>
            )}
          </span>
          <span className="tm-reach__text" role="status">
            <b>{copied === 'Copied.' ? 'Copied' : copied ? 'Could not copy' : 'Copy all answers'}</b>
            <small>{copied === 'Copied.' ? 'Ready to paste' : copied ? 'Your browser blocked it' : 'As plain text'}</small>
          </span>
        </button>
      </div>

      <nav className="tm-jump" aria-label="Jump to a section" ref={jumpBar}>
        <button type="button" onClick={() => jump('tm-overview')}>
          Overview
        </button>
        {secs.map(({ s }) => (
          <button key={s.id} type="button" onClick={() => jump(`tm-${s.id}`)}>
            {s.title}
          </button>
        ))}
        <button type="button" onClick={() => jump('tm-files')}>
          All files
        </button>
      </nav>

      <section id="tm-overview" className="tm-over">
        <div className="tm-facts">
          {isBrief ? (
            <>
              <div className="tm-fact">
                <small>Project</small>
                <b>{text('project_type') || 'Not given'}</b>
                <span>{text('why_now') ? `Why now: ${text('why_now')}` : 'No reason given'}</span>
              </div>
              <div className="tm-fact">
                <small>Main action</small>
                <b>{action || 'Not given'}</b>
                <span>{text('copy_owner') ? `Copy: ${text('copy_owner')}` : 'Copy not decided'}</span>
              </div>
              <div className="tm-fact">
                <small>Deadline</small>
                <b>{dated ? text('deadline_date') || 'Date not given' : 'No fixed date'}</b>
                <span>{dated ? text('deadline_reason') || 'Reason not given' : 'Nothing tied to it'}</span>
              </div>
            </>
          ) : (
            <>
              <div className="tm-fact">
                <small>Business</small>
                <b>{sector || 'Sector not given'}</b>
                <span>{[text('stage'), where].filter(Boolean).join(' · ') || 'No more detail'}</span>
              </div>
              <div className="tm-fact">
                <small>Wants</small>
                <b>{wants.length ? `${wants.slice(0, 3).join(', ')}${wants.length > 3 ? `, +${wants.length - 3} more` : ''}` : 'Not given'}</b>
                <span>{text('budget') ? `Budget: ${text('budget')}` : 'No budget given'}</span>
              </div>
            </>
          )}
          <div className="tm-fact">
            <small>Contact</small>
            <b>{[profile.contact_name, text('contact_role')].filter(Boolean).join(', ')}</b>
            <span>{[profile.contact_email, phone].filter(Boolean).join(' · ')}</span>
          </div>
          {isBrief ? null : (
            <div className="tm-fact">
              <small>Brand colours</small>
              {colours.length ? <Swatches value={colours.join(', ')} /> : <b>None given</b>}
            </div>
          )}
        </div>

        {profile.followups?.length ? (
          <div className="tm-todo-list">
            <h2 className="tm__h2">Team follow-ups</h2>
            <ul className="tm__todo">
              {profile.followups.map((f, i) => (
                <li key={i}>
                  <span className={`tm__tag tm__tag--${f.kind}`}>{KIND[f.kind] ?? 'Note'}</span>
                  <span>{f.text}</span>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </section>

      {secs.map(({ s, rows }) => (
        <details className="tm-sec" id={`tm-${s.id}`} key={s.id} open>
          <summary>
            <h2 className="tm__h2">{s.title}</h2>
            <span className="tm__muted">{rows.length} answer{rows.length === 1 ? '' : 's'}</span>
          </summary>
          <dl className="tm__qa">
            {rows.map((f) => (
              <div key={f.id}>
                <dt>{f.label}</dt>
                <dd>
                  {f.type === 'file' ? (
                    <FileItems files={files.filter((x) => fieldOf(x) === f.id)} />
                  ) : f.id === 'colors' ? (
                    <Swatches value={String(answers[f.id])} />
                  ) : (
                    <Text value={formatAnswer(f, answers[f.id] as Answer)} />
                  )}
                </dd>
              </div>
            ))}
          </dl>
        </details>
      ))}

      {extra.length ? (
        <details className="tm-sec" open>
          <summary>
            <h2 className="tm__h2">Other answers</h2>
          </summary>
          <dl className="tm__qa">
            {extra.map(([k, v]) => (
              <div key={k}>
                <dt>{k}</dt>
                <dd>
                  <Text value={Array.isArray(v) ? v.map((x) => (typeof x === 'string' ? x : `${x.url} ${x.notes}`)).join(', ') : String(v)} />
                </dd>
              </div>
            ))}
          </dl>
        </details>
      ) : null}

      <details className="tm-sec" id="tm-files" open>
        <summary>
          <h2 className="tm__h2">All files</h2>
          <span className="tm__muted">{files.length} file{files.length === 1 ? '' : 's'}</span>
        </summary>
        {files.length === 0 ? (
          <p className="tm__muted">No files were uploaded. Any links the client pasted are in the answers above.</p>
        ) : (
          categories.map((c) => (
            <div key={c} className="tm__cat">
              <h3 className="tm__h3">{c}</h3>
              <FileItems files={files.filter((f) => f.category === c)} />
            </div>
          ))
        )}
        {files.length ? <p className="tm__muted tm__note">File links open for one hour. Reload the page for fresh ones.</p> : null}
      </details>

      {Object.keys(profile.source ?? {}).length ? (
        <p className="tm__muted tm__note">Came from {Object.entries(profile.source).filter(([, v]) => v).map(([k, v]) => `${k}: ${v}`).join(', ')}.</p>
      ) : null}
    </article>
  );
}

/** What is already known about a profile while the rest of it loads. */
function Opening({ row }: { row?: Row }) {
  return (
    <article className="tm__detail">
      <h1 className="tm__h1">{row?.business_name ?? 'Loading…'}</h1>
      {row ? (
        <p className="tm__muted">
          {FORMS[typeOf(row)].label} received {date(row.submitted_at)} from {row.contact_name}. Reference {ref(row.id)}.
        </p>
      ) : null}
      <p className="tm__muted tm__note" role="status">
        Loading the answers and files…
      </p>
    </article>
  );
}

/** Files as thumbnails (images) or plain names, each linking to the file. */
function FileItems({ files }: { files: FileRow[] }) {
  return (
    <ul className="tm__files">
      {files.map((f) => (
        <li key={f.path}>
          {f.url && isImage(f.name) ? (
            <img
              src={f.thumb ?? f.url}
              alt=""
              className="tm__thumb"
              loading="lazy"
              decoding="async"
              onError={(e) => {
                // The small version could not be made: fall back to the full file.
                if (f.url && e.currentTarget.src !== f.url) e.currentTarget.src = f.url;
              }}
            />
          ) : (
            <span className="tm__thumb tm__thumb--blank" aria-hidden="true" />
          )}
          <span className="tm__fname">
            {f.url ? (
              <a href={f.url} target="_blank" rel="noopener noreferrer">
                {f.name}
              </a>
            ) : (
              f.name
            )}
            <span className="tm__sub">{megabytes(f.size)}</span>
          </span>
        </li>
      ))}
    </ul>
  );
}

/** Plain text, with links made clickable. Never HTML: client answers are shown as text only. */
function Text({ value }: { value: string }) {
  const parts = value.split(/(https?:\/\/[^\s]*[^\s.,;:!?)])/g);
  return (
    <span className="tm__text">
      {parts.map((p, i) =>
        /^https?:\/\//.test(p) ? (
          <a key={i} href={p} target="_blank" rel="noopener noreferrer">
            {p}
          </a>
        ) : (
          p
        ),
      )}
    </span>
  );
}

function Swatches({ value }: { value: string }) {
  const colors = value.split(/[,\s]+/).filter((c) => /^#[0-9a-f]{6}$/i.test(c));
  if (!colors.length) return <Text value={value} />;
  return (
    <span className="tm__swatches">
      {colors.map((c) => (
        <span className="tm__sw" key={c}>
          <s style={{ background: c }} />
          {c}
        </span>
      ))}
    </span>
  );
}

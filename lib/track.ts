/**
 * The data layer, and the landing page's campaign values.
 *
 * Event names and parameters follow the tracking spec of 20 Sep. Values live
 * in markup as data-track attributes (components/Tracking.tsx turns clicks
 * into events), so the events survive a redesign. GA4 adds page_location to
 * everything, which is how a CTA on a sector page is told from one on the home
 * page.
 */

type Params = Record<string, string | number | undefined>;

declare global {
  interface Window {
    dataLayer?: unknown[];
  }
}

export function track(event: string, params: Params = {}) {
  if (typeof window === 'undefined') return;
  const clean = Object.fromEntries(Object.entries(params).filter(([, v]) => v !== undefined && v !== ''));
  (window.dataLayer = window.dataLayer || []).push({ event, ...clean });
}

export const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'] as const;
const STORE = 'asri:utm';

/** Keeps the landing URL's UTM values for the session, so a lead two pages later still carries them. */
export function captureUtm() {
  try {
    const query = new URLSearchParams(window.location.search);
    const found = Object.fromEntries(UTM_KEYS.flatMap((k) => (query.get(k) ? [[k, query.get(k)!]] : [])));
    if (Object.keys(found).length) sessionStorage.setItem(STORE, JSON.stringify(found));
  } catch {
    // Storage can be blocked; the form simply sends no UTM values.
  }
}

export function readUtm(): Partial<Record<(typeof UTM_KEYS)[number], string>> {
  try {
    return JSON.parse(sessionStorage.getItem(STORE) || '{}');
  } catch {
    return {};
  }
}

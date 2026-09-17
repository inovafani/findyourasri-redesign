'use client';

import { useEffect, useRef, useSyncExternalStore } from 'react';

import { motionIsOff } from '@/lib/gsap';

/**
 * The hero's background.
 *
 * It renders the poster still on the server and upgrades to video on the
 * client, choosing a file sized for the viewport: a 1600px cut for desktop and
 * a 1280px one for phones, which is less than half the bytes.
 *
 * It stays a still in two cases, both of them the visitor's own request: they
 * have asked for less motion, or the browser reports Save-Data / a 2G-3G
 * connection. Those are the only times a hero video is worse than no video.
 *
 * The <video> keeps `poster`, so the frame is filled from the first paint and
 * never flashes black while it buffers.
 */

const WIDE = '(min-width: 861px)';

/** Subscribed rather than read once, so a resize across the breakpoint counts. */
function subscribe(onChange: () => void) {
  const query = window.matchMedia(WIDE);
  query.addEventListener('change', onChange);
  return () => query.removeEventListener('change', onChange);
}

/** '' when the still should stay; otherwise the file to play. */
function pickSource() {
  if (motionIsOff()) return '';

  // Chromium-only, and absent elsewhere — so this narrows, never blocks.
  const connection = (
    navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } }
  ).connection;
  if (connection?.saveData) return '';
  if (connection?.effectiveType && /(^|-)[23]g$/.test(connection.effectiveType)) return '';

  return window.matchMedia(WIDE).matches ? '/video/hero.mp4' : '/video/hero-sm.mp4';
}

export default function HeroMedia() {
  // The third argument is the server snapshot: always the still, so the markup
  // React hydrates against is the markup the server sent.
  const src = useSyncExternalStore(subscribe, pickSource, () => '');
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!src) return;
    const video = videoRef.current;
    if (!video) return;
    // `load()` is what makes a source swap on resize actually take effect.
    video.load();
    // Autoplay is allowed only for muted video, and some browsers still reject
    // the promise. The poster underneath is the fallback, so ignore it.
    video.play().catch(() => {});
  }, [src]);

  if (!src) {
    return (
      <img
        src="/video/hero-poster.jpg"
        alt="Aerial view of open water at golden hour"
        width={1600}
        height={900}
        fetchPriority="high"
      />
    );
  }

  return (
    <video
      ref={videoRef}
      key={src}
      poster="/video/hero-poster.jpg"
      autoPlay
      muted
      loop
      playsInline
      preload="auto"
      aria-label="Aerial view of open water at golden hour"
    >
      <source src={src} type="video/mp4" />
    </video>
  );
}

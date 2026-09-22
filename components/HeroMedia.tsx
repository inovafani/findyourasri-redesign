'use client';

import { useEffect, useRef, useSyncExternalStore } from 'react';

import { motionIsOff } from '@/lib/gsap';

/**
 * The hero's background.
 *
 * It renders a poster still on the server and upgrades to video on the client,
 * choosing a cut that matches the shape of the frame it has to fill.
 *
 * That shape matters more than the bitrate. `object-fit: cover` crops a
 * landscape file hard on a portrait phone: measured on an iPhone, only 27% of
 * a 1280x720 frame survived the crop, and those 346 columns were then stretched
 * across 1221 device pixels — a 3.5x upscale no amount of CRF can rescue. The
 * portrait cut is the middle of the master cropped to 9:16, so every encoded
 * pixel is one the viewer actually sees.
 *
 * It stays a still in two cases, both the visitor's own request: reduced
 * motion, or a Save-Data / 2G-3G connection.
 */

const DESKTOP = '(min-width: 861px)';
/** A phone held upright — the only case where the portrait cut is the right one. */
const UPRIGHT = '(max-width: 700px) and (orientation: portrait)';

function subscribe(onChange: () => void) {
  const queries = [window.matchMedia(DESKTOP), window.matchMedia(UPRIGHT)];
  queries.forEach((q) => q.addEventListener('change', onChange));
  return () => queries.forEach((q) => q.removeEventListener('change', onChange));
}

function poster() {
  if (typeof window === 'undefined') return '/video/hero-poster.jpg';
  return window.matchMedia(UPRIGHT).matches
    ? '/video/hero-poster-portrait.jpg'
    : '/video/hero-poster.jpg';
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

  if (window.matchMedia(DESKTOP).matches) return '/video/hero.mp4';
  // Between the two: a tablet, or a phone on its side. The frame is wide there,
  // so the landscape cut still wastes less than the portrait one would.
  return window.matchMedia(UPRIGHT).matches ? '/video/hero-portrait.mp4' : '/video/hero-sm.mp4';
}

export default function HeroMedia() {
  // The third argument is the server snapshot: always the still, so the markup
  // React hydrates against is the markup the server sent.
  const src = useSyncExternalStore(subscribe, pickSource, () => '');
  const still = useSyncExternalStore(subscribe, poster, () => '/video/hero-poster.jpg');
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
        src={still}
        alt="A street in Indonesia at golden hour"
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
      poster={still}
      autoPlay
      muted
      loop
      playsInline
      preload="auto"
      aria-label="A street in Indonesia at golden hour"
    >
      <source src={src} type="video/mp4" />
    </video>
  );
}

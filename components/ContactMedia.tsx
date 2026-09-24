'use client';

import { useEffect, useRef, useState } from 'react';

import { motionIsOff } from '@/lib/gsap';

/**
 * The contact card's loop.
 *
 * It sits at the foot of the page, so nothing is fetched until the card is
 * about a screen away. Like the hero, it stays a still under reduced motion or
 * a Save-Data / 2G-3G connection.
 */

const POSTER = '/video/contact-poster.jpg';
const ALT = 'A phinisi under sail between the karst islands of Raja Ampat';

function pickSource() {
  if (motionIsOff()) return '';

  const connection = (
    navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } }
  ).connection;
  if (connection?.saveData) return '';
  if (connection?.effectiveType && /(^|-)[23]g$/.test(connection.effectiveType)) return '';

  return window.matchMedia('(min-width: 861px)').matches
    ? '/video/contact.mp4'
    : '/video/contact-sm.mp4';
}

export default function ContactMedia() {
  const [src, setSrc] = useState('');
  const frameRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const frame = frameRef.current;
    if (!frame) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        setSrc(pickSource());
      },
      { rootMargin: '100% 0px' },
    );
    observer.observe(frame);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!src) return;
    // The poster underneath is the fallback if autoplay is refused.
    videoRef.current?.play().catch(() => {});
  }, [src]);

  return (
    <div className="parallax-media" ref={frameRef}>
      {src ? (
        <video
          ref={videoRef}
          poster={POSTER}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          aria-label={ALT}
        >
          <source src={src} type="video/mp4" />
        </video>
      ) : (
        <img src={POSTER} alt={ALT} width={1600} height={900} loading="lazy" />
      )}
    </div>
  );
}

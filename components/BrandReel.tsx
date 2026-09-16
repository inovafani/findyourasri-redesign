'use client';

import { useEffect, useRef } from 'react';

import { ScrollTrigger, gsap, initGsap, motionIsOff } from '@/lib/gsap';
import { brands } from '@/lib/content';

/**
 * The logo band. GSAP drives the loop rather than a CSS keyframe so scrolling
 * can lean on it: the track speeds up with the page's scroll velocity and eases
 * back to its resting pace, which makes the strip feel attached to the scroll
 * instead of running on its own clock. Hover slows it to a crawl so a logo can
 * actually be read.
 */
export default function BrandReel() {
  const track = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = track.current;
    if (!el) return;

    initGsap();
    if (motionIsOff()) return;

    const ctx = gsap.context(() => {
      // The track holds the row twice, so -50% is exactly one seamless lap.
      const loop = gsap.to(el, {
        xPercent: -50,
        duration: 46,
        ease: 'none',
        repeat: -1,
      });

      // `resting` is the pace the strip returns to; `target` is where scroll
      // velocity has pushed it to right now. The ticker eases the live
      // timeScale toward the target and the target back toward resting, so
      // every change is a glide rather than a step.
      let resting = 1;
      let target = 1;
      let current = 1;

      const sync = () => {
        target += (resting - target) * 0.05;
        current += (target - current) * 0.08;
        loop.timeScale(current);
      };
      gsap.ticker.add(sync);

      const velocity = ScrollTrigger.create({
        onUpdate: (self) => {
          // Clamped, so a flick of the wheel nudges the strip rather than
          // launching it.
          const boost = gsap.utils.clamp(1, 4.5, 1 + Math.abs(self.getVelocity()) / 900);
          target = Math.max(target, resting * boost);
        },
      });

      const enter = () => {
        resting = 0.22;
        target = resting;
      };
      const leave = () => {
        resting = 1;
      };
      el.addEventListener('pointerenter', enter);
      el.addEventListener('pointerleave', leave);

      return () => {
        gsap.ticker.remove(sync);
        velocity.kill();
        el.removeEventListener('pointerenter', enter);
        el.removeEventListener('pointerleave', leave);
      };
    }, el);

    return () => ctx.revert();
  }, []);

  const row = (hidden: boolean) => (
    <ul className="reel__row" aria-hidden={hidden || undefined}>
      {brands.map((b) => (
        <li key={b.alt}>
          <img
            src={b.src}
            alt={hidden ? '' : b.alt}
            width={b.w}
            height={b.h}
            style={{ height: b.size }}
          />
        </li>
      ))}
      <li className="reel__wordmark">
        <img src="/img/logo-bluepass.png" alt="" width={82} height={120} style={{ height: 20 }} />
        <span>BluePass</span>
      </li>
    </ul>
  );

  return (
    <section className="reel" aria-label="Brands we have worked with">
      <div className="eyebrow reel__head">
        <span className="eyebrow__num reveal">[01]</span>
        <span className="eyebrow__label reveal">Worked with</span>
        <span className="eyebrow__rule rule-draw" />
      </div>
      <div className="reel__viewport">
        <div className="reel__track" ref={track}>
          {row(false)}
          {row(true)}
        </div>
      </div>
    </section>
  );
}

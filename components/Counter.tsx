'use client';

import { useEffect, useRef } from 'react';

import { EASE, ScrollTrigger, gsap, initGsap, motionIsOff } from '@/lib/gsap';

/**
 * A figure that counts up the first time it scrolls into view. The final value
 * is what server-renders, so the number is correct before — and without — any
 * JavaScript; the tween only ever rewinds it briefly on arrival.
 */
export default function Counter({ value, suffix }: { value: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    initGsap();
    if (motionIsOff()) return;

    const state = { n: 0 };
    const tween = gsap.to(state, {
      n: value,
      duration: 1.6,
      ease: EASE,
      paused: true,
      onUpdate: () => {
        el.textContent = String(Math.round(state.n));
      },
    });

    el.textContent = '0';
    const trigger = ScrollTrigger.create({
      trigger: el,
      start: 'top 92%',
      once: true,
      onEnter: () => tween.play(),
    });

    return () => {
      trigger.kill();
      tween.kill();
      el.textContent = String(value);
    };
  }, [value]);

  return (
    <>
      <span ref={ref}>{value}</span>
      {suffix ? <sup>{suffix}</sup> : null}
    </>
  );
}

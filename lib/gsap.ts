'use client';

import { gsap } from 'gsap';
import { CustomEase } from 'gsap/CustomEase';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';

/**
 * The house easing curve. It is the same cubic-bezier(.22,.68,.16,1) that
 * globals.css exposes as --ease, so CSS transitions and GSAP tweens move
 * identically. Everything in the site decelerates on this curve — there are no
 * bounces, springs or overshoots anywhere.
 */
export const EASE = 'asri';

/** The slower companion curve, for long scrubbed and entrance moves. */
export const EASE_LONG = 'asri-long';

let ready = false;

/** Idempotent: safe to call from every component that needs GSAP. */
export function initGsap() {
  if (ready) return;
  gsap.registerPlugin(ScrollTrigger, ScrollToPlugin, CustomEase, SplitText);
  CustomEase.create(EASE, 'M0,0 C0.22,0.68 0.16,1 1,1');
  CustomEase.create(EASE_LONG, 'M0,0 C0.16,0.84 0.1,1 1,1');
  ready = true;
}

/**
 * True when the visitor has asked for less motion, or when the ?shot
 * verification hook has pinned the page for a screenshot. Every animation in
 * the site is a no-op in that case, and the resting styles in globals.css are
 * authored so the page reads correctly without a single tween running.
 */
export function motionIsOff() {
  if (typeof window === 'undefined') return true;
  if (new URLSearchParams(window.location.search).get('shot') !== null) return true;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/** Pointer-fine devices only: hover-driven flourishes stay off touch screens. */
export function hasFinePointer() {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(hover: hover) and (pointer: fine)').matches;
}

/** Scroll the document to an element, clearing the sticky header. */
export function scrollToTarget(target: Element | number) {
  gsap.to(window, {
    duration: 1.05,
    ease: EASE,
    scrollTo: typeof target === 'number' ? target : { y: target, offsetY: 86 },
  });
}

export { gsap, ScrollTrigger, SplitText };

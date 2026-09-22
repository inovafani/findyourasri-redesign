'use client';

import { useLayoutEffect } from 'react';
import { usePathname } from 'next/navigation';

import {
  EASE,
  EASE_LONG,
  SplitText,
  ScrollTrigger,
  gsap,
  hasFinePointer,
  initGsap,
  motionIsOff,
} from '@/lib/gsap';

/**
 * Every page-wide animation, in one client island, so the sections themselves
 * stay server-rendered markup.
 *
 * House rules, so that a page with this much movement still reads as calm:
 *   · one easing curve, and it only ever decelerates — no bounce, no overshoot;
 *   · entrances move at most 26px, and only ever along one axis;
 *   · nothing rotates, nothing flies in from off-screen, nothing loops except
 *     the logo strip;
 *   · scrubbed moves are slow and small (±6%), so they read as depth rather
 *     than as an effect.
 *
 * All of it is skipped under prefers-reduced-motion, and the resting styles in
 * globals.css are authored so the page is complete without a single tween.
 */

/* Containers whose `.reveal` children should arrive as one sequence. Ordered
   innermost-last is irrelevant — `closest()` already picks the nearest. */
const GROUPS = [
  '.eyebrow',
  '.footer__list',
  '.measure__list',
  '.hero__actions',
  '.contact__actions',
  '.sec-head',
  '.sector__body',
  '.statement__grid',
  '.stages',
  '.services__grid',
  '.steps',
  '.measure__cols',
  '.footer__cols',
  '.footer__bar',
  '.production',
  '.contact__body',
].join(', ');

export default function Motion() {
  // Layouts survive navigation in the App Router, so an effect keyed on [] would
  // run once for the whole site and every page after the first would arrive with
  // its elements stuck at their hidden resting state. Keying on the path tears
  // the old triggers down and builds the new page's.
  const pathname = usePathname();

  useLayoutEffect(() => {
    initGsap();
    if (motionIsOff()) return;

    let cancelled = false;
    const contexts: gsap.Context[] = [];

    /* ---------------------------------------------------------------
       Everything that does not depend on where the text wraps runs now.
       --------------------------------------------------------------- */
    contexts.push(
      gsap.context(() => {
        // ---------- hero frame: wipe open, and a long settle out of overscan ----------
        const intro = gsap.timeline({ defaults: { ease: EASE_LONG } });

        // Endpoints are pinned with `fromTo` throughout: an inferred endpoint is
        // read off the live computed style, which is the wrong number whenever
        // a CSS transition or a re-mounted effect has the element mid-flight.
        intro
          .fromTo(
            '.header .hdr-item',
            { y: -10, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.7, stagger: 0.05, ease: EASE },
          )
          .fromTo(
            '.hero__frame',
            { clipPath: 'inset(0% 0% 100% 0%)' },
            { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.15 },
            0.1,
          )
          .fromTo('.hero__media img, .hero__media video', { scale: 1.14 }, { scale: 1, duration: 2.2 }, 0.1)
          // `.to`, not `.from`: these carry the CSS resting state from
          // globals.css, so the tween has to move them to their final values
          // rather than away from them.
          .to(
            '.hero .reveal',
            { y: 0, opacity: 1, duration: 0.9, stagger: 0.07, ease: EASE },
            0.65,
          );

        // ---------- scroll reveals ----------
        // Grouped so a row of cards arrives as a sequence rather than twelve
        // unrelated fades. The trigger is the group, not the element, so the
        // whole row is keyed to one scroll position.
        gsap.utils.toArray<HTMLElement>('.reveal').forEach((el) => {
          if (el.closest('.hero')) return; // owned by the intro timeline

          const group = el.closest<HTMLElement>(GROUPS);
          const peers = group ? Array.from(group.querySelectorAll('.reveal')) : [el];

          // The sector rows are the page's slowest beat: one large frame and
          // four lines of copy, read at a walking pace rather than snapped in.
          const unhurried = Boolean(el.closest('.sector__body'));
          const delay = Math.min(peers.indexOf(el), 7) * (unhurried ? 0.14 : 0.07);

          gsap.to(el, {
            opacity: 1,
            y: 0,
            duration: unhurried ? 1.25 : 0.9,
            ease: EASE,
            delay,
            scrollTrigger: { trigger: group ?? el, start: 'top 90%', once: true },
          });
        });

        // ---------- hairlines draw themselves ----------
        gsap.utils.toArray<HTMLElement>('.rule-draw').forEach((el) => {
          gsap.to(el, {
            scaleX: 1,
            duration: 1,
            ease: EASE_LONG,
            scrollTrigger: { trigger: el, start: 'top 95%', once: true },
          });
        });

        // ---------- the process rail's dots ----------
        gsap.utils.toArray<HTMLElement>('.dot-pop').forEach((el) => {
          gsap.to(el, {
            scale: 1,
            duration: 0.5,
            ease: EASE,
            scrollTrigger: { trigger: el, start: 'top 95%', once: true },
          });
        });

        // ---------- framed media wipes open ----------
        // The hero frame belongs to the intro timeline and the archive has its
        // own sequenced pass below; everything else is handled here.
        gsap.utils.toArray<HTMLElement>('.clip-reveal').forEach((el) => {
          if (el.closest('.work__rail') || el.classList.contains('hero__frame')) return;

          const inSector = Boolean(el.closest('.sector'));
          const trigger = { trigger: el, start: 'top 90%', once: true } as const;

          gsap.to(el, {
            clipPath: 'inset(0% 0% 0% 0%)',
            duration: inSector ? 1.8 : 1.1,
            ease: EASE_LONG,
            scrollTrigger: trigger,
          });

          // A long settle out of a small overscan, the same move the hero
          // makes. It runs on `scale` while the parallax below runs on
          // `yPercent`, so the two compose rather than fight.
          const image = inSector ? el.querySelector('img') : null;
          if (image) {
            gsap.fromTo(
              image,
              { scale: 1.08 },
              { scale: 1, duration: 2.6, ease: EASE_LONG, scrollTrigger: trigger },
            );
          }
        });

        // ---------- our work: each card wipes open over a settling image ----------
        // The rail scrolls horizontally, so every card shares a vertical
        // trigger point — the stagger is what gives them an order.
        gsap.utils.toArray<HTMLElement>('.work__rail .proj').forEach((card, i) => {
          const image = card.querySelector('img');
          const trigger = { trigger: card, start: 'top 92%', once: true };
          const delay = Math.min(i, 5) * 0.08;

          gsap.to(card, {
            clipPath: 'inset(0% 0% 0% 0%)',
            duration: 1,
            ease: EASE_LONG,
            delay,
            scrollTrigger: trigger,
          });

          if (!image) return;
          gsap.fromTo(
            image,
            { scale: 1.12 },
            {
              scale: 1,
              duration: 1.4,
              ease: EASE_LONG,
              delay,
              scrollTrigger: trigger,
              // Hand the image back to CSS so the hover zoom is not fighting an
              // inline transform GSAP left behind.
              onComplete: () => gsap.set(image, { clearProps: 'transform' }),
            },
          );
        });

        // ---------- parallax ----------
        // Every media wrapper is inset beyond its frame, so a ±6% drift never
        // exposes an edge.
        gsap.utils.toArray<HTMLElement>('.parallax-media').forEach((media) => {
          gsap.fromTo(
            media,
            { yPercent: 6 },
            {
              yPercent: -6,
              ease: 'none',
              scrollTrigger: {
                trigger: media.closest('.sector, .band, .photo-card, .contact, section') ?? media,
                start: 'top bottom',
                end: 'bottom top',
                scrub: true,
              },
            },
          );
        });

        // The hero drifts against the page as it leaves.
        gsap.to('.hero__media', {
          yPercent: 8,
          ease: 'none',
          scrollTrigger: {
            trigger: '.hero__frame',
            start: 'top top',
            end: 'bottom top',
            scrub: true,
          },
        });

        // ---------- the footer wordmark rises out of its own mask ----------
        gsap.fromTo(
          '.mark-rise',
          { yPercent: 108 },
          {
            yPercent: 0,
            duration: 1.2,
            ease: EASE_LONG,
            scrollTrigger: { trigger: '.footer__top', start: 'top 92%', once: true },
          },
        );

        // ---------- magnetic pills ----------
        if (hasFinePointer()) {
          gsap.utils.toArray<HTMLElement>('.magnetic').forEach((el) => {
            const toX = gsap.quickTo(el, 'x', { duration: 0.45, ease: EASE });
            const toY = gsap.quickTo(el, 'y', { duration: 0.45, ease: EASE });

            el.addEventListener('pointermove', (event) => {
              const box = el.getBoundingClientRect();
              // Capped at 5px: the pill leans toward the cursor, it does not
              // chase it.
              toX(gsap.utils.clamp(-5, 5, (event.clientX - (box.left + box.width / 2)) * 0.22));
              toY(gsap.utils.clamp(-5, 5, (event.clientY - (box.top + box.height / 2)) * 0.3));
            });
            el.addEventListener('pointerleave', () => {
              toX(0);
              toY(0);
            });
          });
        }
      }),
    );

    /* ---------------------------------------------------------------
       Anything that splits text has to wait for the webfont, or the lines
       are measured against the fallback and re-wrap on swap. The race keeps
       a slow font from holding the headlines hostage.
       --------------------------------------------------------------- */
    const fontsReady = Promise.race([
      document.fonts?.ready ?? Promise.resolve(),
      new Promise((resolve) => setTimeout(resolve, 1200)),
    ]);

    fontsReady.then(() => {
      if (cancelled) return;

      contexts.push(
        gsap.context(() => {
          // ---------- headlines arrive a line at a time, out of a mask ----------
          gsap.utils.toArray<HTMLElement>('.line-mask').forEach((el) => {
            const hero = Boolean(el.closest('.hero'));

            SplitText.create(el, {
              type: 'lines',
              mask: 'lines',
              linesClass: 'split-line',
              autoSplit: true,
              onSplit(self) {
                gsap.set(el, { opacity: 1 });
                return gsap.fromTo(
                  self.lines,
                  { yPercent: 115 },
                  {
                    yPercent: 0,
                    duration: 1.1,
                    ease: EASE_LONG,
                    stagger: 0.085,
                    delay: hero ? 0.35 : 0,
                    scrollTrigger: hero
                      ? undefined
                      : { trigger: el, start: 'top 88%', once: true },
                  },
                );
              },
            });
          });

          // ---------- the statement reads itself into focus ----------
          // The paragraph is already two-tone in the design; scrubbing opacity
          // per word keeps that palette and simply brings the sentence up.
          gsap.utils.toArray<HTMLElement>('.read-through').forEach((el) => {
            SplitText.create(el, {
              type: 'words',
              autoSplit: true,
              onSplit(self) {
                return gsap.fromTo(
                  self.words,
                  { opacity: 0.2 },
                  {
                    opacity: 1,
                    ease: 'none',
                    stagger: 0.4,
                    scrollTrigger: {
                      trigger: el,
                      start: 'top 82%',
                      end: 'bottom 62%',
                      scrub: 0.6,
                    },
                  },
                );
              },
            });
          });

          ScrollTrigger.refresh();
        }),
      );
    });

    return () => {
      cancelled = true;
      contexts.forEach((ctx) => ctx.revert());
      // Contexts own their own triggers, but a stale one left behind would keep
      // measuring a page that no longer exists.
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, [pathname]);

  return null;
}

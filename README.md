# Asri — redesign

A Next.js implementation of the `Asri Redesign.dc.html` canvas from Claude Design,
with a GSAP motion layer on top.

Same stack and deployment shape as the live `findyourasri` site: Next 16 (App
Router), React 19, TypeScript, GSAP, exported as static files and served by
Netlify.

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # static export → out/
npm run lint
npm run typecheck
```

## Where things are

| Path | What's there |
|---|---|
| `app/globals.css` | Design tokens and the **resting state** of every element. No motion. |
| `app/layout.tsx` | Metadata, JSON-LD, fonts, and the pre-paint boot script. |
| `components/Motion.tsx` | **Every page-wide animation**, in one client island. |
| `components/*.tsx` | One component per section, server-rendered except where noted. |
| `lib/content.ts` | All copy, as data. |
| `lib/site.ts` | Metadata, structured data, the two contact routes. |
| `lib/gsap.ts` | Plugin registration, the two house easing curves, motion opt-out. |
| `public/img/` | Photography and logos, carried over from the live site. |

Only four components are client components, and each for one reason: `Header`
(sticky state), `BrandReel` (the loop), `Counter` and `SmoothLink` /`ToTop`
(scroll behaviour). Everything else is static markup.

## Design fidelity

The canvas is authored as inline styles on a single document. Those were
translated into named classes in `globals.css`, value for value — the palette
(`--a-*`), the `clamp()` type scale, the 1480px measure, the 24/14/28px corner
set, the hairline colours and the `cubic-bezier(.22,.68,.16,1)` curve all come
straight from the source.

Two deliberate departures, both flagged:

- **Fonts.** The design system's `tokens/fonts.css` substitutes Geist / Geist
  Mono for the proprietary Saans / SaansMono, and says so. That substitution is
  carried through here via `next/font/google`. Dropping in the real binaries is
  a change to the two font declarations in `app/layout.tsx` and nothing else.
- **Motion.** The parent design system's readme rules out scroll-triggered
  reveals and parallax ("restrained and functional… no loops"). This build
  deliberately overrides that, because the brief asked for the animation. The
  house rules below are how it stays on the calm side of that line.

## The motion system

`components/Motion.tsx` holds all of it, in one `gsap.context` so React can tear
it down cleanly. The rules it works to:

- one easing curve, and it only ever decelerates — no bounce, no overshoot;
- entrances move at most 26px, along one axis;
- nothing rotates, nothing flies in from off-screen, nothing loops except the
  logo strip;
- scrubbed moves are slow and small (±6%), so they read as depth, not effect.

What runs, in page order:

| | |
|---|---|
| **Intro** | Header items stagger down; the hero frame wipes open on a `clip-path`; the photograph settles out of a 14% overscan over 2.2s; the headline arrives line by line out of a `SplitText` mask; the eyebrow, card, lede and buttons follow. |
| **Header** | Condenses and grows a hairline past the first 24px. |
| **Logo strip** | A GSAP loop, not a CSS keyframe, so scroll velocity can lean on it: the strip speeds up with the page and eases back to its resting pace, and slows to a crawl on hover. |
| **Statement** | The lead paragraph's words resolve from 20% to full opacity on a scrub, so the sentence is read into focus. It keeps the design's two-tone palette rather than recolouring it. |
| **Section openers** | The `[0n]` number and label rise; the hairline rule draws from the left. |
| **Headlines** | Every `.line-mask` heading splits into lines and arrives out of its own mask. |
| **Cards** | `.reveal` elements rise 26px and fade, staggered *within their group* so a row arrives as one sequence rather than as unrelated fades. |
| **Counters** | `10+` and `300+` count up once on arrival. |
| **Sectors** | The page's slowest beat: the frame wipes open over 1.8s, the photograph settles out of an 8% overscan over 2.6s and then drifts on a scrub, and the four lines of copy stagger at 0.14s apart. |
| **Archive** | Each of the twelve frames wipes open over a settling image, in short runs of four; hover zooms. Clicking one opens the viewer. |
| **Process** | The dot pops, the rail draws, the card arrives. |
| **Footer** | The wordmark rises out of its own mask; the 2px rule draws. |
| **Throughout** | Pill CTAs lean up to 5px toward the cursor (pointer-fine only); in-page anchors and back-to-top ease rather than jump. |

### The archive grid and its viewer

Both live in [`components/Gallery.tsx`](components/Gallery.tsx).

**The grid is placed by name, not by span.** The original span-based layout
(`grid-auto-flow: dense` plus `span 2` counts) tiled to 20 cells but resolved to
7 columns at desktop width, so it needed 21 — which is what left a hole in the
bottom-right corner. Each breakpoint now declares an explicit
`grid-template-areas` block that is a complete rectangle: 6x4 desktop, 4x6
tablet, 2x11 mobile. Twelve frames, no leftover cell, at any width.

If you add or remove a frame, you must update all three templates, and every
name has to form a rectangle — a name placed in an L shape makes the browser
drop the whole template silently.

**The viewer** opens on click, steps with its buttons, the arrow keys or a
horizontal swipe, and closes on the button, Escape or the backdrop. It wraps at
both ends. It renders through a portal onto `<body>`, because it must not
inherit the grid's `overflow: hidden` and has to sit above the sticky header.
While it is open the body scrolls are locked (with the scrollbar's width handed
back as padding, so the page underneath does not shift), focus is trapped
inside it, and on close focus returns to the frame that opened it.

### Two things worth knowing before editing

**Resting state lives in CSS, motion lives in GSAP.** The handful of rules that
hide an element before it animates are all gated behind `html.anim-ready`, which
the boot script in `app/layout.tsx` only sets when JavaScript has run *and* the
visitor has not asked for less motion. So the page renders complete and static
with JS off, under `prefers-reduced-motion`, and for crawlers. Both paths are
verified — nothing is left hidden or displaced.

**Pin your endpoints.** Every entrance uses `fromTo`, never `from`. GSAP infers
a `from` tween's endpoint by reading the live computed style, which hands it the
wrong number whenever a CSS transition or a re-mounted effect (React Strict Mode
double-invokes effects in dev) has the element mid-flight. For the same reason
the global `a` transition covers `color` and `border-color` but deliberately not
`opacity`.

## Mobile

The phone layout is not the desktop one reflowed. Everything mobile-specific
lives in the `@media (max-width: 860px)` and `(max-width: 700px)` blocks at the
bottom of `globals.css`, plus two components; **nothing above those widths is
touched**, so the desktop layout is exactly the one the design canvas specifies.

- **Navigation** becomes a burger ([`components/MobileMenu.tsx`](components/MobileMenu.tsx)).
  The sheet wipes down from the header and the rows rise out of their own masks,
  the same language the hero and the headlines use. The header deliberately
  outranks the sheet (z-index 100 vs 80) so the burger stays reachable and can
  morph to an X while the sheet is open; the lightbox outranks both at 120.
  Escape closes it, the body is scroll-locked while open, and focus returns to
  the button. A `<noscript>` block in `layout.tsx` restores the inline links,
  since without JS the burger would leave the phone with no navigation at all.
- **Cards hug their content.** The desktop `min-height: 280px` on the "who we
  are" tiles, combined with `justify-content: space-between`, opened a void in
  the middle of every card once they went single-column. Both are dropped below
  860px.
- **The archive becomes a slider** — an edge-to-edge scroll-snap rail with a dot
  index and a counter, instead of twelve stacked frames. Same markup and the
  same lightbox; only the layout switches.

## Hero video (planned, not yet wired)

The hero is still the `/img/hero.jpg` still. The slots are prepared:

| Path | What goes there |
|---|---|
| `_src/video/` | the **master** file, dropped as `hero-master.*` — gitignored, never deployed |
| `public/video/` | the encoded `hero.mp4` + `hero.webm` that ship |

See `_src/video/README.md` for what the master should look like. Nothing in
`Hero.tsx`, `globals.css` or `Motion.tsx` has been changed — swapping the still
for the video is a deliberate, separate step.

When it is wired, these are the things that decide whether it helps or hurts:

- **Autoplay only works muted**, and needs `playsInline` or iOS opens it
  fullscreen. `poster="/img/hero.jpg"` keeps the frame filled while it loads.
- **`prefers-reduced-motion` gets the still**, not the video — the same rule the
  rest of the site's motion follows.
- **Phones keep the still by default.** A hero video is the single heaviest
  thing on a page; serving it on a phone connection costs more than it adds.
- **The hero's GSAP moves retarget to the video element** — the clip-path wipe,
  the 1.14 → 1 settle and the scroll parallax all currently address
  `.hero__media img`.

Encoding needs `ffmpeg`, which is not installed on this machine yet
(`brew install ffmpeg`).

## Verification hook

`?shot` disables all motion and renders the page at rest — useful for
screenshots and visual diffing. `?shot=<px>` additionally scrolls to that offset.

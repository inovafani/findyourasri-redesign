/**
 * The pictures in the lower half of /services/: the two partnership cards
 * (16:7), the three months of the first ninety days (3:2) and the closing
 * band. They are stock photographs from Unsplash (free to use, no attribution
 * required; credits below), chosen to show the work: shooting, a site,
 * planning, a social feed, analytics, a team. Originals live in
 * _src/img/Unsplash. Each is cropped to its card's own shape so the page does
 * not ship a 600KB original for a 675px box.
 *
 *   node scripts/optimize-services-frames.mjs
 *
 * `y` is where the crop is centred, as a fraction of the photograph's height.
 *
 * Credits (Unsplash):
 *   growth        Riccardo Sanmartini  https://unsplash.com/photos/FfBFrtfpUnM
 *   performance   Carriza Maiquez      https://unsplash.com/photos/IiHHmOcnnSA
 *   foundation    Kaleidico            https://unsplash.com/photos/26MJGnCM0Wc
 *   distribution  Lance Reis           https://unsplash.com/photos/8koSbeUK6O4
 *   optimisation  Luke Chesser         https://unsplash.com/photos/JKUTrJ4vK00
 *   team (band)   Chase Chappell       https://unsplash.com/photos/m29D0DvAhF0
 */
import { mkdirSync, statSync } from 'node:fs';
import sharp from 'sharp';

const SRC = '_src/img/Unsplash';
const OUT = 'public/img/services';

const PLAN = { w: 1600, h: 700 };
const STEP = { w: 1200, h: 800 };
const BAND = { w: 2000, h: 1333 };

const FRAMES = [
  { out: 'growth.jpg', file: 'growth-riccardo-sanmartini-FfBFrtfpUnM.jpg', size: PLAN, y: 0.3 },
  { out: 'performance.jpg', file: 'performance-carriza-maiquez-IiHHmOcnnSA.jpg', size: PLAN, y: 0.5 },
  { out: 'foundation.jpg', file: 'foundation-kaleidico-26MJGnCM0Wc.jpg', size: STEP, y: 0.5 },
  { out: 'distribution.jpg', file: 'distribution-lance-reis-8koSbeUK6O4.jpg', size: STEP, y: 0.5 },
  { out: 'optimisation.jpg', file: 'optimisation-luke-chesser-JKUTrJ4vK00.jpg', size: STEP, y: 0.5 },
  { out: 'team.jpg', file: 'band-chase-chappell-m29D0DvAhF0.jpg', size: BAND, y: 0.5 },
];

mkdirSync(OUT, { recursive: true });

for (const { out, file, size, y } of FRAMES) {
  const base = sharp(`${SRC}/${file}`).rotate().toColourspace('srgb');
  const { width, height } = await base.clone().toBuffer({ resolveWithObject: true }).then((r) => r.info);
  const cropH = Math.min(height, Math.round((width * size.h) / size.w));
  const top = Math.max(0, Math.min(height - cropH, Math.round(y * height - cropH / 2)));
  const dest = `${OUT}/${out}`;
  await base
    .extract({ left: 0, top, width, height: cropH })
    .resize(size.w, size.h, { kernel: 'lanczos3', withoutEnlargement: true })
    .jpeg({ quality: 78, mozjpeg: true, progressive: true })
    .toFile(dest);
  console.log(`${dest}  ${(statSync(dest).size / 1024).toFixed(0)}KB`);
}

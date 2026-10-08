/**
 * Swaps pictures in a project's gallery (lib/projects.ts) for new originals:
 * long edge 1900px, sRGB, EXIF removed, progressive mozjpeg, saved over the
 * numbered file the gallery already points at. Prints the w/h to put in the
 * gallery entry.
 *
 *   node scripts/optimize-gallery.mjs
 */
import { statSync } from 'node:fs';
import sharp from 'sharp';

const SRC = '_src/img';
const OUT = 'public/img/work';
const EDGE = 1900;

const SWAPS = [
  { from: 'DSC02228.jpg', to: 'products/san-marzano-wine/03.jpg' },
  { from: 'DSC01599.jpg', to: 'products/san-marzano-wine/04.jpg' },
  { from: 'DJI_20260620100834_0197_D.jpg', to: 'products/san-marzano-wine/05.jpg' },
];

for (const { from, to } of SWAPS) {
  const dest = `${OUT}/${to}`;
  const info = await sharp(`${SRC}/${from}`)
    .rotate()
    .toColourspace('srgb')
    .resize({ width: EDGE, height: EDGE, fit: 'inside', withoutEnlargement: true, kernel: 'lanczos3' })
    .jpeg({ quality: 78, mozjpeg: true, progressive: true })
    .toFile(dest);
  console.log(`${to}  w: ${info.width}, h: ${info.height}  ${(statSync(dest).size / 1024).toFixed(0)}KB`);
}

/**
 * Turns the cover photographs in _src/img/New Campaign Cover into the two web
 * copies each Production project carries (see lib/projects.ts):
 *
 *   cover.jpg  the hero, long edge 2400px
 *   tile.jpg   the grid tile, 1100px tall (tiles are 2:3 and crop to fit, so
 *              height is what keeps a landscape photograph sharp there)
 *
 *   node scripts/optimize-campaign-covers.mjs
 *
 * Originals are 4 to 26MB. Output is sRGB, EXIF removed, progressive mozjpeg.
 * Prints the `cover` and `tile` sizes to put in lib/projects.ts.
 */
import { existsSync, statSync } from 'node:fs';
import sharp from 'sharp';

const SRC = '_src/img/New Campaign Cover';
const OUT = 'public/img/work';

const COVERS = [
  { file: 'Anne Bonny-cover.jpg', to: 'travel/anne-bonny' },
  { file: 'Bhutan Peaceful Tours-cover.JPG', to: 'travel/bhutan-peaceful-tours' },
  { file: 'Nepal-cover.jpg', to: 'travel/nepal' },
  { file: 'Phinisi Armada-cover.JPG', to: 'travel/phinisi-armada' },
  { file: 'Marriot Bonvoy-cover.JPG', to: 'hospitality/marriott-bonvoy' },
  { file: 'FindYourAsri-cover.jpg', to: 'products/find-your-asri' },
  { file: 'Flanagan Surfboard-logo.jpg', to: 'products/flanagan-surfboards' },
  { file: 'hidden-hills-cover.png', to: 'hospitality/hidden-hills-villas' },
];

/** Single-file images that are not a project's cover: the home sector tiles. */
const SECTORS = [{ file: 'Global Brands-cover.jpg', out: 'public/img/sector-brands-rose.jpg', width: 1600 }];

const COVER_EDGE = 2400;
const TILE_HEIGHT = 1100;

const kb = (path) => `${(statSync(path).size / 1024).toFixed(0)}KB`;

for (const { file, to } of COVERS) {
  const src = `${SRC}/${file}`;
  if (!existsSync(src)) {
    console.log(`skip  ${file} (not there yet)`);
    continue;
  }
  // rotate() applies the camera's orientation before the EXIF is dropped.
  const base = () => sharp(src).rotate().toColourspace('srgb');
  const { width, height } = await base().toBuffer({ resolveWithObject: true }).then((r) => r.info);
  const long = Math.max(width, height);
  const k = Math.min(1, COVER_EDGE / long);

  const cover = `${OUT}/${to}/cover.jpg`;
  const c = await base()
    .resize(Math.round(width * k), Math.round(height * k), { kernel: 'lanczos3' })
    .jpeg({ quality: 78, mozjpeg: true, progressive: true })
    .toFile(cover);

  const tile = `${OUT}/${to}/tile.jpg`;
  const t = await base()
    .resize({ height: TILE_HEIGHT, kernel: 'lanczos3' })
    .jpeg({ quality: 76, mozjpeg: true, progressive: true })
    .toFile(tile);

  console.log(`${to}\n  cover: { w: ${c.width}, h: ${c.height} }  ${kb(cover)}\n  tile:  { w: ${t.width}, h: ${t.height} }  ${kb(tile)}`);
}

for (const { file, out, width } of SECTORS) {
  const src = `${SRC}/${file}`;
  if (!existsSync(src)) {
    console.log(`skip  ${file} (not there yet)`);
    continue;
  }
  const o = await sharp(src)
    .rotate()
    .toColourspace('srgb')
    .resize({ width, withoutEnlargement: true, kernel: 'lanczos3' })
    .jpeg({ quality: 78, mozjpeg: true, progressive: true })
    .toFile(out);
  console.log(`${out}\n  { w: ${o.width}, h: ${o.height} }  ${kb(out)}`);
}

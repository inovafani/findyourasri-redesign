/**
 * Runs after `next build` and reads what will actually ship in out/. It first
 * removes the case-study placeholder route, then fails the build when:
 *   · any page, metadata or JSON-LD contains an em dash (U+2014);
 *   · the long form of Cam's name appears anywhere;
 *   · a hidden page shows up in the sitemap, llms.txt or any internal link,
 *     or lacks noindex in its HTML or its header in netlify.toml;
 *   · a thank-you page is in the sitemap.
 */
import { existsSync, readdirSync, readFileSync, rmSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const OUT = 'out';
const errors = [];

// /work/[slug]/ builds a placeholder while no case study is approved, because a
// static export must generate at least one route. It never ships.
const placeholder = join(OUT, 'work', '_none');
if (existsSync(placeholder)) rmSync(placeholder, { recursive: true });

function walk(dir) {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    return statSync(path).isDirectory() ? walk(path) : [path];
  });
}

const files = walk(OUT).filter((f) => /\.(html|xml|txt|json)$/.test(f) && !f.endsWith('__forms.html'));

// Hidden slugs: the root folders that carry a noindex and are not in the sitemap.
const content = readFileSync('lib/content.ts', 'utf8');
const hiddenBlock = content.slice(content.indexOf('export const hiddenPages'));
const hidden = [...hiddenBlock.matchAll(/^\s{4}slug: '([^']+)'/gm)].map((m) => m[1]);

const sitemap = readFileSync(join(OUT, 'sitemap.xml'), 'utf8');
const llms = readFileSync(join(OUT, 'llms.txt'), 'utf8');
const netlify = readFileSync('netlify.toml', 'utf8');

for (const file of files) {
  const text = readFileSync(file, 'utf8');
  const name = relative(OUT, file);

  if (text.includes('—')) errors.push(`${name}: contains an em dash`);
  if (/Cameron/.test(text)) errors.push(`${name}: uses "Cameron"; the name is "Cam"`);

  if (file.endsWith('.html')) {
    for (const slug of hidden) {
      if (name.startsWith(`${slug}/`)) continue;
      if (new RegExp(`href="/${slug}/?["?#]`).test(text)) errors.push(`${name}: links to hidden page /${slug}/`);
    }
  }
}

for (const slug of hidden) {
  const page = join(OUT, slug, 'index.html');
  let html = '';
  try {
    html = readFileSync(page, 'utf8');
  } catch {
    errors.push(`/${slug}/: hidden page was not built`);
    continue;
  }
  if (!/<meta name="robots" content="noindex, nofollow"/.test(html)) errors.push(`/${slug}/: missing noindex`);
  if (sitemap.includes(`/${slug}/`)) errors.push(`/${slug}/: listed in sitemap.xml`);
  if (llms.includes(`/${slug}/`)) errors.push(`/${slug}/: listed in llms.txt`);
  if (!netlify.includes(`for = "/${slug}/*"`)) errors.push(`/${slug}/: no X-Robots-Tag header in netlify.toml`);
}

if (/thank-you/.test(sitemap)) errors.push('sitemap.xml: lists a thank-you page');

if (errors.length) {
  console.error(`\ncheck-build: ${errors.length} problem(s)\n  ${errors.join('\n  ')}\n`);
  process.exit(1);
}
console.log(`check-build: ${files.length} files clean, ${hidden.length} hidden page(s) checked.`);

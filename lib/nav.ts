/**
 * Whether a nav link points at the page currently on screen.
 *
 * `next.config.ts` sets `trailingSlash: true`, so `usePathname()` hands back
 * `/work/` while `navLinks` holds `/work` — both sides are normalised before
 * comparing. A nested route (`/work/some-project/`) keeps its parent lit, but
 * `/` only matches itself, or it would claim every page.
 */
export function isActivePath(pathname: string | null, href: string) {
  if (!pathname) return false;

  const strip = (value: string) => value.replace(/\/+$/, '') || '/';
  const here = strip(pathname);
  const target = strip(href);

  if (target === '/') return here === '/';
  return here === target || here.startsWith(`${target}/`);
}

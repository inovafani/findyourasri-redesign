/**
 * Long films live on the Bunny CDN (storage and pull zone `asri-media`), not
 * in the repo. NEXT_PUBLIC_MEDIA_URL is the pull zone's address; the files sit
 * at the root of the storage zone.
 */
const MEDIA = (process.env.NEXT_PUBLIC_MEDIA_URL ?? '').replace(/\/$/, '');
/** A file at the root of the Bunny storage zone, or in /public/video without it. */
export const media = (file: string) => (MEDIA ? `${MEDIA}/${file}` : `/video/${file}`);

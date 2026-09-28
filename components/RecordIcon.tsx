export type RecordIconName = 'globe' | 'islands' | 'archive' | 'seal' | 'anchor' | 'sails';

/**
 * The marks on the record.
 *
 * Built from primitives only, circles, arcs and straight lines, so they read
 * as the symbols on a chart rather than as little pictures. A 24px box, a
 * 1.25px stroke in currentColor, round caps and joins, nothing filled.
 */
const paths: Record<RecordIconName, React.ReactNode> = {
  // Reach: a globe reduced to its latitudes and one meridian.
  globe: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M4.2 8.6h15.6M3.5 12h17M4.2 15.4h15.6" />
      <path d="M12 3.5c2.2 2.4 3.4 5.3 3.4 8.5s-1.2 6.1-3.4 8.5c-2.2-2.4-3.4-5.3-3.4-8.5S9.8 5.9 12 3.5Z" />
    </>
  ),
  // Ground covered: an island drawn in contours, as the pages are.
  islands: (
    <>
      <path d="M11.4 3.4c4.2 0 8.1 2.3 8.1 6s-3.5 6.4-7.7 6.4S4 13.2 4 9.6s3.2-6.2 7.4-6.2Z" />
      <path d="M11.6 6.2c2.6 0 5.3 1.4 5.3 3.6s-2.3 4-4.9 4-5.1-1.5-5.1-3.7 2.1-3.9 4.7-3.9Z" />
      <path d="M11.8 8.9c1.3 0 2.6.6 2.6 1.6s-1.1 1.8-2.4 1.8-2.5-.7-2.5-1.7 1-1.7 2.3-1.7Z" />
      <path d="M3 19.8c1.5 0 1.5-1.2 3-1.2s1.5 1.2 3 1.2 1.5-1.2 3-1.2 1.5 1.2 3 1.2 1.5-1.2 3-1.2 1.5 1.2 3 1.2" />
    </>
  ),
  // The archive: layers, one behind the other.
  archive: (
    <>
      <rect x="3.5" y="8.5" width="13" height="12" rx="1.5" />
      <path d="M7 5.5h11a2 2 0 0 1 2 2v10" />
    </>
  ),
  // Commissioned: a tag, struck and hung.
  seal: (
    <>
      <path d="M6.5 3.5h7.1a2 2 0 0 1 1.5.7l4.7 5.5a2 2 0 0 1 0 2.6l-4.7 5.5a2 2 0 0 1-1.5.7H6.5a2 2 0 0 1-2-2V5.5a2 2 0 0 1 2-2Z" />
      <circle cx="9" cy="11" r="1.6" />
    </>
  ),
  // Vessel access: a compass rose.
  anchor: (
    <>
      <path d="m12 2.5 2.3 7.2 7.2 2.3-7.2 2.3-2.3 7.2-2.3-7.2L2.5 12l7.2-2.3z" />
      <path d="M5.6 5.6 8 8M18.4 5.6 16 8M18.4 18.4 16 16M5.6 18.4 8 16" />
    </>
  ),
  // The flagship event: a sail over the waterline.
  sails: (
    <>
      <path d="M13 3.8 19 16.5H7z" />
      <path d="M13 3.8V18" />
      <path d="M3 20.2h18" />
    </>
  ),
};

export default function RecordIcon({ name }: { name: RecordIconName }) {
  return (
    <svg
      className="record__icon"
      viewBox="0 0 24 24"
      width="28"
      height="28"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {paths[name]}
    </svg>
  );
}

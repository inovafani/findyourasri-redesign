/**
 * The round "go" mark on a linked card: a hairline circle with a diagonal
 * arrow that fills with the accent when its card is hovered. Decorative; the
 * card around it is the link.
 */
export default function ArrowButton() {
  return (
    <span className="arrow-btn" aria-hidden="true">
      <svg viewBox="0 0 16 16" width="14" height="14" fill="none">
        <path
          d="M4.5 11.5 11.5 4.5M5.75 4.5h5.75v5.75"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

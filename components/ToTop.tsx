'use client';

import { initGsap, motionIsOff, scrollToTarget } from '@/lib/gsap';

/** The footer's back-to-top control. */
export default function ToTop() {
  return (
    <button
      type="button"
      className="to-top reveal"
      aria-label="Back to top"
      onClick={() => {
        if (motionIsOff()) {
          window.scrollTo(0, 0);
          return;
        }
        initGsap();
        scrollToTarget(0);
      }}
    >
      <span aria-hidden="true">&#8593;</span>
    </button>
  );
}

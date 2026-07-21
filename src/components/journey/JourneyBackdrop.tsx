// This backdrop no longer needs framer-motion or scroll-stack context —
// see the component below for why.

/**
 * A fixed backdrop behind every slide. Previously this morphed through
 * seven dark, blurred gradient stops plus light rays, fog, and a
 * continuously-animating canvas particle field — expensive on every
 * browser regardless of which page was showing. Replaced with a flat,
 * light background color; each page's own colorful wash (see
 * Destinations/Nature/Culture/Culinary/Gallery/Events) now carries the
 * per-chapter color identity instead.
 */
export function JourneyBackdrop() {
  return <div aria-hidden className="pointer-events-none fixed inset-0 z-0 bg-background" />;
}

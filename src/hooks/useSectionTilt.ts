import { useScroll, useTransform } from "framer-motion";
import type { RefObject } from "react";

/**
 * Ties a section's content to a continuous 3D tilt driven by scroll
 * progress, rather than a one-shot "reveal on enter" animation. As the
 * section scrolls up from the bottom of the viewport the content is
 * tilted back (rotateX negative) and translated down/faded; by the time
 * it's centered it sits flat (rotateX 0, full opacity); as it continues
 * scrolling out the top it tilts forward the other way and fades again.
 * This reads as an ongoing 3D transition *while* scrolling between
 * sections, not a single flourish that plays once and then is static.
 */
export function useSectionTilt(ref: RefObject<HTMLElement | null>) {
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const rotateX = useTransform(scrollYProgress, [0, 0.28, 0.72, 1], [-14, 0, 0, 14]);
  const y = useTransform(scrollYProgress, [0, 0.28, 0.72, 1], [70, 0, 0, -50]);
  const opacity = useTransform(scrollYProgress, [0, 0.15, 0.85, 1], [0, 1, 1, 0]);
  return { rotateX, y, opacity };
}

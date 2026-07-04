import { useEffect, useState, type RefObject } from "react";

/**
 * Returns true once the given element has scrolled within `rootMargin` of the
 * viewport, and stays true afterwards. Used to defer mounting expensive
 * WebGL/Three.js scenes until a section is actually about to be seen.
 */
export function useInView<T extends Element>(ref: RefObject<T | null>, rootMargin = "200px") {
  const [inView, setInView] = useState(false);

  useEffect(() => {
    if (inView) return;
    const node = ref.current;
    if (!node) return;

    if (typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { rootMargin },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [ref, inView, rootMargin]);

  return inView;
}

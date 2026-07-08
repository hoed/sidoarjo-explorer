import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { motion, useMotionValue, animate } from "framer-motion";
import { ScrollStackContext } from "@/lib/scroll-stack-context";

type Slide = { id: string; content: ReactNode };

const TRANSITION_MS = 750;

function isEditableTarget(el: EventTarget | null) {
  if (!(el instanceof HTMLElement)) return false;
  const tag = el.tagName;
  return tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || el.isContentEditable;
}

export function ScrollStack({ slides, children }: { slides: Slide[]; children?: ReactNode }) {
  const total = slides.length;
  const ids = useMemo(() => slides.map((s) => s.id), [slides]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentIndexRef = useRef(0);
  const animatingRef = useRef(false);
  const slideBodyRefs = useRef<(HTMLDivElement | null)[]>([]);
  const progress = useMotionValue(0);
  const touchStartY = useRef<number | null>(null);

  const goTo = (index: number) => {
    const clamped = Math.max(0, Math.min(total - 1, index));
    if (clamped === currentIndexRef.current || animatingRef.current) return;
    animatingRef.current = true;
    currentIndexRef.current = clamped;
    setCurrentIndex(clamped);
    animate(progress, clamped / (total - 1), { duration: TRANSITION_MS / 1000, ease: [0.22, 1, 0.36, 1] });
    window.setTimeout(() => {
      animatingRef.current = false;
    }, TRANSITION_MS);
  };

  const goToId = (id: string) => {
    const idx = ids.indexOf(id);
    if (idx !== -1) goTo(idx);
  };

  // Lock the page's native scroll — the stack owns vertical navigation.
  useEffect(() => {
    const { style } = document.documentElement;
    const prevOverflow = style.overflow;
    style.overflow = "hidden";
    return () => {
      style.overflow = prevOverflow;
    };
  }, []);

  useEffect(() => {
    function activeBodyAtEdge(direction: 1 | -1) {
      const body = slideBodyRefs.current[currentIndexRef.current];
      if (!body) return true;
      const atTop = body.scrollTop <= 1;
      const atBottom = body.scrollTop + body.clientHeight >= body.scrollHeight - 1;
      return direction > 0 ? atBottom : atTop;
    }

    function onWheel(e: WheelEvent) {
      if (Math.abs(e.deltaY) < 2) return;
      const direction: 1 | -1 = e.deltaY > 0 ? 1 : -1;
      if (!activeBodyAtEdge(direction)) return; // let the slide's own content scroll first
      const idx = currentIndexRef.current;
      if ((direction > 0 && idx >= total - 1) || (direction < 0 && idx <= 0)) return;
      e.preventDefault();
      goTo(idx + direction);
    }

    function onKeyDown(e: KeyboardEvent) {
      if (isEditableTarget(e.target)) return;
      if (e.key === "ArrowDown" || e.key === "PageDown") {
        e.preventDefault();
        goTo(currentIndexRef.current + 1);
      } else if (e.key === "ArrowUp" || e.key === "PageUp") {
        e.preventDefault();
        goTo(currentIndexRef.current - 1);
      } else if (e.key === "Home") {
        e.preventDefault();
        goTo(0);
      } else if (e.key === "End") {
        e.preventDefault();
        goTo(total - 1);
      }
    }

    function onTouchStart(e: TouchEvent) {
      touchStartY.current = e.touches[0]?.clientY ?? null;
    }
    function onTouchMove(e: TouchEvent) {
      if (touchStartY.current == null) return;
      const dy = touchStartY.current - (e.touches[0]?.clientY ?? touchStartY.current);
      if (Math.abs(dy) < 40) return; // swipe threshold
      const direction: 1 | -1 = dy > 0 ? 1 : -1;
      if (!activeBodyAtEdge(direction)) return;
      const idx = currentIndexRef.current;
      if ((direction > 0 && idx >= total - 1) || (direction < 0 && idx <= 0)) return;
      e.preventDefault();
      touchStartY.current = null;
      goTo(idx + direction);
    }

    window.addEventListener("wheel", onWheel, { passive: false, capture: true });
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("touchstart", onTouchStart, { passive: true, capture: true });
    window.addEventListener("touchmove", onTouchMove, { passive: false, capture: true });
    return () => {
      window.removeEventListener("wheel", onWheel, { capture: true });
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("touchstart", onTouchStart, { capture: true });
      window.removeEventListener("touchmove", onTouchMove, { capture: true });
    };
    // total is stable for the component's lifetime; goTo/ids are stable enough via refs.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [total]);

  return (
    <ScrollStackContext.Provider value={{ currentIndex, total, ids, progress, goTo, goToId }}>
      {children}
      <div className="fixed inset-0 h-[100dvh] w-full overflow-hidden" style={{ perspective: 2400 }}>
        {slides.map((slide, i) => {
          const diff = i - currentIndex;
          if (Math.abs(diff) > 1) return null; // keep DOM light — only render neighbors

          const isActive = diff === 0;
          const target =
            diff === 0
              ? { rotateX: 0, y: "0%", scale: 1, opacity: 1 }
              : diff > 0
                ? { rotateX: -38, y: "6%", scale: 0.92, opacity: 0 }
                : { rotateX: 38, y: "-6%", scale: 0.92, opacity: 0 };

          return (
            <motion.div
              key={slide.id}
              initial={false}
              animate={target}
              transition={{ duration: TRANSITION_MS / 1000, ease: [0.22, 1, 0.36, 1] }}
              style={{
                transformStyle: "preserve-3d",
                transformOrigin: diff > 0 ? "bottom center" : "top center",
                zIndex: isActive ? 10 : 5,
                pointerEvents: isActive ? "auto" : "none",
              }}
              className="absolute inset-0 h-full w-full"
            >
              <div
                ref={(el) => {
                  slideBodyRefs.current[i] = el;
                }}
                className="h-full w-full overflow-y-auto overflow-x-hidden"
                aria-hidden={!isActive}
              >
                {slide.content}
              </div>
            </motion.div>
          );
        })}
      </div>
    </ScrollStackContext.Provider>
  );
}

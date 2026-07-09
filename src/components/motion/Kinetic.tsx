import { motion, useReducedMotion, type Variants } from "framer-motion";
import { useEffect, useMemo, useState, type CSSProperties, type ReactNode } from "react";

/**
 * Kinetic typography + image reveal primitives inspired by award-winning
 * agency reels (Awwwards / SOTD style): mask/clip word reveals from the
 * bottom, letter drift with blur, image curtain reveals via clip-path.
 *
 * All primitives honor prefers-reduced-motion.
 */

const EASE = [0.22, 1, 0.36, 1] as const;

// ---------------- SplitText: word-by-word mask reveal ----------------

type SplitTextProps = {
  text: string;
  as?: "h1" | "h2" | "h3" | "h4" | "p" | "span" | "div";
  className?: string;
  wordClassName?: string;
  delay?: number;
  stagger?: number;
  duration?: number;
  /** How far each word starts below its final position (in em). */
  distance?: number;
  once?: boolean;
  amount?: number;
};

/**
 * Splits `text` into words, each wrapped in an overflow-hidden mask
 * with the letters translated up from below on scroll into view.
 * Reads exactly like the kinetic type reveals in the reference video.
 */
export function SplitText({
  text,
  as = "span",
  className = "",
  wordClassName = "",
  delay = 0,
  stagger = 0.06,
  duration = 0.9,
  distance = 1.1,
  once = true,
  amount = 0.4,
}: SplitTextProps) {
  const reduced = useReducedMotion();
  const words = useMemo(() => text.split(/(\s+)/), [text]);

  const container: Variants = {
    hidden: {},
    show: {
      transition: { staggerChildren: reduced ? 0 : stagger, delayChildren: delay },
    },
  };

  const child: Variants = reduced
    ? { hidden: { opacity: 0 }, show: { opacity: 1 } }
    : {
        hidden: { y: `${distance * 100}%` },
        show: { y: "0%", transition: { duration, ease: EASE } },
      };

  const MotionTag = motion[as] as typeof motion.span;

  return (
    <MotionTag
      className={className}
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once, amount }}
      aria-label={text}
    >
      {words.map((w, i) =>
        /^\s+$/.test(w) ? (
          <span key={i} aria-hidden> </span>
        ) : (
          <span
            key={i}
            aria-hidden
            className={`inline-block overflow-hidden align-baseline ${wordClassName}`}
            style={{ lineHeight: 1.05 }}
          >
            <motion.span className="inline-block will-change-transform" variants={child}>
              {w}
            </motion.span>
          </span>
        ),
      )}
    </MotionTag>
  );
}

// ---------------- BlurWords: soft blur-in per word ----------------

export function BlurWords({
  text,
  className = "",
  delay = 0,
  stagger = 0.04,
}: {
  text: string;
  className?: string;
  delay?: number;
  stagger?: number;
}) {
  const reduced = useReducedMotion();
  const words = useMemo(() => text.split(/(\s+)/), [text]);

  return (
    <motion.span
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.4 }}
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: reduced ? 0 : stagger, delayChildren: delay } },
      }}
      aria-label={text}
    >
      {words.map((w, i) =>
        /^\s+$/.test(w) ? (
          <span key={i} aria-hidden> </span>
        ) : (
          <motion.span
            key={i}
            aria-hidden
            className="inline-block will-change-[filter,transform,opacity]"
            variants={{
              hidden: reduced
                ? { opacity: 0 }
                : { opacity: 0, y: 14, filter: "blur(12px)" },
              show: reduced
                ? { opacity: 1 }
                : { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.85, ease: EASE } },
            }}
          >
            {w}
          </motion.span>
        ),
      )}
    </motion.span>
  );
}

// ---------------- ClipReveal: curtain-rise image mask ----------------

type ClipRevealProps = {
  children: ReactNode;
  className?: string;
  /** "up" curtain from bottom, "down" from top, "left"/"right" horizontal. */
  from?: "up" | "down" | "left" | "right";
  delay?: number;
  duration?: number;
  scale?: number;
  style?: CSSProperties;
};

/**
 * Wraps children (typically an <img> or media block) in a clip-path
 * curtain reveal — the mask animates open while the content itself
 * scales down from a slight over-zoom, mimicking the case-study
 * transitions in the reference video.
 */
export function ClipReveal({
  children,
  className = "",
  from = "up",
  delay = 0,
  duration = 1.4,
  scale = 1.12,
  style,
}: ClipRevealProps) {
  const reduced = useReducedMotion();
  // Belt-and-suspenders: whileInView's IntersectionObserver can fail to
  // fire reliably for content nested inside the ScrollStack's rotateX/
  // scale-transformed slide ancestors (a slide can become the active,
  // fully-on-screen slide without ever registering as "intersecting" in
  // some browsers). Force the reveal open after a short delay regardless,
  // so images can never get permanently stuck clipped to nothing.
  const [forceShow, setForceShow] = useState(false);
  useEffect(() => {
    const t = window.setTimeout(() => setForceShow(true), 1200 + delay * 1000);
    return () => window.clearTimeout(t);
  }, [delay]);

  const clipInitial = reduced
    ? "inset(0% 0% 0% 0%)"
    : from === "up"
      ? "inset(100% 0% 0% 0%)"
      : from === "down"
        ? "inset(0% 0% 100% 0%)"
        : from === "left"
          ? "inset(0% 100% 0% 0%)"
          : "inset(0% 0% 0% 100%)";

  return (
    <motion.div
      className={`relative overflow-hidden ${className}`}
      style={style}
      initial="hidden"
      whileInView="show"
      animate={forceShow ? "show" : undefined}
      viewport={{ once: true, amount: 0.25 }}
      variants={{
        hidden: { clipPath: clipInitial },
        show: {
          clipPath: "inset(0% 0% 0% 0%)",
          transition: { duration, ease: EASE, delay },
        },
      }}
    >
      <motion.div
        className="h-full w-full"
        initial="hidden"
        animate={forceShow ? "show" : undefined}
        whileInView={forceShow ? undefined : "show"}
        viewport={{ once: true, amount: 0.25 }}
        variants={{
          hidden: { scale: reduced ? 1 : scale },
          show: { scale: 1, transition: { duration: duration + 0.2, ease: EASE, delay } },
        }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}

// ---------------- Marquee: infinite horizontal band ----------------

export function Marquee({
  children,
  speed = 32,
  className = "",
}: {
  children: ReactNode;
  speed?: number;
  className?: string;
}) {
  return (
    <div
      className={`overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_10%,black_90%,transparent)] ${className}`}
    >
      <motion.div
        className="flex gap-16 whitespace-nowrap"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: speed, ease: "linear", repeat: Infinity }}
      >
        <div className="flex shrink-0 gap-16">{children}</div>
        <div className="flex shrink-0 gap-16" aria-hidden>{children}</div>
      </motion.div>
    </div>
  );
}

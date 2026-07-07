import { motion } from "framer-motion";
import type { ReactNode } from "react";

type Props = {
  eyebrow: string;
  title: ReactNode;
  body?: ReactNode;
  children?: ReactNode;
  /**
   * Content rendered full-bleed, outside the `max-w-6xl` text column —
   * use this for anything that should span the full viewport width
   * (e.g. the Leaflet map), since `children` is nested inside a
   * width-constrained wrapper and can never exceed it, even with `w-full`.
   */
  fullBleedChildren?: ReactNode;
  align?: "left" | "center" | "right";
  id?: string;
};

/**
 * A single chapter — one slide in the ScrollStack. The heading fades/settles
 * in on mount (each Chapter only mounts once it becomes the active or a
 * neighboring slide) rather than tracking window scroll, since each slide
 * now scrolls independently inside its own container.
 */
export function Chapter({ eyebrow, title, body, children, fullBleedChildren, align = "left", id }: Props) {
  const alignCls =
    align === "center" ? "items-center text-center" : align === "right" ? "items-end text-right" : "items-start";

  return (
    <section id={id} className="relative py-32 md:py-48">
      <div className={`mx-auto flex max-w-6xl flex-col ${alignCls} px-6`}>
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className={`max-w-3xl ${align === "center" ? "mx-auto" : ""}`}
        >
          <p className="text-[10px] uppercase tracking-[0.4em] text-primary">{eyebrow}</p>
          <h2 className="mt-6 text-5xl font-light leading-[1.05] md:text-7xl">{title}</h2>
          {body && <div className="mt-8 max-w-xl text-lg text-muted-foreground">{body}</div>}
        </motion.div>
        {children && <div className="mt-16 w-full">{children}</div>}
      </div>
      {fullBleedChildren && <div className="mt-16 w-full">{fullBleedChildren}</div>}
    </section>
  );
}

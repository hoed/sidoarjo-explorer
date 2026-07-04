import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, type ReactNode } from "react";

type Props = {
  eyebrow: string;
  title: ReactNode;
  body?: ReactNode;
  children?: ReactNode;
  align?: "left" | "center" | "right";
  id?: string;
};

/**
 * A single chapter of the journey. The heading rides a scroll-linked
 * fade/scale so scenes emerge and dissolve into each other without hard cuts.
 */
export function Chapter({ eyebrow, title, body, children, align = "left", id }: Props) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const y = useTransform(scrollYProgress, [0, 0.5, 1], [40, 0, -30]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.98, 1, 1.02]);

  const alignCls =
    align === "center" ? "items-center text-center" : align === "right" ? "items-end text-right" : "items-start";

  return (
    <section ref={ref} id={id} className="relative py-32 md:py-48">
      <div className={`mx-auto flex max-w-6xl flex-col ${alignCls} px-6`}>
        <motion.div style={{ opacity, y, scale }} className={`max-w-3xl ${align === "center" ? "mx-auto" : ""}`}>
          <p className="text-[10px] uppercase tracking-[0.4em] text-primary">{eyebrow}</p>
          <h2 className="mt-6 text-5xl font-light leading-[1.05] md:text-7xl">{title}</h2>
          {body && <div className="mt-8 max-w-xl text-lg text-muted-foreground">{body}</div>}
        </motion.div>
        {children && <div className="mt-16 w-full">{children}</div>}
      </div>
    </section>
  );
}

import { motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { SplitText, BlurWords } from "@/components/motion/Kinetic";

function Counter({ to, suffix = "" }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const start = performance.now();
    const dur = 1800;
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min((t - start) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setN(Math.floor(to * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, to]);
  return <span ref={ref}>{n.toLocaleString()}{suffix}</span>;
}

const stats = [
  { v: 62, s: "+", label: "Curated destinations" },
  { v: 18, s: "", label: "Districts of wonder" },
  { v: 2.3, s: "M", label: "Annual visitors" },
  { v: 1350, s: "", label: "Years of heritage" },
];

export function Intro() {
  const sectionRef = useRef<HTMLElement>(null);
  return (
    <section id="intro" ref={sectionRef} className="relative overflow-hidden py-32 md:py-48" style={{ perspective: 1600 }}>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,color-mix(in_oklab,var(--primary)_15%,transparent),transparent_60%)]" />
      {/* Giant faint watermark — fills the empty space typographically since this page has no photo */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 select-none text-center font-[family-name:var(--font-display)] text-[26vw] font-light italic leading-none text-white/[0.035] md:text-[18vw]"
      >
        Sidoarjo
      </div>
      <motion.div style={{ transformStyle: "preserve-3d" }} className="relative mx-auto grid max-w-7xl grid-cols-1 gap-16 px-6 md:grid-cols-12">
        <div className="md:col-span-5">
          <motion.p initial={{ opacity: 0, scale: 0.7 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }} className="text-[10px] uppercase tracking-[0.4em] text-primary">
            01 — Introduction
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, scale: 0.82 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="mt-6 text-5xl font-light leading-[1.05] md:text-7xl"
          >
            <SplitText text="Where the delta" as="span" className="block" />
            <SplitText text="meets the sky." as="span" className="block italic text-gradient-cyan" delay={0.15} />
          </motion.h2>
          <motion.div
            initial={{ scaleY: 0, opacity: 0 }}
            whileInView={{ scaleY: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            style={{ transformOrigin: "top" }}
            className="mt-10 flex items-start gap-4"
          >
            <span className="h-24 w-px shrink-0 bg-gradient-to-b from-primary via-accent to-transparent" />
            <span className="font-[family-name:var(--font-display)] text-xl italic leading-snug text-muted-foreground">
              &ldquo;Every delta has a heartbeat. Ours just happens to taste like kupang and smell like clove smoke.&rdquo;
            </span>
          </motion.div>
        </div>
        <div className="md:col-span-6 md:col-start-7 md:pt-10">
          <p className="text-lg leading-relaxed text-muted-foreground md:text-xl">
            <BlurWords text="Badan Promosi Pariwisata Daerah Sidoarjo is the official custodian of one of East Java's most storied regions — a delta where ancient temples rise beside living mangroves, where batik is still hand-drawn on quiet river mornings, and where every meal is a coastline in a bowl." />
          </p>
          <p className="mt-6 text-base leading-relaxed text-muted-foreground">
            <BlurWords text="We invite you to move slowly. To listen. To taste. To remember." delay={0.2} />
          </p>

          <div className="mt-14 grid grid-cols-2 gap-x-8 gap-y-12 md:gap-x-12">
            {stats.map((st, i) => (
              <motion.div
                key={st.label}
                initial={{ opacity: 0, y: 70, rotate: i % 2 ? 10 : -10, scale: 0.6 }}
                whileInView={{ opacity: 1, y: 0, rotate: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.8, ease: [0.34, 1.56, 0.64, 1] }}
                className="border-l-2 border-accent/40 pl-4"
              >
                <div className="font-[family-name:var(--font-display)] text-6xl font-light text-gradient-gold md:text-7xl">
                  <Counter to={st.v} suffix={st.s} />
                </div>
                <div className="mt-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">{st.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}

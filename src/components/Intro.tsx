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
    <section id="intro" ref={sectionRef} className="relative py-32 md:py-48" style={{ perspective: 1600 }}>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,color-mix(in_oklab,var(--primary)_15%,transparent),transparent_60%)]" />
      <motion.div style={{ transformStyle: "preserve-3d" }} className="relative mx-auto grid max-w-7xl grid-cols-1 gap-16 px-6 md:grid-cols-12">
        <div className="md:col-span-5" style={{ perspective: 1200 }}>
          <motion.p initial={{ opacity: 0, y: 20, rotateX: -20 }} whileInView={{ opacity: 1, y: 0, rotateX: 0 }} viewport={{ once: true }} transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }} className="text-[10px] uppercase tracking-[0.4em] text-primary">
            01 — Introduction
          </motion.p>
          <h2 className="mt-6 text-5xl font-light leading-[1.05] md:text-7xl">
            <SplitText text="Where the delta" as="span" className="block" />
            <SplitText text="meets the sky." as="span" className="block italic text-gradient-cyan" delay={0.15} />
          </h2>
        </div>
        <div className="md:col-span-6 md:col-start-7 md:pt-10">
          <p className="text-lg leading-relaxed text-muted-foreground md:text-xl">
            <BlurWords text="Badan Promosi Pariwisata Daerah Sidoarjo is the official custodian of one of East Java's most storied regions — a delta where ancient temples rise beside living mangroves, where batik is still hand-drawn on quiet river mornings, and where every meal is a coastline in a bowl." />
          </p>
          <p className="mt-6 text-base leading-relaxed text-muted-foreground">
            <BlurWords text="We invite you to move slowly. To listen. To taste. To remember." delay={0.2} />
          </p>

          <div className="mt-14 grid grid-cols-2 gap-8 md:gap-12" style={{ perspective: 1200 }}>
            {stats.map((st, i) => (
              <motion.div key={st.label} initial={{ opacity: 0, y: 30, rotateX: -22 }} whileInView={{ opacity: 1, y: 0, rotateX: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 1, ease: [0.22, 1, 0.36, 1] }}>
                <div className="text-5xl font-light text-gradient-gold md:text-6xl">
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

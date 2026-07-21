import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { HeroScene } from "./HeroScene";
import { SceneErrorBoundary } from "./SceneErrorBoundary";
import heroImg from "@/assets/hero-sidoarjo.jpg";

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);

  return (
    <section ref={ref} id="top" className="relative h-[100svh] w-full overflow-hidden bg-hero">
      {/* Aerial photo backdrop */}
      <motion.div style={{ scale, opacity }} className="absolute inset-0">
        <img src={heroImg} alt="Aerial view of Sidoarjo mangrove wetlands at sunrise" className="h-full w-full object-cover opacity-40" width={1920} height={1280} />
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/30 to-background" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_20%,var(--background)_85%)]" />
      </motion.div>

      {/* Aurora */}
      <div className="pointer-events-none absolute inset-0 opacity-40">
        <div className="absolute left-1/2 top-1/2 h-[80vmax] w-[80vmax] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--gradient-aurora)] blur-3xl animate-aurora" />
      </div>

      {/* 3D Canvas */}
      <motion.div style={{ opacity }} className="absolute inset-0">
        <SceneErrorBoundary>
          <HeroScene />
        </SceneErrorBoundary>
      </motion.div>

      {/* Content */}
      <motion.div style={{ y, opacity }} className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center">
        <motion.span
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 1 }}
          className="mb-8 inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-[10px] uppercase tracking-[0.28em] text-muted-foreground"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
          Badan Promosi Pariwisata Daerah • East Java
        </motion.span>

        <h1 className="max-w-[16ch] text-[clamp(2.75rem,8vw,7rem)] font-light leading-[0.95]">
          {"Discover the".split("").map((c, i) => (
            <motion.span key={"a" + i} initial={{ opacity: 0, y: 30, filter: "blur(10px)" }} animate={{ opacity: 1, y: 0, filter: "blur(0px)" }} transition={{ delay: 0.9 + i * 0.03, duration: 0.8 }} className="inline-block">
              {c === " " ? "\u00A0" : c}
            </motion.span>
          ))}
          <br />
          <span className="italic text-gradient-gold">Hidden Wonders</span>
          <br />
          <span className="text-muted-foreground">of Sidoarjo</span>
        </h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8, duration: 1 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs uppercase tracking-[0.32em] text-muted-foreground"
        >
          <span>Nature</span><span className="text-primary">◆</span>
          <span>Heritage</span><span className="text-accent">◆</span>
          <span>Culture</span><span className="text-primary">◆</span>
          <span>Culinary</span><span className="text-accent">◆</span>
          <span>Adventure</span>
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.1, duration: 1 }}
          className="mt-12 flex flex-col items-center gap-4 sm:flex-row"
        >
          <a href="#intro" data-magnetic className="group relative inline-flex items-center gap-3 overflow-hidden rounded-full bg-gradient-to-r from-primary to-accent px-8 py-4 text-sm font-semibold uppercase tracking-[0.2em] text-background transition-transform hover:scale-[1.03] glow-cyan">
            Explore Now
            <span aria-hidden className="transition-transform group-hover:translate-x-1">→</span>
          </a>
          <a href="#video" data-magnetic className="inline-flex items-center gap-3 rounded-full glass px-8 py-4 text-sm uppercase tracking-[0.2em] hover:bg-foreground/10">
            <span className="grid h-6 w-6 place-items-center rounded-full border border-foreground/40">▶</span>
            Watch Film
          </a>
        </motion.div>
      </motion.div>

      <ScrollHint />
    </section>
  );
}

function ScrollHint() {
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY < 100);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <motion.div
      animate={{ opacity: visible ? 1 : 0 }}
      className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 text-[10px] uppercase tracking-[0.3em] text-muted-foreground"
    >
      <div className="flex flex-col items-center gap-3">
        <span>Scroll to journey</span>
        <span className="relative block h-10 w-px overflow-hidden bg-foreground/20">
          <span className="absolute left-0 top-0 h-4 w-px animate-[reveal-up_2s_ease-in-out_infinite] bg-primary" />
        </span>
      </div>
    </motion.div>
  );
}

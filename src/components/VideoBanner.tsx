import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import hero from "@/assets/hero-sidoarjo.jpg";
import { SplitText, ClipReveal } from "@/components/motion/Kinetic";

export function VideoBanner() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const scale = useTransform(scrollYProgress, [0, 1], [1.2, 1]);
  const y = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);
  return (
    <section id="video" ref={ref} className="relative h-[90svh] overflow-hidden">
      <motion.div style={{ scale, y }} className="absolute inset-0">
        <img src={hero} alt="Cinematic Sidoarjo" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/20 to-background" />
      </motion.div>
      <div className="relative z-10 flex h-full items-center justify-center px-6 text-center">
        <div>
          <p className="text-[10px] uppercase tracking-[0.4em] text-accent">09 — Film</p>
          <h2 className="mx-auto mt-6 max-w-4xl text-5xl font-light md:text-8xl">
            &ldquo;Every scroll is<br /><span className="italic text-gradient-gold">an invitation.&rdquo;</span>
          </h2>
          <button data-magnetic className="mt-10 inline-flex items-center gap-4 rounded-full glass-strong px-8 py-4 text-sm uppercase tracking-[0.2em] transition-colors hover:bg-white/10">
            <span className="grid h-10 w-10 place-items-center rounded-full bg-primary text-background">▶</span>
            Play the Sidoarjo Film
          </button>
        </div>
      </div>
    </section>
  );
}

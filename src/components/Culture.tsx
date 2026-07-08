import { motion } from "framer-motion";
import { useRef } from "react";
import dance from "@/assets/culture-dance.jpg";
import wayang from "@/assets/wayang.jpg";
import batik from "@/assets/batik-jetis.jpg";
import { SplitText, ClipReveal, BlurWords } from "@/components/motion/Kinetic";

export function Culture() {
  const ref = useRef<HTMLElement>(null);
  return (
    <section id="culture" ref={ref} className="relative py-32 md:py-48" style={{ perspective: 1600 }}>
      <motion.div style={{ transformStyle: "preserve-3d" }} className="mx-auto max-w-7xl px-6">
        <div style={{ perspective: 1200 }} className="mb-16 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <motion.div
            initial={{ opacity: 0, y: 50, rotateX: -22 }}
            whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-2xl"
          >
            <p className="text-[10px] uppercase tracking-[0.4em] text-accent">05 — Culture</p>
            <h2 className="mt-6 text-5xl font-light md:text-7xl">
              <SplitText text="Rituals that" as="span" className="block" />
              <SplitText text="refuse to sleep." as="span" className="block italic text-gradient-gold" delay={0.15} />
            </h2>
          </motion.div>
          <p className="max-w-sm text-muted-foreground">
            <BlurWords text="Wayang shadows, Reog fire, gamelan bronze — Sidoarjo carries East Java on its shoulders." />
          </p>
        </div>

        <div style={{ perspective: 1400 }} className="grid grid-cols-1 gap-6 md:grid-cols-12">
          <ClipReveal from="up" duration={1.6} className="rounded-2xl md:col-span-7 md:row-span-2">
            <img src={dance} alt="Traditional Reog dancer" loading="lazy" className="aspect-[4/5] w-full object-cover transition-transform duration-[2s] hover:scale-105" />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background via-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-8">
              <h3 className="text-3xl font-light md:text-5xl">
                <SplitText text="Tari Ujung" as="span" />
              </h3>
              <p className="mt-2 text-sm uppercase tracking-widest text-muted-foreground">Fire, feather, footwork</p>
            </div>
          </ClipReveal>

          <ClipReveal from="right" delay={0.15} duration={1.4} className="rounded-2xl md:col-span-5">
            <img src={wayang} alt="Wayang kulit puppet" loading="lazy" className="aspect-video w-full object-cover transition-transform duration-[2s] hover:scale-105" />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-6">
              <h3 className="text-2xl font-light">Wayang Kulit</h3>
              <p className="mt-1 text-xs uppercase tracking-widest text-muted-foreground">Shadow theatre until dawn</p>
            </div>
          </ClipReveal>

          <ClipReveal from="right" delay={0.3} duration={1.4} className="rounded-2xl md:col-span-5">
            <img src={batik} alt="Batik Jetis" loading="lazy" className="aspect-video w-full object-cover transition-transform duration-[2s] hover:scale-105" />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-6">
              <h3 className="text-2xl font-light">Batik Jetis</h3>
              <p className="mt-1 text-xs uppercase tracking-widest text-muted-foreground">Hand-drawn since 1859</p>
            </div>
          </ClipReveal>
        </div>
      </motion.div>
    </section>
  );
}

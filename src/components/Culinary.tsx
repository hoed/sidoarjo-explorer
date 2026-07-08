import { motion } from "framer-motion";
import { useRef } from "react";
import lontong from "@/assets/lontong-kupang.jpg";
import bandeng from "@/assets/bandeng.jpg";
import otak from "@/assets/otak-otak.jpg";
import { SplitText, ClipReveal } from "@/components/motion/Kinetic";

const dishes = [
  { img: lontong, name: "Lontong Kupang", note: "Tiny clams, rice cake, coconut broth", accent: "Signature" },
  { img: bandeng, name: "Bandeng Asap", note: "Smoked milkfish on banana leaf", accent: "Coastal" },
  { img: otak, name: "Otak-Otak", note: "Grilled fish parcel, sambal petis", accent: "Street" },
];

export function Culinary() {
  const ref = useRef<HTMLElement>(null);
  return (
    <section id="culinary" ref={ref} className="relative py-32 md:py-48" style={{ perspective: 1600 }}>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,color-mix(in_oklab,var(--accent)_15%,transparent),transparent_60%)]" />
      <motion.div style={{ transformStyle: "preserve-3d" }} className="relative mx-auto max-w-7xl px-6">
        <motion.div
          style={{ perspective: 1200 }}
          initial={{ opacity: 0, y: 50, rotateX: -22 }}
          whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="mb-16 max-w-3xl"
        >
          <p className="text-[10px] uppercase tracking-[0.4em] text-accent">06 — Culinary</p>
          <h2 className="mt-6 text-5xl font-light md:text-7xl">
            <SplitText text="The coastline" as="span" className="block" />
            <SplitText text="in a bowl." as="span" className="block italic text-gradient-gold" delay={0.15} />
          </h2>
        </motion.div>

        <div style={{ perspective: 1200 }} className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {dishes.map((d, i) => (
            <motion.article
              key={d.name}
              initial={{ opacity: 0, scale: 0.5, rotate: i % 2 ? 25 : -25 }}
              whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.85, delay: i * 0.12, ease: [0.34, 1.56, 0.64, 1] }}
              className="group relative"
            >
              <ClipReveal from="up" duration={1.4} delay={i * 0.1} className="aspect-square rounded-full glass-strong">
                <img src={d.img} alt={d.name} loading="lazy" className="h-full w-full object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-110" />
                <div className="pointer-events-none absolute inset-0 rounded-full ring-1 ring-inset ring-white/10 transition-all group-hover:ring-accent/60" />
              </ClipReveal>
              <div className="mt-6 text-center">
                <div className="text-[10px] uppercase tracking-[0.3em] text-accent">{d.accent}</div>
                <h3 className="mt-2 text-2xl font-light">{d.name}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{d.note}</p>
              </div>
            </motion.article>
          ))}
        </div>

        <div className="mt-20 overflow-hidden py-6 [mask-image:linear-gradient(90deg,transparent,black_10%,black_90%,transparent)]">
          <div className="flex gap-16 whitespace-nowrap animate-marquee text-4xl italic text-muted-foreground md:text-6xl">
            {Array.from({ length: 2 }).map((_, k) => (
              <span key={k} className="flex gap-16">
                <span>Kupang Lontong</span><span className="text-accent">◆</span>
                <span>Bandeng Presto</span><span className="text-primary">◆</span>
                <span>Petis Udang</span><span className="text-accent">◆</span>
                <span>Otak-Otak</span><span className="text-primary">◆</span>
                <span>Kerupuk Bawang</span><span className="text-accent">◆</span>
              </span>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}

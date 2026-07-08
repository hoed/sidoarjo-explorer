import { motion } from "framer-motion";
import { useRef } from "react";
import { SplitText } from "@/components/motion/Kinetic";
import candiHero from "@/assets/candi-pari.jpg";

const timeline = [
  { year: "8th c.", title: "Kahuripan Kingdom", body: "The delta becomes a hub of the Airlangga era." },
  { year: "1371", title: "Candi Pari built", body: "A Majapahit tribute rises from the flatlands." },
  { year: "1859", title: "Kampung Batik Jetis", body: "Batik canting spreads village to village." },
  { year: "1859", title: "City of Sidoarjo", body: "Officially chartered on 31 January." },
  { year: "2003", title: "Museum Mpu Tantular", body: "Relocated to Buduran — East Java's memory keeps growing." },
  { year: "Today", title: "A rising delta", body: "Heritage, ecology and futures converge." },
];

export function History() {
  const ref = useRef<HTMLElement>(null);
  return (
    <section id="history" ref={ref} className="relative overflow-hidden py-32 md:py-48" style={{ perspective: 1600 }}>
      <div className="pointer-events-none absolute inset-0">
        <img src={candiHero} alt="" aria-hidden loading="lazy" className="h-full w-full object-cover opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/85 to-background" />
      </div>
      <motion.div style={{ transformStyle: "preserve-3d" }} className="mx-auto max-w-7xl px-6">
        <motion.div
          style={{ perspective: 1200 }}
          initial={{ opacity: 0, y: 50, rotateX: -22 }}
          whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="mb-20 max-w-3xl"
        >
          <p className="text-[10px] uppercase tracking-[0.4em] text-primary">04 — History</p>
          <h2 className="mt-6 text-5xl font-light md:text-7xl">
            <SplitText text="A thousand years," as="span" className="block" />
            <SplitText text="one horizon." as="span" className="block italic text-gradient-cyan" delay={0.15} />
          </h2>
        </motion.div>

        <div className="relative" style={{ perspective: 1400 }}>
          <div className="absolute bottom-0 left-1/2 top-0 hidden w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-primary/40 to-transparent md:block" />
          <div className="grid gap-16">
            {timeline.map((t, i) => (
              <motion.div
                key={t.title}
                initial={{ opacity: 0, x: i % 2 ? 90 : -90 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                className={`relative grid grid-cols-1 items-center gap-6 md:grid-cols-2 ${i % 2 ? "md:[direction:rtl]" : ""}`}
              >
                <div className="[direction:ltr] md:pr-12">
                  <div className="glass rounded-2xl p-8">
                    <div className="text-xs uppercase tracking-[0.3em] text-primary">{t.year}</div>
                    <h3 className="mt-3 text-3xl font-light">{t.title}</h3>
                    <p className="mt-3 text-muted-foreground">{t.body}</p>
                  </div>
                </div>
                <div className="absolute left-1/2 hidden h-3 w-3 -translate-x-1/2 rounded-full bg-accent glow-gold md:block" />
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}

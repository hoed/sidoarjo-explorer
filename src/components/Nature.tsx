import { motion, useScroll, useTransform } from "framer-motion";
import { lazy, Suspense, useRef } from "react";
import mangrove from "@/assets/mangrove.jpg";
import delta from "@/assets/delta-fishing.jpg";
import { useInView } from "@/hooks/useInView";
import { useSectionTilt } from "@/hooks/useSectionTilt";

const NatureScene = lazy(() => import("@/components/scenes/NatureScene"));

export function Nature() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y1 = useTransform(scrollYProgress, [0, 1], ["-10%", "20%"]);
  const y2 = useTransform(scrollYProgress, [0, 1], ["10%", "-15%"]);
  const scale = useTransform(scrollYProgress, [0, 1], [1.1, 1.3]);
  const tilt = useSectionTilt(ref);

  return (
    <section id="nature" ref={ref} className="relative overflow-hidden py-32 md:py-48" style={{ perspective: 1600 }}>
      <motion.div style={{ scale }} className="pointer-events-none absolute inset-0">
        <img src={mangrove} alt="" aria-hidden loading="lazy" className="h-full w-full object-cover opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/60 to-background" />
      </motion.div>

      <div className="pointer-events-none absolute inset-0 opacity-70 mix-blend-screen">
        {inView && (
          <Suspense fallback={null}>
            <NatureScene />
          </Suspense>
        )}
      </div>

      <motion.div
        style={{ rotateX: tilt.rotateX, y: tilt.y, opacity: tilt.opacity, transformStyle: "preserve-3d" }}
        className="relative mx-auto max-w-7xl px-6"
      >
        <div className="grid grid-cols-1 gap-12 md:grid-cols-12">
          <div className="md:col-span-5" style={{ perspective: 1200 }}>
            <motion.p initial={{ opacity: 0, y: 30, rotateX: -22 }} whileInView={{ opacity: 1, y: 0, rotateX: 0 }} viewport={{ once: true, amount: 0.5 }} transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }} className="text-[10px] uppercase tracking-[0.4em] text-accent">
              03 — Nature
            </motion.p>
            <motion.h2 initial={{ opacity: 0, y: 40, rotateX: -26 }} whileInView={{ opacity: 1, y: 0, rotateX: 0 }} viewport={{ once: true, amount: 0.5 }} transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }} className="mt-6 text-5xl font-light leading-[1.05] md:text-7xl">
              Water is our<br /><span className="italic text-gradient-gold">first language.</span>
            </motion.h2>
            <motion.p initial={{ opacity: 0, y: 30, rotateX: -18 }} whileInView={{ opacity: 1, y: 0, rotateX: 0 }} viewport={{ once: true, amount: 0.5 }} transition={{ duration: 1, delay: 0.1, ease: [0.22, 1, 0.36, 1] }} className="mt-8 max-w-md text-lg text-muted-foreground">
              Two rivers, one delta, eighty kilometres of coastline. Sidoarjo breathes in tides — and gives back mangroves, egrets, and the quiet architecture of fish ponds stretching to the horizon.
            </motion.p>
            <ul className="mt-10 space-y-4 text-sm">
              {[
                ["Tlocor Mangrove", "Migratory bird sanctuary"],
                ["Ketingan Delta", "Sunset paddleboarding"],
                ["Kalanganyar Ponds", "Traditional aquaculture"],
                ["Segoro Tambak", "Wetland restoration"],
              ].map(([n, d], i) => (
                <motion.li
                  key={n}
                  initial={{ opacity: 0, y: 24, rotateX: -20 }}
                  whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                  viewport={{ once: true, amount: 0.6 }}
                  transition={{ duration: 0.8, delay: 0.2 + i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                  className="flex items-baseline justify-between border-b border-white/10 pb-3"
                >
                  <span className="text-base">{n}</span>
                  <span className="text-xs uppercase tracking-widest text-muted-foreground">{d}</span>
                </motion.li>
              ))}
            </ul>
          </div>
          <div className="relative md:col-span-6 md:col-start-7" style={{ perspective: 1400 }}>
            <motion.div
              style={{ y: y1 }}
              initial={{ opacity: 0, rotateY: -22 }}
              whileInView={{ opacity: 1, rotateY: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
              className="relative overflow-hidden rounded-2xl"
            >
              <img src={mangrove} alt="Sidoarjo mangrove at sunrise" loading="lazy" className="aspect-[4/5] w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent" />
            </motion.div>
            <motion.div
              style={{ y: y2 }}
              initial={{ opacity: 0, rotateY: 22 }}
              whileInView={{ opacity: 1, rotateY: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 1.2, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="absolute -bottom-10 -left-6 hidden w-2/3 overflow-hidden rounded-2xl glass-strong md:block"
            >
              <img src={delta} alt="Delta fishing at sunset" loading="lazy" className="aspect-video w-full object-cover" />
            </motion.div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

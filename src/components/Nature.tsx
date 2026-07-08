import { motion, useScroll, useTransform } from "framer-motion";
import { lazy, Suspense, useRef } from "react";
import mangrove from "@/assets/mangrove.jpg";
import delta from "@/assets/delta-fishing.jpg";
import { useInView } from "@/hooks/useInView";
import { SceneErrorBoundary } from "@/components/SceneErrorBoundary";
import { SplitText, ClipReveal, BlurWords } from "@/components/motion/Kinetic";

const NatureScene = lazy(() => import("@/components/scenes/NatureScene"));

export function Nature() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y1 = useTransform(scrollYProgress, [0, 1], ["-10%", "20%"]);
  const y2 = useTransform(scrollYProgress, [0, 1], ["10%", "-15%"]);
  const scale = useTransform(scrollYProgress, [0, 1], [1.1, 1.3]);

  return (
    <section id="nature" ref={ref} className="relative overflow-hidden py-32 md:py-48" style={{ perspective: 1600 }}>
      <motion.div style={{ scale }} className="pointer-events-none absolute inset-0">
        <img src={mangrove} alt="" aria-hidden loading="lazy" className="h-full w-full object-cover opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/60 to-background" />
      </motion.div>

      <div className="pointer-events-none absolute inset-0 opacity-70 mix-blend-screen">
        {inView && (
          <SceneErrorBoundary>
            <Suspense fallback={null}>
            <NatureScene />
          </Suspense>
          </SceneErrorBoundary>
        )}
      </div>

      <motion.div
        style={{ transformStyle: "preserve-3d" }}
        className="relative mx-auto max-w-7xl px-6"
      >
        <div className="grid grid-cols-1 gap-12 md:grid-cols-12">
          <div className="md:col-span-5" style={{ perspective: 1200 }}>
            <motion.p initial={{ opacity: 0, y: 30, rotateX: -22 }} whileInView={{ opacity: 1, y: 0, rotateX: 0 }} viewport={{ once: true, amount: 0.5 }} transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }} className="text-[10px] uppercase tracking-[0.4em] text-accent">
              03 — Nature
            </motion.p>
            <h2 className="mt-6 text-5xl font-light leading-[1.05] md:text-7xl">
              <SplitText text="Water is our" as="span" className="block" />
              <SplitText text="first language." as="span" className="block italic text-gradient-gold" delay={0.18} />
            </h2>
            <p className="mt-8 max-w-md text-lg text-muted-foreground">
              <BlurWords text="Two rivers, one delta, eighty kilometres of coastline. Sidoarjo breathes in tides — and gives back mangroves, egrets, and the quiet architecture of fish ponds stretching to the horizon." />
            </p>
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
            <motion.div style={{ y: y1 }}>
              <ClipReveal from="up" duration={1.6} className="rounded-2xl">
                <img src={mangrove} alt="Sidoarjo mangrove at sunrise" loading="lazy" className="aspect-[4/5] w-full object-cover" />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/60 to-transparent" />
              </ClipReveal>
            </motion.div>
            <motion.div
              style={{ y: y2 }}
              className="absolute -bottom-10 -left-6 hidden w-2/3 md:block"
            >
              <ClipReveal from="left" delay={0.2} duration={1.4} className="rounded-2xl glass-strong">
                <img src={delta} alt="Delta fishing at sunset" loading="lazy" className="aspect-video w-full object-cover" />
              </ClipReveal>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

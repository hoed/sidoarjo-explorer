import { motion } from "framer-motion";

export function CTA() {
  return (
    <section id="cta" className="relative overflow-hidden py-32 md:py-48">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/2 h-[60vmax] w-[60vmax] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--gradient-aurora)] opacity-30 blur-3xl animate-aurora" />
      </div>
      <div className="relative mx-auto max-w-4xl px-6 text-center">
        <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-[10px] uppercase tracking-[0.4em] text-primary">
          11 — Your Turn
        </motion.p>
        <motion.h2 initial={{ opacity: 0, y: 30, filter: "blur(10px)" }} whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }} viewport={{ once: true }} transition={{ duration: 1.2 }} className="mt-8 text-6xl font-light leading-[1] md:text-8xl">
          Book your<br /><span className="italic text-gradient-cyan">journey.</span>
        </motion.h2>
        <p className="mx-auto mt-8 max-w-xl text-lg text-muted-foreground">
          Curated itineraries, local guides, and stories that live long after you go home.
        </p>
        <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <a href="#" data-magnetic className="group relative inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-primary to-accent px-10 py-5 text-sm font-semibold uppercase tracking-[0.25em] text-background transition-transform hover:scale-[1.03] glow-cyan">
            Plan my Sidoarjo trip
            <span className="transition-transform group-hover:translate-x-1">→</span>
          </a>
          <a href="#" data-magnetic className="rounded-full glass px-10 py-5 text-sm uppercase tracking-[0.25em] hover:bg-white/10">
            Talk to a local guide
          </a>
        </div>
      </div>
    </section>
  );
}

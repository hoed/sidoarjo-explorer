import { motion } from "framer-motion";
import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { useInView } from "@/hooks/useInView";

const EventsScene = lazy(() => import("@/components/scenes/EventsScene"));

const events = [
  { d: "22 AUG", t: "Nyadran Dawuhan", place: "Krembung", tag: "Ritual" },
  { d: "15 SEP", t: "Festival Bandeng", place: "Alun-alun", tag: "Culinary" },
  { d: "12 OCT", t: "Batik Jetis Week", place: "Jetis Village", tag: "Craft" },
  { d: "05 NOV", t: "Mangrove Run", place: "Tlocor", tag: "Adventure" },
];

function Countdown({ target }: { target: Date }) {
  const [mounted, setMounted] = useState(false);
  const [t, setT] = useState(0);
  useEffect(() => {
    setMounted(true);
    setT(target.getTime() - Date.now());
    const id = setInterval(() => setT(target.getTime() - Date.now()), 1000);
    return () => clearInterval(id);
  }, [target]);
  const s = Math.max(t, 0) / 1000;
  const d = Math.floor(s / 86400), h = Math.floor((s % 86400) / 3600), m = Math.floor((s % 3600) / 60), sec = Math.floor(s % 60);
  const Cell = ({ n, l }: { n: number; l: string }) => (
    <div className="flex flex-col items-center">
      <span suppressHydrationWarning className="tabular-nums text-4xl font-light text-gradient-cyan md:text-6xl">
        {mounted ? String(n).padStart(2, "0") : "--"}
      </span>
      <span className="mt-1 text-[10px] uppercase tracking-[0.3em] text-muted-foreground">{l}</span>
    </div>
  );
  return (
    <div className="flex items-center gap-6 md:gap-10">
      <Cell n={d} l="days" /><Cell n={h} l="hrs" /><Cell n={m} l="min" /><Cell n={sec} l="sec" />
    </div>
  );
}

export function Events() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref);
  // Fixed anchor date so SSR and client agree; refreshed on the client after mount.
  const nextEvent = new Date("2026-09-15T09:00:00+07:00");
  return (
    <section id="events" ref={ref} className="relative py-32 md:py-48" style={{ perspective: 1600 }}>
      <div className="pointer-events-none absolute inset-0 opacity-50 mix-blend-screen">
        {inView && (
          <Suspense fallback={null}>
            <EventsScene />
          </Suspense>
        )}
      </div>
      <motion.div style={{ transformStyle: "preserve-3d" }} className="mx-auto max-w-7xl px-6">
        <motion.div
          style={{ perspective: 1200 }}
          initial={{ opacity: 0, y: 50, rotateX: -22 }}
          whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="mb-16 max-w-3xl"
        >
          <p className="text-[10px] uppercase tracking-[0.4em] text-primary">10 — Events</p>
          <h2 className="mt-6 text-5xl font-light md:text-7xl">Time your<br /><span className="italic text-gradient-cyan">journey.</span></h2>
        </motion.div>

        <div style={{ perspective: 1400 }}>
          <motion.div initial={{ opacity: 0, y: 40, rotateX: -18 }} whileInView={{ opacity: 1, y: 0, rotateX: 0 }} viewport={{ once: true }} transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }} className="mb-14 flex flex-col items-start justify-between gap-8 rounded-3xl glass-strong p-8 md:flex-row md:items-center md:p-12">
            <div>
              <p className="text-[10px] uppercase tracking-[0.3em] text-accent">Next flagship event</p>
              <h3 className="mt-2 text-3xl font-light md:text-5xl">Festival Bandeng Sidoarjo</h3>
              <p className="mt-2 text-muted-foreground">Alun-alun • 15 September</p>
            </div>
            <Countdown target={nextEvent} />
          </motion.div>
        </div>

        <ul style={{ perspective: 1400 }} className="divide-y divide-white/10 border-y border-white/10">
          {events.map((e, i) => (
            <motion.li
              key={e.t}
              initial={{ opacity: 0, x: -30, rotateY: 20 }}
              whileInView={{ opacity: 1, x: 0, rotateY: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
              data-magnetic
              className="group grid grid-cols-12 items-center gap-4 py-8 transition-colors hover:bg-white/[0.03]"
            >
              <span className="col-span-3 text-xs uppercase tracking-[0.3em] text-primary md:col-span-2">{e.d}</span>
              <span className="col-span-6 text-2xl font-light md:col-span-6 md:text-3xl">{e.t}</span>
              <span className="col-span-3 text-right text-xs uppercase tracking-widest text-muted-foreground md:col-span-3">{e.place}</span>
              <span className="hidden text-right text-xs text-accent md:col-span-1 md:block">{e.tag}</span>
            </motion.li>
          ))}
        </ul>
      </motion.div>
    </section>
  );
}

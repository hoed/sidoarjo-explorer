import { motion } from "framer-motion";
import { useState } from "react";

const pins = [
  { x: 28, y: 34, cat: "Heritage", name: "Candi Pari" },
  { x: 55, y: 42, cat: "Landmark", name: "Alun-alun Sidoarjo" },
  { x: 46, y: 60, cat: "Craft", name: "Batik Jetis" },
  { x: 72, y: 68, cat: "Nature", name: "Tlocor Mangrove" },
  { x: 38, y: 76, cat: "Adventure", name: "Delta Fishing" },
  { x: 63, y: 26, cat: "History", name: "Museum Mpu Tantular" },
  { x: 78, y: 48, cat: "Culinary", name: "Kupang Village" },
];

const filters = ["All", "Heritage", "Nature", "Culture", "Culinary", "Adventure", "History"];

export function TourismMap() {
  const [active, setActive] = useState("All");
  const shown = pins.filter((p) => active === "All" || p.cat === active);

  return (
    <section id="map" className="relative py-32 md:py-48">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="text-[10px] uppercase tracking-[0.4em] text-primary">07 — Tourism Map</p>
            <h2 className="mt-6 text-5xl font-light md:text-7xl">Chart your<br /><span className="italic text-gradient-cyan">own delta.</span></h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {filters.map((f) => (
              <button
                key={f}
                onClick={() => setActive(f)}
                data-magnetic
                className={`rounded-full border px-4 py-2 text-[10px] uppercase tracking-[0.2em] transition ${
                  active === f ? "border-primary bg-primary text-background" : "border-foreground/15 text-muted-foreground hover:border-foreground/40"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="relative aspect-[16/10] w-full overflow-hidden rounded-3xl glass-strong">
          {/* Stylised map grid */}
          <div className="absolute inset-0 bg-[linear-gradient(color-mix(in_oklab,var(--primary)_15%,transparent)_1px,transparent_1px),linear-gradient(90deg,color-mix(in_oklab,var(--primary)_15%,transparent)_1px,transparent_1px)] bg-[size:48px_48px]" />
          <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 62.5" preserveAspectRatio="none">
            <defs>
              <linearGradient id="riv" x1="0" x2="1">
                <stop offset="0" stopColor="oklch(0.78 0.17 220 / 0.9)" />
                <stop offset="1" stopColor="oklch(0.84 0.15 85 / 0.7)" />
              </linearGradient>
            </defs>
            <path d="M0,30 C20,25 30,42 50,38 C70,34 80,55 100,50" stroke="url(#riv)" strokeWidth="0.4" fill="none" strokeDasharray="1.2 0.8">
              <animate attributeName="stroke-dashoffset" from="0" to="-20" dur="15s" repeatCount="indefinite" />
            </path>
            <path d="M5,10 C25,15 40,5 60,15 C80,25 90,15 100,20" stroke="oklch(0.55 0.15 230 / 0.5)" strokeWidth="0.3" fill="none" />
          </svg>

          {/* Pins */}
          {shown.map((p, i) => (
            <motion.button
              key={p.name}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.06, type: "spring", stiffness: 200 }}
              style={{ left: `${p.x}%`, top: `${p.y}%` }}
              data-magnetic
              className="group absolute -translate-x-1/2 -translate-y-1/2"
            >
              <span className="relative block h-3 w-3 rounded-full bg-primary glow-cyan">
                <span className="absolute inset-0 animate-ping rounded-full bg-primary/60" />
              </span>
              <span className="pointer-events-none absolute left-1/2 top-full mt-3 -translate-x-1/2 whitespace-nowrap rounded-full glass px-3 py-1 text-[10px] uppercase tracking-widest opacity-0 transition-opacity group-hover:opacity-100">
                {p.name}
              </span>
            </motion.button>
          ))}

          <div className="absolute bottom-6 left-6 text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
            Sidoarjo Regency — East Java, Indonesia
          </div>
        </div>
      </div>
    </section>
  );
}

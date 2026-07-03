import { motion } from "framer-motion";
import lontong from "@/assets/lontong-kupang.jpg";
import bandeng from "@/assets/bandeng.jpg";
import otak from "@/assets/otak-otak.jpg";

const dishes = [
  { img: lontong, name: "Lontong Kupang", note: "Tiny clams, rice cake, coconut broth", accent: "Signature" },
  { img: bandeng, name: "Bandeng Asap", note: "Smoked milkfish on banana leaf", accent: "Coastal" },
  { img: otak, name: "Otak-Otak", note: "Grilled fish parcel, sambal petis", accent: "Street" },
];

export function Culinary() {
  return (
    <section id="culinary" className="relative py-32 md:py-48">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,color-mix(in_oklab,var(--accent)_15%,transparent),transparent_60%)]" />
      <div className="relative mx-auto max-w-7xl px-6">
        <div className="mb-16 max-w-3xl">
          <p className="text-[10px] uppercase tracking-[0.4em] text-accent">06 — Culinary</p>
          <h2 className="mt-6 text-5xl font-light md:text-7xl">The coastline<br /><span className="italic text-gradient-gold">in a bowl.</span></h2>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {dishes.map((d, i) => (
            <motion.article
              key={d.name}
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.9, delay: i * 0.12 }}
              className="group relative"
            >
              <div className="relative aspect-square overflow-hidden rounded-full glass-strong">
                <img src={d.img} alt={d.name} loading="lazy" className="h-full w-full object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-110" />
                <div className="absolute inset-0 rounded-full ring-1 ring-inset ring-white/10 transition-all group-hover:ring-accent/60" />
              </div>
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
      </div>
    </section>
  );
}

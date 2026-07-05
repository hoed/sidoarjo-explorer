import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef } from "react";
import type { DestinationDTO } from "@/lib/destinations.functions";

const FOOD_FESTIVAL_CATS = new Set(["culinary", "entertainment", "culture"]);

/**
 * "Food & Festivals" chapter — as the user scrolls through it we cycle the
 * map's focused destination through every matching stop, so the map beneath
 * flies from warung to warung, festival to festival.
 */
export function FoodFestivalsChapter({
  destinations,
  onFocusSlug,
}: {
  destinations: DestinationDTO[];
  onFocusSlug: (slug: string | null) => void;
}) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const opacity = useTransform(scrollYProgress, [0, 0.15, 0.85, 1], [0, 1, 1, 0]);
  const y = useTransform(scrollYProgress, [0, 0.5, 1], [40, 0, -30]);

  const picks = destinations.filter(
    (d) => d.category_slug && FOOD_FESTIVAL_CATS.has(d.category_slug),
  );

  useEffect(() => {
    if (!picks.length) return;
    const unsub = scrollYProgress.on("change", (v) => {
      // Only steer the map while the chapter is on screen.
      if (v <= 0.15 || v >= 0.9) return;
      const t = (v - 0.15) / 0.75;
      const idx = Math.min(picks.length - 1, Math.max(0, Math.floor(t * picks.length)));
      onFocusSlug(picks[idx].slug);
    });
    return () => unsub();
  }, [scrollYProgress, picks, onFocusSlug]);

  return (
    <section ref={ref} id="food-festivals" className="relative py-32 md:py-48">
      <div className="mx-auto flex max-w-6xl flex-col items-start px-6">
        <motion.div style={{ opacity, y }} className="max-w-3xl">
          <p className="text-[10px] uppercase tracking-[0.4em] text-primary">
            Chapter VI — Food & Festivals
          </p>
          <h2 className="mt-6 text-5xl font-light leading-[1.05] md:text-7xl">
            Smoke, spice, and<br />
            <span className="italic text-gradient-cyan">street-side gamelan.</span>
          </h2>
          <div className="mt-8 max-w-xl text-lg text-muted-foreground">
            Kupang lontong at Balongdowo dawn. Bandeng asap curling out of Sidoarjo kitchens.
            Batik-Jetis lanterns and Delta Fishing weekends. Scroll — the map below will
            travel with you, stop by stop.
          </div>
        </motion.div>

        <ol className="mt-16 grid w-full gap-4 md:grid-cols-2">
          {picks.map((d, i) => (
            <li
              key={d.slug}
              className="glass-strong flex items-start gap-4 rounded-2xl border border-white/10 p-5 transition hover:border-primary/40"
            >
              <span className="text-[10px] uppercase tracking-[0.3em] text-primary">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div>
                <div className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                  {d.category_name} · {d.district}
                </div>
                <h3 className="mt-1 text-xl font-light">{d.name}</h3>
                {d.short_desc && (
                  <p className="mt-2 text-sm text-muted-foreground">{d.short_desc}</p>
                )}
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

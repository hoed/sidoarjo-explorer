import { motion } from "framer-motion";
import type { DestinationDTO } from "@/lib/destinations.functions";

const FOOD_FESTIVAL_CATS = new Set(["culinary", "entertainment", "culture"]);

/**
 * "Food & Festivals" chapter. Picking a stop here pre-focuses the map, so
 * when you move on to the Map slide it's already centered on that place.
 */
export function FoodFestivalsChapter({
  destinations,
  onFocusSlug,
}: {
  destinations: DestinationDTO[];
  onFocusSlug: (slug: string | null) => void;
}) {
  const picks = destinations.filter(
    (d) => d.category_slug && FOOD_FESTIVAL_CATS.has(d.category_slug),
  );

  return (
    <section id="food-festivals" className="relative py-32 md:py-48">
      <div className="mx-auto flex max-w-6xl flex-col items-start px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-3xl"
        >
          <p className="text-[10px] uppercase tracking-[0.4em] text-primary">
            Chapter VI — Food & Festivals
          </p>
          <h2 className="mt-6 text-5xl font-light leading-[1.05] md:text-7xl">
            Smoke, spice, and<br />
            <span className="italic text-gradient-cyan">street-side gamelan.</span>
          </h2>
          <div className="mt-8 max-w-xl text-lg text-muted-foreground">
            Kupang lontong at Balongdowo dawn. Bandeng asap curling out of Sidoarjo kitchens.
            Batik-Jetis lanterns and Delta Fishing weekends. Tap a stop to have the map
            waiting there when you reach it.
          </div>
        </motion.div>

        <ol className="mt-16 grid w-full gap-4 md:grid-cols-2">
          {picks.map((d, i) => (
            <li key={d.slug}>
              <button
                type="button"
                onClick={() => onFocusSlug(d.slug)}
                className="glass-strong flex w-full items-start gap-4 rounded-2xl border border-white/10 p-5 text-left transition hover:border-primary/40"
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
              </button>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

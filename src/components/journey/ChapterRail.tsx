import { useScroll, useTransform, motion } from "framer-motion";

const stops = [
  { id: "hero", label: "Dawn" },
  { id: "heritage", label: "Heritage" },
  { id: "nature", label: "Nature" },
  { id: "culture", label: "Culture" },
  { id: "history", label: "History" },
  { id: "culinary", label: "Table" },
  { id: "food-festivals", label: "Festivals" },
  { id: "map", label: "Map" },
  { id: "invitation", label: "Invitation" },
];

export function ChapterRail() {
  const { scrollYProgress } = useScroll();
  const scaleY = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <aside className="pointer-events-none fixed left-6 top-1/2 z-30 hidden -translate-y-1/2 md:block">
      <div className="relative flex flex-col items-center gap-6">
        <div className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-white/10" />
        <motion.div
          style={{ scaleY, transformOrigin: "top" }}
          className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-gradient-to-b from-primary via-accent to-transparent"
        />
        {stops.map((s) => (
          <a
            key={s.id}
            href={`#${s.id}`}
            className="pointer-events-auto group relative flex items-center gap-3"
          >
            <span className="block h-2 w-2 rounded-full bg-white/30 transition group-hover:bg-primary group-hover:shadow-[0_0_12px_2px_hsl(var(--primary)/0.6)]" />
            <span className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground opacity-0 transition group-hover:opacity-100">
              {s.label}
            </span>
          </a>
        ))}
      </div>
    </aside>
  );
}

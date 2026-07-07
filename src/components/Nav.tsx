import { motion } from "framer-motion";
import { useScrollStack } from "@/lib/scroll-stack-context";

const links = [
  { label: "Destinations", id: "heritage" },
  { label: "Nature", id: "nature" },
  { label: "Culture", id: "culture" },
  { label: "Culinary", id: "culinary" },
  { label: "Map", id: "map" },
  { label: "Events", id: "events" },
];

export function Nav() {
  const { goToId } = useScrollStack();
  return (
    <motion.header
      initial={{ y: -30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 1, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="fixed left-0 right-0 top-4 z-50 mx-auto flex w-[min(1200px,94%)] items-center justify-between rounded-full glass-strong px-6 py-3"
    >
      <button onClick={() => goToId("hero")} data-magnetic className="flex items-center gap-2">
        <span className="grid h-8 w-8 place-items-center rounded-full bg-gradient-to-br from-primary to-accent text-[10px] font-black text-background">BP</span>
        <span className="text-sm font-semibold tracking-widest">BPPD SIDOARJO</span>
      </button>
      <nav className="hidden items-center gap-7 md:flex">
        {links.map((l) => (
          <button key={l.id} onClick={() => goToId(l.id)} data-magnetic className="text-xs uppercase tracking-[0.18em] text-muted-foreground transition-colors hover:text-foreground">
            {l.label}
          </button>
        ))}
      </nav>
      <button onClick={() => goToId("invitation")} data-magnetic className="rounded-full bg-gradient-to-r from-primary to-accent px-5 py-2 text-xs font-semibold uppercase tracking-widest text-background transition-transform hover:scale-105">
        Plan Visit
      </button>
    </motion.header>
  );
}

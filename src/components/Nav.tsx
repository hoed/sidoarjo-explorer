import { motion } from "framer-motion";

const links = [
  { label: "Destinations", href: "#destinations" },
  { label: "Nature", href: "#nature" },
  { label: "Culture", href: "#culture" },
  { label: "Culinary", href: "#culinary" },
  { label: "Map", href: "#map" },
  { label: "Events", href: "#events" },
];

export function Nav() {
  return (
    <motion.header
      initial={{ y: -30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 1, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="fixed left-0 right-0 top-4 z-50 mx-auto flex w-[min(1200px,94%)] items-center justify-between rounded-full glass-strong px-6 py-3"
    >
      <a href="#top" data-magnetic className="flex items-center gap-2">
        <span className="grid h-8 w-8 place-items-center rounded-full bg-gradient-to-br from-primary to-accent text-[10px] font-black text-background">BP</span>
        <span className="text-sm font-semibold tracking-widest">BPPD SIDOARJO</span>
      </a>
      <nav className="hidden items-center gap-7 md:flex">
        {links.map((l) => (
          <a key={l.href} href={l.href} data-magnetic className="text-xs uppercase tracking-[0.18em] text-muted-foreground transition-colors hover:text-foreground">
            {l.label}
          </a>
        ))}
      </nav>
      <a href="#cta" data-magnetic className="rounded-full bg-gradient-to-r from-primary to-accent px-5 py-2 text-xs font-semibold uppercase tracking-widest text-background transition-transform hover:scale-105">
        Plan Visit
      </a>
    </motion.header>
  );
}

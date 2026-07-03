import { motion } from "framer-motion";
import dance from "@/assets/culture-dance.jpg";
import wayang from "@/assets/wayang.jpg";
import batik from "@/assets/batik-jetis.jpg";

export function Culture() {
  return (
    <section id="culture" className="relative py-32 md:py-48">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-16 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <p className="text-[10px] uppercase tracking-[0.4em] text-accent">05 — Culture</p>
            <h2 className="mt-6 text-5xl font-light md:text-7xl">Rituals that<br /><span className="italic text-gradient-gold">refuse to sleep.</span></h2>
          </div>
          <p className="max-w-sm text-muted-foreground">Wayang shadows, Reog fire, gamelan bronze — Sidoarjo carries East Java on its shoulders.</p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
          <motion.div initial={{ opacity: 0, y: 60 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 1 }} className="relative overflow-hidden rounded-2xl md:col-span-7 md:row-span-2">
            <img src={dance} alt="Traditional Reog dancer" loading="lazy" className="aspect-[4/5] w-full object-cover transition-transform duration-[2s] hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-8">
              <h3 className="text-3xl font-light md:text-5xl">Tari Ujung</h3>
              <p className="mt-2 text-sm uppercase tracking-widest text-muted-foreground">Fire, feather, footwork</p>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 60 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 1, delay: 0.15 }} className="relative overflow-hidden rounded-2xl md:col-span-5">
            <img src={wayang} alt="Wayang kulit puppet" loading="lazy" className="aspect-video w-full object-cover transition-transform duration-[2s] hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-6">
              <h3 className="text-2xl font-light">Wayang Kulit</h3>
              <p className="mt-1 text-xs uppercase tracking-widest text-muted-foreground">Shadow theatre until dawn</p>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 60 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 1, delay: 0.3 }} className="relative overflow-hidden rounded-2xl md:col-span-5">
            <img src={batik} alt="Batik Jetis" loading="lazy" className="aspect-video w-full object-cover transition-transform duration-[2s] hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-6">
              <h3 className="text-2xl font-light">Batik Jetis</h3>
              <p className="mt-1 text-xs uppercase tracking-widest text-muted-foreground">Hand-drawn since 1859</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

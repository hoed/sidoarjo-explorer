import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { lazy, Suspense, useRef, type MouseEvent } from "react";
import candi from "@/assets/candi-pari.jpg";
import jaya from "@/assets/jayandaru.jpg";
import batik from "@/assets/batik-jetis.jpg";
import delta from "@/assets/delta-fishing.jpg";
import museum from "@/assets/museum.jpg";
import mangrove from "@/assets/mangrove.jpg";
import { useInView } from "@/hooks/useInView";

const DestinationsScene = lazy(() => import("@/components/scenes/DestinationsScene"));

const items = [
  { img: candi, name: "Candi Pari", tag: "Heritage", desc: "A 14th-century Majapahit brick temple rising from rice fields.", loc: "Porong" },
  { img: jaya, name: "Monumen Jayandaru", tag: "Landmark", desc: "The luminous heart of Sidoarjo's alun-alun after dusk.", loc: "City Center" },
  { img: batik, name: "Kampung Batik Jetis", tag: "Craft", desc: "Centuries-old canting workshops where wax meets silk.", loc: "Jetis Village" },
  { img: delta, name: "Delta Fishing", tag: "Adventure", desc: "Wooden jetties and pond fishing beneath open skies.", loc: "Prambon" },
  { img: museum, name: "Museum Mpu Tantular", tag: "History", desc: "East Java's living archive of pre-Islamic Java.", loc: "Buduran" },
  { img: mangrove, name: "Tlocor Mangrove", tag: "Nature", desc: "Boardwalks through migratory bird sanctuaries.", loc: "Jabon" },
];

function TiltCard({ item, index }: { item: (typeof items)[number]; index: number }) {
  const rx = useSpring(useMotionValue(0), { stiffness: 200, damping: 20 });
  const ry = useSpring(useMotionValue(0), { stiffness: 200, damping: 20 });
  const tX = useTransform(ry, (v) => `${v * 6}deg`);
  const tY = useTransform(rx, (v) => `${-v * 6}deg`);

  const onMove = (e: MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    rx.set((e.clientY - r.top) / r.height - 0.5);
    ry.set((e.clientX - r.left) / r.width - 0.5);
  };
  const onLeave = () => { rx.set(0); ry.set(0); };

  return (
    <div style={{ perspective: 1200 }}>
      <motion.div
        initial={{ opacity: 0, y: 60, rotateX: -20 }}
        whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 1.1, delay: (index % 3) * 0.1, ease: [0.22, 1, 0.36, 1] }}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        data-magnetic
        style={{ transformStyle: "preserve-3d" }}
        className="group relative"
      >
        <motion.div style={{ rotateX: tY, rotateY: tX, transformStyle: "preserve-3d" }} className="relative aspect-[4/5] overflow-hidden rounded-2xl glass">
        <img src={item.img} alt={item.name} loading="lazy" className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1.4s] ease-out group-hover:scale-110" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
        <div className="absolute inset-x-0 top-0 flex items-center justify-between p-5 text-[10px] uppercase tracking-[0.28em]">
          <span className="rounded-full glass-strong px-3 py-1 text-primary">{item.tag}</span>
          <span className="text-muted-foreground">{item.loc}</span>
        </div>
        <div className="absolute inset-x-0 bottom-0 p-6" style={{ transform: "translateZ(30px)" }}>
          <h3 className="text-2xl font-light md:text-3xl">{item.name}</h3>
          <p className="mt-2 max-h-0 overflow-hidden text-sm text-muted-foreground opacity-0 transition-all duration-500 group-hover:max-h-24 group-hover:opacity-100">
            {item.desc}
          </p>
          <div className="mt-4 flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-primary">
            Discover <span aria-hidden>→</span>
          </div>
        </div>
      </motion.div>
      </motion.div>
    </div>
  );
}

export function Destinations() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref);
  return (
    <section id="destinations" ref={ref} className="relative py-32 md:py-48" style={{ perspective: 1600 }}>
      <div className="pointer-events-none absolute inset-0 opacity-50 mix-blend-screen">
        {inView && (
          <Suspense fallback={null}>
            <DestinationsScene />
          </Suspense>
        )}
      </div>
      <motion.div style={{ transformStyle: "preserve-3d" }} className="mx-auto max-w-7xl px-6">
        <div style={{ perspective: 1200 }} className="mb-16 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <motion.div
            initial={{ opacity: 0, y: 50, rotateX: -22 }}
            whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="text-[10px] uppercase tracking-[0.4em] text-primary">02 — Destinations</p>
            <h2 className="mt-6 text-5xl font-light md:text-7xl">Eight ways to<br /><span className="italic text-gradient-cyan">fall in love.</span></h2>
          </motion.div>
          <motion.p
            initial={{ opacity: 0, y: 50, rotateX: -22 }}
            whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 1, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-md text-muted-foreground"
          >
            Curated by locals. Ancient and new. Each one is a chapter in Sidoarjo&apos;s story.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((it, i) => <TiltCard key={it.name} item={it} index={i} />)}
        </div>
      </motion.div>
    </section>
  );
}

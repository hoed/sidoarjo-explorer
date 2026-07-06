import { motion } from "framer-motion";
import { lazy, Suspense, useRef } from "react";
import candi from "@/assets/candi-pari.jpg";
import jaya from "@/assets/jayandaru.jpg";
import batik from "@/assets/batik-jetis.jpg";
import delta from "@/assets/delta-fishing.jpg";
import museum from "@/assets/museum.jpg";
import mangrove from "@/assets/mangrove.jpg";
import dance from "@/assets/culture-dance.jpg";
import wayang from "@/assets/wayang.jpg";
import { useInView } from "@/hooks/useInView";
import { useSectionTilt } from "@/hooks/useSectionTilt";

const GalleryScene = lazy(() => import("@/components/scenes/GalleryScene"));

const imgs = [
  { src: mangrove, h: "row-span-2", alt: "Mangrove" },
  { src: candi, h: "", alt: "Candi Pari" },
  { src: batik, h: "", alt: "Batik" },
  { src: dance, h: "row-span-2", alt: "Dance" },
  { src: delta, h: "", alt: "Delta" },
  { src: jaya, h: "", alt: "Jayandaru" },
  { src: museum, h: "", alt: "Museum" },
  { src: wayang, h: "", alt: "Wayang" },
];

export function Gallery() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref);
  const { rotateX, y, opacity } = useSectionTilt(ref);
  return (
    <section id="gallery" ref={ref} className="relative py-32 md:py-48" style={{ perspective: 1600 }}>
      <div className="pointer-events-none absolute inset-0 opacity-50 mix-blend-screen">
        {inView && (
          <Suspense fallback={null}>
            <GalleryScene />
          </Suspense>
        )}
      </div>
      <motion.div style={{ rotateX, y, opacity, transformStyle: "preserve-3d" }} className="mx-auto max-w-7xl px-6">
        <motion.div
          style={{ perspective: 1200 }}
          initial={{ opacity: 0, y: 50, rotateX: -22 }}
          whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="mb-16 max-w-3xl"
        >
          <p className="text-[10px] uppercase tracking-[0.4em] text-accent">08 — Gallery</p>
          <h2 className="mt-6 text-5xl font-light md:text-7xl">Postcards from<br /><span className="italic text-gradient-gold">the delta.</span></h2>
        </motion.div>
        <div style={{ perspective: 1400 }} className="grid auto-rows-[220px] grid-cols-2 gap-4 md:grid-cols-4">
          {imgs.map((im, i) => (
            <motion.figure
              key={i}
              initial={{ opacity: 0, y: 40, rotateX: -20, rotateY: i % 2 ? 14 : -14 }}
              whileInView={{ opacity: 1, y: 0, rotateX: 0, rotateY: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 1, delay: (i % 4) * 0.08, ease: [0.22, 1, 0.36, 1] }}
              className={`group relative overflow-hidden rounded-xl ${im.h}`}
            >
              <img src={im.src} alt={im.alt} loading="lazy" className="h-full w-full object-cover transition-transform duration-[1.6s] ease-out group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-background/70 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
            </motion.figure>
          ))}
        </div>
      </motion.div>
    </section>
  );
}

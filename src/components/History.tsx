import { motion } from "framer-motion";

const timeline = [
  { year: "8th c.", title: "Kahuripan Kingdom", body: "The delta becomes a hub of the Airlangga era." },
  { year: "1371", title: "Candi Pari built", body: "A Majapahit tribute rises from the flatlands." },
  { year: "1859", title: "Kampung Batik Jetis", body: "Batik canting spreads village to village." },
  { year: "1859", title: "City of Sidoarjo", body: "Officially chartered on 31 January." },
  { year: "2003", title: "Museum Mpu Tantular", body: "Relocated to Buduran — East Java's memory keeps growing." },
  { year: "Today", title: "A rising delta", body: "Heritage, ecology and futures converge." },
];

export function History() {
  return (
    <section id="history" className="relative py-32 md:py-48">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-20 max-w-3xl">
          <p className="text-[10px] uppercase tracking-[0.4em] text-primary">04 — History</p>
          <h2 className="mt-6 text-5xl font-light md:text-7xl">A thousand years,<br /><span className="italic text-gradient-cyan">one horizon.</span></h2>
        </div>

        <div className="relative">
          <div className="absolute bottom-0 left-1/2 top-0 hidden w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-primary/40 to-transparent md:block" />
          <div className="grid gap-16">
            {timeline.map((t, i) => (
              <motion.div
                key={t.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.9 }}
                className={`relative grid grid-cols-1 items-center gap-6 md:grid-cols-2 ${i % 2 ? "md:[direction:rtl]" : ""}`}
              >
                <div className="[direction:ltr] md:pr-12">
                  <div className="glass rounded-2xl p-8">
                    <div className="text-xs uppercase tracking-[0.3em] text-primary">{t.year}</div>
                    <h3 className="mt-3 text-3xl font-light">{t.title}</h3>
                    <p className="mt-3 text-muted-foreground">{t.body}</p>
                  </div>
                </div>
                <div className="absolute left-1/2 hidden h-3 w-3 -translate-x-1/2 rounded-full bg-accent glow-gold md:block" />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

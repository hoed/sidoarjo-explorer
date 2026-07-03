import { createFileRoute } from "@tanstack/react-router";
import { Cursor } from "@/components/Cursor";
import { SmoothScroll } from "@/components/SmoothScroll";
import { ScrollProgress } from "@/components/ScrollProgress";
import { Nav } from "@/components/Nav";
import { Hero } from "@/components/Hero";
import { Intro } from "@/components/Intro";
import { Destinations } from "@/components/Destinations";
import { Nature } from "@/components/Nature";
import { History } from "@/components/History";
import { Culture } from "@/components/Culture";
import { Culinary } from "@/components/Culinary";
import { TourismMap } from "@/components/TourismMap";
import { Gallery } from "@/components/Gallery";
import { VideoBanner } from "@/components/VideoBanner";
import { Events } from "@/components/Events";
import { CTA } from "@/components/CTA";
import { Footer } from "@/components/Footer";
import heroImg from "@/assets/hero-sidoarjo.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "BPPD Sidoarjo — Discover the Hidden Wonders of the Delta" },
      { name: "description", content: "An immersive tourism experience by Badan Promosi Pariwisata Daerah Sidoarjo. Explore nature, heritage, culture, culinary and adventure in the heart of East Java." },
      { property: "og:title", content: "BPPD Sidoarjo — Discover the Hidden Wonders" },
      { property: "og:description", content: "Nature • Heritage • Culture • Culinary • Adventure. An immersive journey through Sidoarjo, East Java." },
      { property: "og:image", content: heroImg },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <main className="relative">
      <SmoothScroll />
      <Cursor />
      <ScrollProgress />
      <Nav />
      <Hero />
      <Intro />
      <Destinations />
      <Nature />
      <History />
      <Culture />
      <Culinary />
      <TourismMap />
      <Gallery />
      <VideoBanner />
      <Events />
      <CTA />
      <Footer />
    </main>
  );
}

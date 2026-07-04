import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery, queryOptions } from "@tanstack/react-query";
import { Suspense } from "react";
import { Cursor } from "@/components/Cursor";
import { SmoothScroll } from "@/components/SmoothScroll";
import { ScrollProgress } from "@/components/ScrollProgress";
import { Nav } from "@/components/Nav";
import { Hero } from "@/components/Hero";
import { Intro } from "@/components/Intro";
import { Destinations } from "@/components/Destinations";
import { Culture } from "@/components/Culture";
import { Culinary } from "@/components/Culinary";
import { History } from "@/components/History";
import { Nature } from "@/components/Nature";
import { Events } from "@/components/Events";
import { CTA } from "@/components/CTA";
import { Footer } from "@/components/Footer";
import { JourneyBackdrop } from "@/components/journey/JourneyBackdrop";
import { ChapterRail } from "@/components/journey/ChapterRail";
import { Chapter } from "@/components/journey/Chapter";
import { MapChapter } from "@/components/journey/MapChapter";
import { listDestinations, listCategories } from "@/lib/destinations.functions";
import heroImg from "@/assets/hero-sidoarjo.jpg";

const destinationsQuery = queryOptions({
  queryKey: ["destinations"],
  queryFn: () => listDestinations(),
});
const categoriesQuery = queryOptions({
  queryKey: ["categories"],
  queryFn: () => listCategories(),
});

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "BPPD Sidoarjo — A Cinematic Journey Across the Delta" },
      {
        name: "description",
        content:
          "Scroll through Sidoarjo as if you were travelling it — temples, mangroves, batik villages, warungs and festivals — with a live tourism map and an AI Tour Guide by BPPD Sidoarjo.",
      },
      { property: "og:title", content: "BPPD Sidoarjo — A Cinematic Journey" },
      {
        property: "og:description",
        content: "Heritage · Nature · Culture · Culinary · Adventure. An immersive tourism experience.",
      },
      { property: "og:image", content: heroImg },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  loader: ({ context }) => {
    context.queryClient.ensureQueryData(destinationsQuery);
    context.queryClient.ensureQueryData(categoriesQuery);
  },
  component: Index,
  errorComponent: ({ error }) => (
    <div className="min-h-screen bg-background p-8 text-foreground">
      <h1 className="text-2xl">Couldn't load the journey</h1>
      <p className="mt-2 text-sm text-muted-foreground">{error.message}</p>
    </div>
  ),
  notFoundComponent: () => <div className="min-h-screen bg-background" />,
  pendingComponent: () => <div className="min-h-screen bg-background" />,
});

function Index() {
  return (
    <main className="relative">
      <SmoothScroll />
      <Cursor />
      <ScrollProgress />
      <JourneyBackdrop />
      <ChapterRail />
      <Nav />

      <div className="relative z-10">
        <div id="hero">
          <Hero />
        </div>
        <Intro />

        {/* Heritage chapter: temples & landmarks */}
        <div id="heritage">
          <Chapter
            eyebrow="Chapter I — Heritage"
            title={
              <>
                Where the delta<br />
                <span className="italic text-gradient-cyan">remembers.</span>
              </>
            }
            body={
              <>
                A thousand years ago, the Airlangga kings raised Kahuripan on this soil.
                Six centuries later, Majapahit laid the red bricks of Candi Pari. Every
                stone still speaks — you only need to arrive.
              </>
            }
          >
            <Destinations />
          </Chapter>
        </div>

        {/* Nature chapter */}
        <div id="nature">
          <Chapter
            eyebrow="Chapter II — Nature"
            title={
              <>
                A green<br />
                <span className="italic text-gradient-cyan">seawall.</span>
              </>
            }
            align="right"
          >
            <Nature />
          </Chapter>
        </div>

        {/* Culture */}
        <div id="culture">
          <Culture />
        </div>

        {/* History timeline */}
        <div id="history">
          <History />
        </div>

        {/* Culinary */}
        <div id="culinary">
          <Culinary />
        </div>

        {/* Map — the interactive command center */}
        <div id="map">
          <Chapter
            eyebrow="Chapter VII — Command Center"
            title={
              <>
                Chart your own<br />
                <span className="italic text-gradient-cyan">delta.</span>
              </>
            }
            body={
              <>
                Every marker is a chapter waiting to be written. Filter by mood, search by
                district, or ask the AI guide for a route made for your day.
              </>
            }
            fullBleedChildren={
              <Suspense fallback={<div className="h-[80vh] rounded-3xl border border-white/10 bg-white/5" />}>
                <MapChapterMount />
              </Suspense>
            }
          />
        </div>

        <Events />

        <div id="invitation">
          <CTA />
        </div>
        <Footer />
      </div>
    </main>
  );
}

function MapChapterMount() {
  const { data: destinations } = useSuspenseQuery(destinationsQuery);
  const { data: categories } = useSuspenseQuery(categoriesQuery);
  return <MapChapter destinations={destinations} categories={categories} />;
}

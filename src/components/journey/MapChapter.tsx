import { lazy, Suspense, useEffect, useState } from "react";
import type { CategoryDTO, DestinationDTO } from "@/lib/destinations.functions";

const TourismMap = lazy(() =>
  import("@/components/map/TourismMap").then((m) => ({ default: m.TourismMap })),
);
const TourGuide = lazy(() =>
  import("@/components/ai/TourGuide").then((m) => ({ default: m.TourGuide })),
);

/**
 * The map is client-only (Leaflet touches window/DOM). We lazy-load it
 * beneath a Suspense fallback so SSR doesn't try to render it.
 */
export function MapChapter({
  destinations,
  categories,
  focus,
  onFocus,
}: {
  destinations: DestinationDTO[];
  categories: CategoryDTO[];
  focus: string | null;
  onFocus: (slug: string | null) => void;
}) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <div className="h-[80vh] w-full animate-pulse rounded-3xl border border-white/10 bg-white/5" />
    );
  }
  return (
    <Suspense
      fallback={<div className="h-[80vh] w-full rounded-3xl border border-white/10 bg-white/5" />}
    >
      <TourismMap
        destinations={destinations}
        categories={categories}
        focusSlug={focus}
        onFocus={onFocus}
      />
      <TourGuide destinations={destinations} onFocusSlug={onFocus} />
    </Suspense>
  );
}

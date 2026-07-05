import { useEffect, useMemo, useRef, useState } from "react";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import L from "leaflet";
import Fuse from "fuse.js";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, Plus, Trash2, ArrowUp, ArrowDown, MapPin, Clock, Star, Ticket } from "lucide-react";
import type { CategoryDTO, DestinationDTO } from "@/lib/destinations.functions";
import "./leaflet-styles";

const SIDOARJO_CENTER: [number, number] = [-7.4478, 112.7183];
const SIDOARJO_ZOOM = 11;

const flagFilters = [
  { key: "is_free", label: "Free" },
  { key: "is_family_friendly", label: "Family" },
  { key: "is_accessible", label: "Accessible" },
  { key: "is_hidden_gem", label: "Hidden Gem" },
  { key: "is_popular", label: "Popular" },
  { key: "is_new", label: "New" },
] as const;

// Icons are cached — same color+state always reuses the same L.DivIcon instead of
// rebuilding HTML strings on every render (search typing, filter toggles, etc.).
const iconCache = new Map<string, L.DivIcon>();

function makeIcon(color: string, selected: boolean, dim: boolean) {
  const state = selected ? "selected" : dim ? "dim" : "default";
  const key = `${color}|${state}`;
  const cached = iconCache.get(key);
  if (cached) return cached;

  let html: string;
  let size: number;

  if (selected) {
    // Selected marker: static ring, no blur/animation (much cheaper to paint).
    size = 40;
    html = `
      <div style="width:${size}px;height:${size}px;border-radius:9999px;background:radial-gradient(circle at 30% 30%, #fff, ${color});box-shadow:0 0 0 3px rgba(255,255,255,0.6), 0 0 0 6px ${color}55;"></div>`;
  } else {
    // Plain dot with a soft color halo — no blur, no animation.
    size = 22;
    const opacity = dim ? 0.35 : 1;
    html = `
      <div style="width:${size}px;height:${size}px;opacity:${opacity};border-radius:9999px;background:${color};box-shadow:0 0 0 2px rgba(255,255,255,0.6);"></div>`;
  }

  const icon = L.divIcon({ html, className: "sd-marker", iconSize: [size, size], iconAnchor: [size / 2, size / 2] });
  iconCache.set(key, icon);
  return icon;
}

function FlyController({ target }: { target: [number, number] | null }) {
  const map = useMap();
  useEffect(() => {
    if (target) map.flyTo(target, 14, { duration: 1.1, easeLinearity: 0.4 });
  }, [target, map]);
  return null;
}

function haversine(a: { lat: number; lng: number }, b: { lat: number; lng: number }) {
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const s =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((a.lat * Math.PI) / 180) * Math.cos((b.lat * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(s));
}

export function TourismMap({
  destinations,
  categories,
  focusSlug,
  onFocus,
}: {
  destinations: DestinationDTO[];
  categories: CategoryDTO[];
  focusSlug: string | null;
  onFocus: (slug: string | null) => void;
}) {
  const [activeCats, setActiveCats] = useState<Set<string>>(new Set());
  const [activeFlags, setActiveFlags] = useState<Set<string>>(new Set());
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<string | null>(focusSlug);
  const [itinerary, setItinerary] = useState<string[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);
  const [showSuggest, setShowSuggest] = useState(false);

  useEffect(() => {
    if (focusSlug) setSelected(focusSlug);
  }, [focusSlug]);

  const fuse = useMemo(
    () =>
      new Fuse(destinations, {
        keys: ["name", "district", "village", "category_name", "tags", "short_desc"],
        threshold: 0.35,
      }),
    [destinations],
  );

  const filtered = useMemo(() => {
    return destinations.filter((d) => {
      if (activeCats.size && (!d.category_slug || !activeCats.has(d.category_slug))) return false;
      for (const f of activeFlags) if (!(d as any)[f]) return false;
      return true;
    });
  }, [destinations, activeCats, activeFlags]);

  const suggestions = query.trim() ? fuse.search(query).slice(0, 6).map((r) => r.item) : [];
  const selectedDest = destinations.find((d) => d.slug === selected) ?? null;
  const target: [number, number] | null = selectedDest ? [selectedDest.lat, selectedDest.lng] : null;

  const toggleCat = (slug: string) => {
    setActiveCats((s) => {
      const n = new Set(s);
      n.has(slug) ? n.delete(slug) : n.add(slug);
      return n;
    });
  };
  const toggleFlag = (key: string) => {
    setActiveFlags((s) => {
      const n = new Set(s);
      n.has(key) ? n.delete(key) : n.add(key);
      return n;
    });
  };

  const addToItinerary = (slug: string) => setItinerary((it) => (it.includes(slug) ? it : [...it, slug]));
  const removeFromItinerary = (slug: string) => setItinerary((it) => it.filter((s) => s !== slug));
  const move = (slug: string, dir: -1 | 1) =>
    setItinerary((it) => {
      const i = it.indexOf(slug);
      const j = i + dir;
      if (i < 0 || j < 0 || j >= it.length) return it;
      const next = [...it];
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });

  const itineraryData = itinerary.map((s) => destinations.find((d) => d.slug === s)!).filter(Boolean);
  const totalDistance = itineraryData.slice(1).reduce((sum, d, i) => sum + haversine(itineraryData[i], d), 0);
  const totalMinutes =
    itineraryData.reduce((sum, d) => sum + (d.duration_minutes ?? 60), 0) + Math.round((totalDistance / 30) * 60);

  const markerElements = useMemo(
    () =>
      filtered.map((d) => {
        const isSel = d.slug === selected;
        const isDim = !!selected && !isSel;
        return (
          <Marker
            key={d.slug}
            position={[d.lat, d.lng]}
            icon={makeIcon(d.category_color ?? "#22d3ee", isSel, isDim)}
            eventHandlers={{
              click: () => {
                setSelected(d.slug);
                onFocus(d.slug);
              },
            }}
          />
        );
      }),
    [filtered, selected, onFocus],
  );

  return (
    <div className="relative w-full">
      <div className="relative h-[80vh] w-full overflow-hidden rounded-3xl border border-white/10">
        <MapContainer
          center={SIDOARJO_CENTER}
          zoom={SIDOARJO_ZOOM}
          scrollWheelZoom
          className="h-full w-full"
          style={{ background: "#050914" }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            detectRetina={false}
            keepBuffer={2}
            updateWhenZooming={false}
          />
          <FlyController target={target} />
          {markerElements}
        </MapContainer>

        {/* Search panel */}
        <div ref={searchRef} className="absolute left-4 top-4 z-[500] w-[min(360px,calc(100%-2rem))]">
          <div className="glass-strong flex items-center gap-2 rounded-2xl border border-white/10 px-4 py-3">
            <Search className="h-4 w-4 text-primary" />
            <input
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setShowSuggest(true);
              }}
              onFocus={() => setShowSuggest(true)}
              placeholder="Search destinations, districts, tags…"
              className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
            {query && (
              <button onClick={() => setQuery("")} aria-label="Clear search">
                <X className="h-4 w-4 opacity-60" />
              </button>
            )}
          </div>
          <AnimatePresence>
            {showSuggest && suggestions.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                className="glass-strong mt-2 overflow-hidden rounded-2xl border border-white/10"
              >
                {suggestions.map((d) => (
                  <button
                    key={d.slug}
                    onClick={() => {
                      setSelected(d.slug);
                      onFocus(d.slug);
                      setQuery(d.name);
                      setShowSuggest(false);
                    }}
                    className="flex w-full items-center gap-3 border-b border-white/5 px-4 py-3 text-left text-sm last:border-b-0 hover:bg-white/5"
                  >
                    <span
                      className="h-2 w-2 rounded-full"
                      style={{ background: d.category_color ?? "#22d3ee" }}
                    />
                    <span className="flex-1">{d.name}</span>
                    <span className="text-[10px] uppercase tracking-widest text-muted-foreground">
                      {d.category_name}
                    </span>
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Category chips */}
          <div className="mt-3 flex flex-wrap gap-1.5">
            {categories.map((c) => {
              const on = activeCats.has(c.slug);
              return (
                <button
                  key={c.slug}
                  onClick={() => toggleCat(c.slug)}
                  className={`rounded-full border px-3 py-1 text-[10px] uppercase tracking-widest transition ${
                    on ? "border-transparent text-background" : "border-white/15 text-muted-foreground hover:border-white/40"
                  }`}
                  style={on ? { background: c.color } : undefined}
                >
                  {c.name}
                </button>
              );
            })}
          </div>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {flagFilters.map((f) => {
              const on = activeFlags.has(f.key);
              return (
                <button
                  key={f.key}
                  onClick={() => toggleFlag(f.key)}
                  className={`rounded-full border px-3 py-1 text-[10px] uppercase tracking-widest transition ${
                    on
                      ? "border-primary bg-primary/20 text-primary"
                      : "border-white/10 text-muted-foreground hover:border-white/30"
                  }`}
                >
                  {f.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Detail card */}
        <AnimatePresence>
          {selectedDest && (
            <motion.div
              key={selectedDest.slug}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 40 }}
              className="absolute right-4 top-4 z-[500] w-[min(340px,calc(100%-2rem))]"
            >
              <div className="glass-strong overflow-hidden rounded-2xl border border-white/10">
                {selectedDest.hero_image && (
                  <div className="relative h-40 overflow-hidden">
                    <img src={selectedDest.hero_image} alt={selectedDest.name} className="h-full w-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                    <button
                      onClick={() => {
                        setSelected(null);
                        onFocus(null);
                      }}
                      className="absolute right-3 top-3 rounded-full bg-black/40 p-1.5 backdrop-blur"
                      aria-label="Close"
                    >
                      <X className="h-4 w-4" />
                    </button>
                    <div className="absolute bottom-3 left-4 right-4">
                      <div className="text-[10px] uppercase tracking-[0.3em] text-primary">
                        {selectedDest.category_name} · {selectedDest.district}
                      </div>
                      <h3 className="mt-1 text-xl font-light">{selectedDest.name}</h3>
                    </div>
                  </div>
                )}
                <div className="space-y-3 p-4">
                  <p className="text-sm text-muted-foreground">{selectedDest.short_desc}</p>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <span className="flex items-center gap-1.5">
                      <Clock className="h-3 w-3 text-primary" />
                      {selectedDest.opening_hours ?? "—"}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Ticket className="h-3 w-3 text-primary" />
                      {selectedDest.ticket_price ?? "—"}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Star className="h-3 w-3 text-accent" />
                      {selectedDest.rating ?? "—"}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <MapPin className="h-3 w-3 text-primary" />
                      {selectedDest.duration_minutes ? `${selectedDest.duration_minutes} min` : "—"}
                    </span>
                  </div>
                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={() => addToItinerary(selectedDest.slug)}
                      className="flex-1 rounded-full bg-primary px-4 py-2 text-[11px] uppercase tracking-widest text-background transition hover:opacity-90"
                    >
                      Add to trip
                    </button>
                    {selectedDest.google_maps_url && (
                      <a
                        href={selectedDest.google_maps_url}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-full border border-white/15 px-4 py-2 text-[11px] uppercase tracking-widest hover:border-white/40"
                      >
                        Navigate
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Itinerary drawer */}
        <div className="absolute bottom-4 left-4 z-[500] w-[min(360px,calc(100%-2rem))]">
          <div className="glass-strong rounded-2xl border border-white/10 p-4">
            <div className="flex items-baseline justify-between">
              <h4 className="text-xs uppercase tracking-[0.3em] text-primary">Your Journey</h4>
              <span className="text-[10px] text-muted-foreground">
                {itineraryData.length} stops · {totalDistance.toFixed(1)} km · ~{Math.round(totalMinutes / 60)} h
              </span>
            </div>
            {itineraryData.length === 0 ? (
              <p className="mt-2 text-xs text-muted-foreground">
                Tap a marker, then <em>Add to trip</em>. Or ask the AI Tour Guide.
              </p>
            ) : (
              <ol className="mt-3 space-y-1.5">
                {itineraryData.map((d, i) => (
                  <li key={d.slug} className="flex items-center gap-2 rounded-lg bg-white/5 px-2 py-1.5 text-xs">
                    <span className="w-4 text-primary">{i + 1}</span>
                    <button
                      onClick={() => {
                        setSelected(d.slug);
                        onFocus(d.slug);
                      }}
                      className="flex-1 truncate text-left"
                    >
                      {d.name}
                    </button>
                    <button onClick={() => move(d.slug, -1)} aria-label="Move up" className="opacity-60 hover:opacity-100">
                      <ArrowUp className="h-3 w-3" />
                    </button>
                    <button onClick={() => move(d.slug, 1)} aria-label="Move down" className="opacity-60 hover:opacity-100">
                      <ArrowDown className="h-3 w-3" />
                    </button>
                    <button
                      onClick={() => removeFromItinerary(d.slug)}
                      aria-label="Remove"
                      className="opacity-60 hover:opacity-100"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </li>
                ))}
              </ol>
            )}
            <div className="mt-3 flex gap-2">
              {[1, 2, 3].map((days) => (
                <button
                  key={days}
                  onClick={() => {
                    // Naïve auto-plan: pick top popular, mix by category
                    const picks: string[] = [];
                    const byCat = new Map<string, DestinationDTO[]>();
                    for (const d of destinations) {
                      const k = d.category_slug ?? "misc";
                      byCat.set(k, [...(byCat.get(k) ?? []), d]);
                    }
                    const targetCount = days * 4;
                    const cats = Array.from(byCat.keys());
                    let i = 0;
                    while (picks.length < targetCount && cats.length) {
                      const c = cats[i % cats.length];
                      const list = byCat.get(c)!;
                      const next = list.shift();
                      if (next) picks.push(next.slug);
                      else cats.splice(i % cats.length, 1);
                      i++;
                    }
                    setItinerary(picks);
                  }}
                  className="flex-1 rounded-full border border-white/15 px-3 py-1.5 text-[10px] uppercase tracking-widest hover:border-primary hover:text-primary"
                >
                  {days}-day
                </button>
              ))}
              {itinerary.length > 0 && (
                <button
                  onClick={() => setItinerary([])}
                  className="rounded-full border border-white/10 px-3 py-1.5 text-[10px] uppercase tracking-widest text-muted-foreground hover:border-destructive hover:text-destructive"
                >
                  <Plus className="h-3 w-3 rotate-45" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

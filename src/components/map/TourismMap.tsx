import { useEffect, useMemo, useRef, useState } from "react";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import L from "leaflet";
import "leaflet.markercluster";
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

// Icons are cached — same color+state always reuses the same L.DivIcon.
const iconCache = new Map<string, L.DivIcon>();

function makeIcon(color: string, selected: boolean, dim: boolean) {
  const state = selected ? "selected" : dim ? "dim" : "default";
  const key = `${color}|${state}`;
  const cached = iconCache.get(key);
  if (cached) return cached;

  let html: string;
  let size: number;

  if (selected) {
    size = 40;
    html = `<div style="width:${size}px;height:${size}px;border-radius:9999px;background:radial-gradient(circle at 30% 30%, #fff, ${color});box-shadow:0 0 0 3px rgba(255,255,255,0.7), 0 0 0 6px ${color}66, 0 0 18px ${color};"></div>`;
  } else {
    size = 22;
    const opacity = dim ? 0.25 : 1;
    html = `<div style="width:${size}px;height:${size}px;opacity:${opacity};border-radius:9999px;background:${color};box-shadow:0 0 0 2px rgba(255,255,255,0.6);"></div>`;
  }

  const icon = L.divIcon({ html, className: "sd-marker", iconSize: [size, size], iconAnchor: [size / 2, size / 2] });
  iconCache.set(key, icon);
  return icon;
}

function useIsMobile() {
  const [mobile, setMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const on = () => setMobile(mq.matches);
    on();
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  return mobile;
}

function FlyController({ target, mobile }: { target: [number, number] | null; mobile: boolean }) {
  const map = useMap();
  const raf = useRef<number | null>(null);
  useEffect(() => {
    if (!target) return;
    if (raf.current) cancelAnimationFrame(raf.current);
    // Defer to next frame so a scroll-driven state change never fights the current paint.
    raf.current = requestAnimationFrame(() => {
      map.flyTo(target, mobile ? 13 : 14, {
        duration: mobile ? 0.8 : 1.1,
        easeLinearity: 0.4,
        noMoveStart: true,
      });
    });
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, [target, map, mobile]);
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
  const mobile = useIsMobile();
  const [activeCats, setActiveCats] = useState<Set<string>>(new Set());
  const [activeFlags, setActiveFlags] = useState<Set<string>>(new Set());
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<string | null>(focusSlug);
  const [hoverCat, setHoverCat] = useState<string | null>(null);
  const [itinerary, setItinerary] = useState<string[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);
  const [showSuggest, setShowSuggest] = useState(false);
  const clusterRef = useRef<L.MarkerClusterGroup | null>(null);
  const markerRefs = useRef(new Map<string, L.Marker>());

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

  // Categories present in the filtered set → drives the scroll-synced legend.
  const legend = useMemo(() => {
    const counts = new Map<string, number>();
    for (const d of filtered) if (d.category_slug) counts.set(d.category_slug, (counts.get(d.category_slug) ?? 0) + 1);
    return categories
      .filter((c) => counts.has(c.slug))
      .map((c) => ({ ...c, count: counts.get(c.slug)! }));
  }, [filtered, categories]);

  // Which category should currently pop? Hover wins; otherwise derive from the focused destination.
  const focusCat = useMemo(() => {
    if (hoverCat) return hoverCat;
    const s = focusSlug ?? selected;
    if (!s) return null;
    return destinations.find((d) => d.slug === s)?.category_slug ?? null;
  }, [hoverCat, focusSlug, selected, destinations]);

  // Expand the cluster containing the currently-focused marker.
  useEffect(() => {
    const cluster = clusterRef.current;
    const slug = focusSlug ?? selected;
    if (!cluster || !slug) return;
    const marker = markerRefs.current.get(slug);
    if (!marker) return;
    const id = window.setTimeout(() => {
      const parent = cluster.getVisibleParent(marker);
      if (parent && parent !== marker && "spiderfy" in parent) {
        (parent as any).spiderfy?.();
      }
    }, 260);
    return () => window.clearTimeout(id);
  }, [focusSlug, selected]);

  // Cluster icon builder — colored by dominant category, highlighted when it holds the focus category.
  const iconCreate = useMemo(() => {
    return (cluster: L.MarkerCluster) => {
      const children = cluster.getAllChildMarkers();
      const catCounts = new Map<string, number>();
      let match = 0;
      children.forEach((m: any) => {
        const cat = m.options?.destCat as string | undefined;
        if (cat) catCounts.set(cat, (catCounts.get(cat) ?? 0) + 1);
        if (focusCat && cat === focusCat) match++;
      });
      let dominant: string | undefined;
      let best = 0;
      catCounts.forEach((v, k) => {
        if (v > best) {
          best = v;
          dominant = k;
        }
      });
      const cat = categories.find((c) => c.slug === dominant);
      const color = cat?.color ?? "#22d3ee";
      const total = children.length;
      const hasMatch = focusCat && match > 0;
      const dim = focusCat && !hasMatch;
      const size = total < 10 ? 40 : total < 30 ? 52 : 64;
      const ring = hasMatch ? "0 0 0 3px rgba(255,255,255,0.9), 0 0 22px " + color : dim ? "none" : "0 0 0 2px rgba(255,255,255,0.35)";
      const opacity = dim ? 0.35 : 1;
      const html = `
        <div style="width:${size}px;height:${size}px;border-radius:9999px;background:radial-gradient(circle at 30% 30%, ${color}dd, ${color}55);display:flex;align-items:center;justify-content:center;color:#fff;font:600 12px/1 ui-sans-serif,system-ui;letter-spacing:.05em;box-shadow:${ring};opacity:${opacity};">
          ${total}${hasMatch ? `<span style="position:absolute;bottom:-4px;right:-4px;background:#fff;color:${color};border-radius:9999px;font-size:9px;padding:1px 5px;">${match}</span>` : ""}
        </div>`;
      return L.divIcon({ html, className: "sd-cluster", iconSize: [size, size] });
    };
  }, [categories, focusCat]);

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

  // When hovering the legend, spiderfy every visible cluster that contains a matching marker.
  useEffect(() => {
    const cluster = clusterRef.current;
    if (!cluster || !hoverCat) return;
    const seen = new Set<any>();
    filtered.forEach((d) => {
      if (d.category_slug !== hoverCat) return;
      const marker = markerRefs.current.get(d.slug);
      if (!marker) return;
      const parent = cluster.getVisibleParent(marker);
      if (parent && parent !== marker && "spiderfy" in parent && !seen.has(parent)) {
        seen.add(parent);
        (parent as any).spiderfy?.();
      }
    });
    return () => {
      seen.forEach((p) => (p as any).unspiderfy?.());
    };
  }, [hoverCat, filtered]);

  const markerElements = useMemo(
    () =>
      filtered.map((d) => {
        const isSel = d.slug === selected;
        const dimByCat = focusCat && d.category_slug !== focusCat && !isSel;
        const isDim = !!(dimByCat || (selected && !isSel && !focusCat));
        return (
          <Marker
            key={d.slug}
            position={[d.lat, d.lng]}
            icon={makeIcon(d.category_color ?? "#22d3ee", isSel, isDim)}
            // @ts-expect-error stash category on options for cluster icon builder
            destCat={d.category_slug}
            ref={(ref) => {
              if (ref) markerRefs.current.set(d.slug, ref as unknown as L.Marker);
              else markerRefs.current.delete(d.slug);
            }}
            eventHandlers={{
              click: () => {
                setSelected(d.slug);
                onFocus(d.slug);
              },
            }}
          />
        );
      }),
    [filtered, selected, focusCat, onFocus],
  );

  return (
    <div className="relative w-full">
      <div className="relative h-[80vh] w-full overflow-hidden rounded-3xl border border-white/10">
        <MapContainer
          center={SIDOARJO_CENTER}
          zoom={SIDOARJO_ZOOM}
          minZoom={9}
          maxZoom={16}
          scrollWheelZoom
          preferCanvas
          zoomAnimation={!mobile}
          fadeAnimation={false}
          markerZoomAnimation={!mobile}
          className="h-full w-full"
          style={{ background: "#e9e7e0" }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png"
            detectRetina={false}
            keepBuffer={mobile ? 0 : 1}
            updateWhenIdle
            updateWhenZooming={false}
            updateInterval={mobile ? 400 : 200}
          />
          <FlyController target={target} mobile={mobile} />
          <MarkerClusterGroup
            ref={clusterRef as any}
            chunkedLoading
            removeOutsideVisibleBounds
            animate={!mobile}
            animateAddingMarkers={false}
            spiderfyOnMaxZoom
            showCoverageOnHover={false}
            maxClusterRadius={mobile ? 60 : 48}
            iconCreateFunction={iconCreate}
          >
            {markerElements}
          </MarkerClusterGroup>
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

          {/* Category + mood filter chips — wrapped in a solid glass card so the
              light-toned text stays legible over any basemap color, instead of
              floating bare on top of the map tiles. */}
          <div className="glass-strong mt-3 rounded-2xl border border-white/10 p-3">
            <div className="flex flex-wrap gap-1.5">
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
        </div>

        {/* Scroll-synced legend — hover to expand clusters, live count reflects filters */}
        <div
          className="absolute bottom-4 right-4 z-[500] w-[min(240px,calc(100%-2rem))]"
          onMouseLeave={() => setHoverCat(null)}
        >
          <div className="glass-strong rounded-2xl border border-white/10 p-3">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-[10px] uppercase tracking-[0.3em] text-primary">Legend</span>
              <span className="text-[10px] text-muted-foreground">{filtered.length} pts</span>
            </div>
            <ul className="space-y-1">
              {legend.map((c) => {
                const active = focusCat === c.slug;
                return (
                  <li key={c.slug}>
                    <button
                      onMouseEnter={() => !mobile && setHoverCat(c.slug)}
                      onFocus={() => setHoverCat(c.slug)}
                      onClick={() => {
                        // Tap on mobile toggles the highlight.
                        setHoverCat((h) => (h === c.slug ? null : c.slug));
                      }}
                      className={`flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left text-xs transition ${
                        active ? "bg-white/10" : "hover:bg-white/5"
                      }`}
                    >
                      <span
                        className="h-2.5 w-2.5 rounded-full transition"
                        style={{
                          background: c.color,
                          boxShadow: active ? `0 0 0 3px ${c.color}55` : "none",
                        }}
                      />
                      <span className="flex-1 truncate">{c.name}</span>
                      <span className="text-[10px] text-muted-foreground">{c.count}</span>
                    </button>
                  </li>
                );
              })}
              {legend.length === 0 && (
                <li className="text-[11px] text-muted-foreground">No destinations match your filters.</li>
              )}
            </ul>
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
                    <img src={selectedDest.hero_image} alt={selectedDest.name} className="h-full w-full object-cover" loading="lazy" />
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

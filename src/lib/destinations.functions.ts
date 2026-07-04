import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

function serverSupabase() {
  return createClient<Database>(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_PUBLISHABLE_KEY!,
    { auth: { storage: undefined, persistSession: false, autoRefreshToken: false } },
  );
}

export type CategoryDTO = {
  id: string;
  slug: string;
  name: string;
  icon: string;
  color: string;
  sort: number;
};

export type DestinationDTO = {
  id: string;
  slug: string;
  name: string;
  category_id: string | null;
  category_slug: string | null;
  category_name: string | null;
  category_color: string | null;
  district: string | null;
  village: string | null;
  lat: number;
  lng: number;
  hero_image: string | null;
  short_desc: string | null;
  description: string | null;
  opening_hours: string | null;
  ticket_price: string | null;
  rating: number | null;
  duration_minutes: number | null;
  website: string | null;
  google_maps_url: string | null;
  tags: string[];
  is_hidden_gem: boolean;
  is_popular: boolean;
  is_new: boolean;
  is_free: boolean;
  is_family_friendly: boolean;
  is_accessible: boolean;
  is_night: boolean;
  chapter_order: number | null;
};

export const listCategories = createServerFn({ method: "GET" }).handler(async () => {
  const supabase = serverSupabase();
  const { data, error } = await supabase
    .from("categories")
    .select("id,slug,name,icon,color,sort")
    .order("sort");
  if (error) throw new Error(error.message);
  return (data ?? []) as CategoryDTO[];
});

export const listDestinations = createServerFn({ method: "GET" }).handler(async () => {
  const supabase = serverSupabase();
  const { data, error } = await supabase
    .from("destinations")
    .select(
      "id,slug,name,category_id,district,village,lat,lng,hero_image,short_desc,description,opening_hours,ticket_price,rating,duration_minutes,website,google_maps_url,tags,is_hidden_gem,is_popular,is_new,is_free,is_family_friendly,is_accessible,is_night,chapter_order,categories(slug,name,color)",
    )
    .order("name");
  if (error) throw new Error(error.message);
  return (data ?? []).map((d: any) => ({
    id: d.id,
    slug: d.slug,
    name: d.name,
    category_id: d.category_id,
    category_slug: d.categories?.slug ?? null,
    category_name: d.categories?.name ?? null,
    category_color: d.categories?.color ?? null,
    district: d.district,
    village: d.village,
    lat: d.lat,
    lng: d.lng,
    hero_image: d.hero_image,
    short_desc: d.short_desc,
    description: d.description,
    opening_hours: d.opening_hours,
    ticket_price: d.ticket_price,
    rating: d.rating != null ? Number(d.rating) : null,
    duration_minutes: d.duration_minutes,
    website: d.website,
    google_maps_url: d.google_maps_url,
    tags: d.tags ?? [],
    is_hidden_gem: !!d.is_hidden_gem,
    is_popular: !!d.is_popular,
    is_new: !!d.is_new,
    is_free: !!d.is_free,
    is_family_friendly: !!d.is_family_friendly,
    is_accessible: !!d.is_accessible,
    is_night: !!d.is_night,
    chapter_order: d.chapter_order,
  })) as DestinationDTO[];
});


-- Categories
CREATE TABLE public.categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  name text NOT NULL,
  icon text NOT NULL,
  color text NOT NULL,
  sort int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.categories TO anon, authenticated;
GRANT ALL ON public.categories TO service_role;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "categories are public" ON public.categories FOR SELECT USING (true);

-- Destinations
CREATE TABLE public.destinations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  name text NOT NULL,
  category_id uuid REFERENCES public.categories(id) ON DELETE SET NULL,
  district text,
  village text,
  lat double precision NOT NULL,
  lng double precision NOT NULL,
  hero_image text,
  description text,
  short_desc text,
  opening_hours text,
  ticket_price text,
  rating numeric(2,1) DEFAULT 4.5,
  duration_minutes int DEFAULT 60,
  website text,
  google_maps_url text,
  tags text[] DEFAULT '{}',
  is_hidden_gem boolean DEFAULT false,
  is_popular boolean DEFAULT false,
  is_new boolean DEFAULT false,
  is_free boolean DEFAULT false,
  is_family_friendly boolean DEFAULT true,
  is_accessible boolean DEFAULT false,
  is_night boolean DEFAULT false,
  chapter_order int,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.destinations TO anon, authenticated;
GRANT ALL ON public.destinations TO service_role;
ALTER TABLE public.destinations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "destinations are public" ON public.destinations FOR SELECT USING (true);

-- Gallery
CREATE TABLE public.destination_gallery (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  destination_id uuid NOT NULL REFERENCES public.destinations(id) ON DELETE CASCADE,
  image_url text NOT NULL,
  caption text,
  sort int NOT NULL DEFAULT 0
);
GRANT SELECT ON public.destination_gallery TO anon, authenticated;
GRANT ALL ON public.destination_gallery TO service_role;
ALTER TABLE public.destination_gallery ENABLE ROW LEVEL SECURITY;
CREATE POLICY "gallery is public" ON public.destination_gallery FOR SELECT USING (true);

-- Facilities
CREATE TABLE public.destination_facilities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  destination_id uuid NOT NULL REFERENCES public.destinations(id) ON DELETE CASCADE,
  facility text NOT NULL
);
GRANT SELECT ON public.destination_facilities TO anon, authenticated;
GRANT ALL ON public.destination_facilities TO service_role;
ALTER TABLE public.destination_facilities ENABLE ROW LEVEL SECURITY;
CREATE POLICY "facilities are public" ON public.destination_facilities FOR SELECT USING (true);

-- Events
CREATE TABLE public.tourism_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  destination_id uuid REFERENCES public.destinations(id) ON DELETE SET NULL,
  name text NOT NULL,
  description text,
  image text,
  starts_at timestamptz NOT NULL,
  ends_at timestamptz
);
GRANT SELECT ON public.tourism_events TO anon, authenticated;
GRANT ALL ON public.tourism_events TO service_role;
ALTER TABLE public.tourism_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "events are public" ON public.tourism_events FOR SELECT USING (true);

-- Roles (for future admin CRUD)
CREATE TYPE public.app_role AS ENUM ('admin','moderator','user');
CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  UNIQUE(user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "users read own roles" ON public.user_roles FOR SELECT TO authenticated USING (user_id = auth.uid());

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role);
$$;

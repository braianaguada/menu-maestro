-- Enum para roles de usuario
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- Enum para estado del menú
CREATE TYPE public.menu_status AS ENUM ('draft', 'published');

-- Tabla de roles de usuario (separada por seguridad)
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL DEFAULT 'user',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Función para verificar roles (security definer para evitar recursión)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Tabla de menús
CREATE TABLE public.menus (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    logo_url TEXT,
    status menu_status NOT NULL DEFAULT 'draft',
    theme TEXT NOT NULL DEFAULT 'elegant',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.menus ENABLE ROW LEVEL SECURITY;

-- Tabla de secciones
CREATE TABLE public.sections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    menu_id UUID REFERENCES public.menus(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    sort_order INTEGER NOT NULL DEFAULT 0,
    is_visible BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.sections ENABLE ROW LEVEL SECURITY;

-- Tabla de items/platos
CREATE TABLE public.items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    section_id UUID REFERENCES public.sections(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    image_url TEXT,
    is_visible BOOLEAN NOT NULL DEFAULT true,
    is_recommended BOOLEAN NOT NULL DEFAULT false,
    is_vegan BOOLEAN NOT NULL DEFAULT false,
    is_spicy BOOLEAN NOT NULL DEFAULT false,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.items ENABLE ROW LEVEL SECURITY;

-- Tabla de promociones
CREATE TABLE public.promotions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    menu_id UUID REFERENCES public.menus(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    price_text TEXT NOT NULL,
    image_url TEXT,
    is_active BOOLEAN NOT NULL DEFAULT true,
    sort_order INTEGER NOT NULL DEFAULT 0,
    linked_section_id UUID REFERENCES public.sections(id) ON DELETE SET NULL,
    linked_item_id UUID REFERENCES public.items(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.promotions ENABLE ROW LEVEL SECURITY;

-- Tabla de analítica de vistas
CREATE TABLE public.menu_views (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    menu_id UUID REFERENCES public.menus(id) ON DELETE CASCADE NOT NULL,
    viewed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    user_agent TEXT,
    ip_hash TEXT
);

ALTER TABLE public.menu_views ENABLE ROW LEVEL SECURITY;

-- Tabla de clicks en promociones
CREATE TABLE public.promo_clicks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    promotion_id UUID REFERENCES public.promotions(id) ON DELETE CASCADE NOT NULL,
    clicked_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.promo_clicks ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- User roles: solo lectura propia
CREATE POLICY "Users can view own roles" ON public.user_roles
    FOR SELECT USING (auth.uid() = user_id);

-- Menus: owner puede todo, público puede ver publicados
CREATE POLICY "Menu owners can do everything" ON public.menus
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Anyone can view published menus" ON public.menus
    FOR SELECT USING (status = 'published');

-- Sections: owner puede todo vía menu, público puede ver visibles de menús publicados
CREATE POLICY "Section owners can do everything" ON public.sections
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.menus 
            WHERE menus.id = sections.menu_id 
            AND menus.user_id = auth.uid()
        )
    );

CREATE POLICY "Anyone can view visible sections of published menus" ON public.sections
    FOR SELECT USING (
        is_visible = true AND
        EXISTS (
            SELECT 1 FROM public.menus 
            WHERE menus.id = sections.menu_id 
            AND menus.status = 'published'
        )
    );

-- Items: owner puede todo vía section/menu, público puede ver visibles
CREATE POLICY "Item owners can do everything" ON public.items
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.sections
            JOIN public.menus ON menus.id = sections.menu_id
            WHERE sections.id = items.section_id 
            AND menus.user_id = auth.uid()
        )
    );

CREATE POLICY "Anyone can view visible items of published menus" ON public.items
    FOR SELECT USING (
        is_visible = true AND
        EXISTS (
            SELECT 1 FROM public.sections
            JOIN public.menus ON menus.id = sections.menu_id
            WHERE sections.id = items.section_id 
            AND menus.status = 'published'
        )
    );

-- Promotions: owner puede todo, público puede ver activas
CREATE POLICY "Promotion owners can do everything" ON public.promotions
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.menus 
            WHERE menus.id = promotions.menu_id 
            AND menus.user_id = auth.uid()
        )
    );

CREATE POLICY "Anyone can view active promotions of published menus" ON public.promotions
    FOR SELECT USING (
        is_active = true AND
        EXISTS (
            SELECT 1 FROM public.menus 
            WHERE menus.id = promotions.menu_id 
            AND menus.status = 'published'
        )
    );

-- Menu views: inserción pública, lectura solo owner
CREATE POLICY "Anyone can insert menu views" ON public.menu_views
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Menu owners can view analytics" ON public.menu_views
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.menus 
            WHERE menus.id = menu_views.menu_id 
            AND menus.user_id = auth.uid()
        )
    );

-- Promo clicks: inserción pública, lectura solo owner
CREATE POLICY "Anyone can insert promo clicks" ON public.promo_clicks
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Promo owners can view clicks" ON public.promo_clicks
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.promotions
            JOIN public.menus ON menus.id = promotions.menu_id
            WHERE promotions.id = promo_clicks.promotion_id 
            AND menus.user_id = auth.uid()
        )
    );

-- Trigger para updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_menus_updated_at BEFORE UPDATE ON public.menus
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_sections_updated_at BEFORE UPDATE ON public.sections
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_items_updated_at BEFORE UPDATE ON public.items
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_promotions_updated_at BEFORE UPDATE ON public.promotions
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
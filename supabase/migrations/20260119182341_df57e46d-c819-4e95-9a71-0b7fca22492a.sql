-- Fix RLS policy for menu_views insert - require valid menu_id
DROP POLICY "Anyone can insert menu views" ON public.menu_views;
CREATE POLICY "Anyone can insert menu views for published menus" ON public.menu_views
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.menus 
            WHERE menus.id = menu_views.menu_id 
            AND menus.status = 'published'
        )
    );

-- Fix RLS policy for promo_clicks insert - require valid active promotion
DROP POLICY "Anyone can insert promo clicks" ON public.promo_clicks;
CREATE POLICY "Anyone can insert clicks for active promos" ON public.promo_clicks
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.promotions
            JOIN public.menus ON menus.id = promotions.menu_id
            WHERE promotions.id = promo_clicks.promotion_id 
            AND promotions.is_active = true
            AND menus.status = 'published'
        )
    );

-- Fix function search path for update_updated_at_column
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$;
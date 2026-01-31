import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import type { Menu, Section, Item, Promotion } from '@/types/menu';

// Menus
export function useMenus() {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['admin-menus', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('menus')
        .select('*')
        .eq('user_id', user!.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Menu[];
    },
    enabled: !!user,
  });
}

export function useMenu(menuId: string | undefined) {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['admin-menu', user?.id, menuId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('menus')
        .select('*')
        .eq('id', menuId!)
        .eq('user_id', user!.id)
        .maybeSingle();

      if (error) throw error;
      return data as Menu | null;
    },
    enabled: !!user && !!menuId,
  });
}

export function useCreateMenu() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (data: { name: string; slug: string; theme?: string }) => {
      const { data: menu, error } = await supabase
        .from('menus')
        .insert({
          user_id: user!.id,
          name: data.name,
          slug: data.slug,
          theme: data.theme || 'editorial',
          status: 'draft',
        })
        .select()
        .single();
      
      if (error) throw error;
      return menu;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-menus'] });
    },
  });
}

export function useUpdateMenu() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...data }: Partial<Menu> & { id: string }) => {
      const { error } = await supabase
        .from('menus')
        .update(data)
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-menus'] });
    },
  });
}

export function useDeleteMenu() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('menus').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-menus'] });
    },
  });
}

// Sections
export function useSections(menuId: string | undefined) {
  return useQuery({
    queryKey: ['admin-sections', menuId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('sections')
        .select('*')
        .eq('menu_id', menuId!)
        .order('sort_order', { ascending: true });
      
      if (error) throw error;
      return data as Section[];
    },
    enabled: !!menuId,
  });
}

export function useCreateSection() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      menu_id: string;
      name: string;
      description?: string;
      name_en?: string | null;
      name_pt?: string | null;
      description_en?: string | null;
      description_pt?: string | null;
      sort_order?: number;
    }) => {
      const { data: section, error } = await supabase
        .from('sections')
        .insert(data)
        .select()
        .single();
      
      if (error) throw error;
      return section;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['admin-sections', variables.menu_id] });
    },
  });
}

export function useUpdateSection() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, menu_id, ...data }: Partial<Section> & { id: string; menu_id: string }) => {
      const { error } = await supabase
        .from('sections')
        .update(data)
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['admin-sections', variables.menu_id] });
    },
  });
}

export function useDeleteSection() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, menu_id }: { id: string; menu_id: string }) => {
      const { error } = await supabase.from('sections').delete().eq('id', id);
      if (error) throw error;
      return menu_id;
    },
    onSuccess: (menu_id) => {
      queryClient.invalidateQueries({ queryKey: ['admin-sections', menu_id] });
    },
  });
}

// Items
export function useItems(sectionId: string | undefined) {
  return useQuery({
    queryKey: ['admin-items', sectionId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('items')
        .select('*')
        .eq('section_id', sectionId!)
        .order('sort_order', { ascending: true });
      
      if (error) throw error;
      return data as Item[];
    },
    enabled: !!sectionId,
  });
}

export function useAllMenuItems(menuId: string | undefined) {
  return useQuery({
    queryKey: ['admin-all-items', menuId],
    queryFn: async () => {
      // First get sections for this menu
      const { data: sections, error: sectionsError } = await supabase
        .from('sections')
        .select('id')
        .eq('menu_id', menuId!);
      
      if (sectionsError) throw sectionsError;
      if (!sections.length) return [];

      const sectionIds = sections.map(s => s.id);
      
      const { data, error } = await supabase
        .from('items')
        .select('*')
        .in('section_id', sectionIds)
        .order('sort_order', { ascending: true });
      
      if (error) throw error;
      return data as Item[];
    },
    enabled: !!menuId,
  });
}

export function useCreateItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { 
      section_id: string; 
      name: string; 
      description?: string; 
      description_en?: string | null;
      description_pt?: string | null;
      name_en?: string | null;
      name_pt?: string | null;
      pairing?: string | null;
      pairing_en?: string | null;
      pairing_pt?: string | null;
      price: number;
      image_url?: string | null;
      is_recommended?: boolean;
      is_vegan?: boolean;
      is_spicy?: boolean;
      is_gluten_free?: boolean;
      is_dairy_free?: boolean;
      allergens?: string[];
      sort_order?: number;
    }) => {
      const { data: item, error } = await supabase
        .from('items')
        .insert(data)
        .select()
        .single();
      
      if (error) throw error;
      return item;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['admin-items', variables.section_id] });
      queryClient.invalidateQueries({ queryKey: ['admin-all-items'] });
    },
  });
}

export function useUpdateItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, section_id, ...data }: Partial<Item> & { id: string; section_id: string }) => {
      const { error } = await supabase
        .from('items')
        .update(data)
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['admin-items', variables.section_id] });
      queryClient.invalidateQueries({ queryKey: ['admin-all-items'] });
    },
  });
}

export function useDeleteItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, section_id }: { id: string; section_id: string }) => {
      const { error } = await supabase.from('items').delete().eq('id', id);
      if (error) throw error;
      return section_id;
    },
    onSuccess: (section_id) => {
      queryClient.invalidateQueries({ queryKey: ['admin-items', section_id] });
      queryClient.invalidateQueries({ queryKey: ['admin-all-items'] });
    },
  });
}

// Promotions
export function usePromotions(menuId: string | undefined) {
  return useQuery({
    queryKey: ['admin-promotions', menuId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('promotions')
        .select('*')
        .eq('menu_id', menuId!)
        .order('sort_order', { ascending: true });
      
      if (error) throw error;
      return data as Promotion[];
    },
    enabled: !!menuId,
  });
}

export function useCreatePromotion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { 
      menu_id: string; 
      title: string; 
      description?: string; 
      title_en?: string | null;
      title_pt?: string | null;
      description_en?: string | null;
      description_pt?: string | null;
      price_text: string;
      price_text_en?: string | null;
      price_text_pt?: string | null;
      image_url?: string | null;
      linked_section_id?: string;
      linked_item_id?: string;
      starts_at?: string | null;
      ends_at?: string | null;
      ab_group?: string | null;
      ab_weight?: number;
      sort_order?: number;
    }) => {
      const { data: promo, error } = await supabase
        .from('promotions')
        .insert(data)
        .select()
        .single();
      
      if (error) throw error;
      return promo;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['admin-promotions', variables.menu_id] });
    },
  });
}

export function useUpdatePromotion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, menu_id, ...data }: Partial<Promotion> & { id: string; menu_id: string }) => {
      const { error } = await supabase
        .from('promotions')
        .update(data)
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['admin-promotions', variables.menu_id] });
    },
  });
}

export function useDeletePromotion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, menu_id }: { id: string; menu_id: string }) => {
      const { error } = await supabase.from('promotions').delete().eq('id', id);
      if (error) throw error;
      return menu_id;
    },
    onSuccess: (menu_id) => {
      queryClient.invalidateQueries({ queryKey: ['admin-promotions', menu_id] });
    },
  });
}

// Bulk price update
export function useUpdatePrices() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ 
      menuId, 
      sectionId, 
      percentage 
    }: { 
      menuId: string; 
      sectionId?: string; 
      percentage: number 
    }) => {
      // Get items to update
      let query = supabase.from('items').select('id, price, section_id');
      
      if (sectionId) {
        query = query.eq('section_id', sectionId);
      } else {
        // Get all sections for this menu first
        const { data: sections } = await supabase
          .from('sections')
          .select('id')
          .eq('menu_id', menuId);
        
        if (!sections || sections.length === 0) return;
        query = query.in('section_id', sections.map(s => s.id));
      }

      const { data: items, error: fetchError } = await query;
      if (fetchError) throw fetchError;
      if (!items?.length) return;

      // Update each item with new price
      const multiplier = 1 + (percentage / 100);
      const updates = items.map(item => ({
        id: item.id,
        price: Math.round(item.price * multiplier * 100) / 100,
      }));

      const results = await Promise.all(
        updates.map((update) =>
          supabase
            .from('items')
            .update({ price: update.price })
            .eq('id', update.id)
        )
      );

      const error = results.find((result) => result.error)?.error;
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-items'] });
      queryClient.invalidateQueries({ queryKey: ['admin-all-items'] });
    },
  });
}

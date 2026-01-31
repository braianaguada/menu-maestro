export type MenuStatus = 'draft' | 'published';

export type MenuTheme = 'editorial' | 'modern' | 'light' | 'bistro' | 'noir' | 'elegant';

export interface Menu {
  id: string;
  user_id: string;
  name: string;
  slug: string;
  logo_url: string | null;
  status: MenuStatus;
  theme: MenuTheme;
  created_at: string;
  updated_at: string;
}

export interface Section {
  id: string;
  menu_id: string;
  name: string;
  description: string | null;
  sort_order: number;
  is_visible: boolean;
  created_at: string;
  updated_at: string;
  items?: Item[];
}

export interface Item {
  id: string;
  section_id: string;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  pairing?: string | null;
  origin_note?: string | null;
  chef_note?: string | null;
  is_visible: boolean;
  is_recommended: boolean;
  is_vegan: boolean;
  is_spicy: boolean;
  is_gluten_free?: boolean;
  is_dairy_free?: boolean;
  allergens?: string[] | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface Promotion {
  id: string;
  menu_id: string;
  title: string;
  description: string | null;
  price_text: string;
  image_url: string | null;
  is_active: boolean;
  sort_order: number;
  linked_section_id: string | null;
  linked_item_id: string | null;
  starts_at: string | null;
  ends_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface MenuView {
  id: string;
  menu_id: string;
  viewed_at: string;
  user_agent: string | null;
  ip_hash: string | null;
}

export interface PromoClick {
  id: string;
  promotion_id: string;
  clicked_at: string;
}

// Full menu with all relations for public view
export interface PublicMenu extends Menu {
  sections: (Section & { items: Item[] })[];
  promotions: Promotion[];
}

import { createClient } from "@/lib/supabase/client";

export type MenuCategory = {
  id: string;
  slug: string;
  name_en: string;
  name_ar: string;
  sort_order: number;
};

export type MenuProduct = {
  id: string;
  category_id: string;
  name_en: string;
  name_ar: string;
  description_en: string | null;
  description_ar: string | null;
  price: number | null;
  image_url: string | null;
  tags: string[];
  is_featured: boolean;
  sort_order: number;
};

export async function getMenu() {
  const supabase = createClient();
  if (!supabase) return { categories: [] as MenuCategory[], products: [] as MenuProduct[] };

  const [{ data: categories }, { data: products }] = await Promise.all([
    supabase.from("menu_categories").select("id,slug,name_en,name_ar,sort_order").eq("is_active", true).order("sort_order"),
    supabase.from("menu_products").select("id,category_id,name_en,name_ar,description_en,description_ar,price,image_url,tags,is_featured,sort_order").eq("is_available", true).order("sort_order")
  ]);

  return {
    categories: (categories ?? []) as MenuCategory[],
    products: (products ?? []) as MenuProduct[]
  };
}

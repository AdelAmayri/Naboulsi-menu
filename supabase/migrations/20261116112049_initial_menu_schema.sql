-- NABOULSI Digital Menu — initial schema
-- Public customers can read active categories and available products only.
create extension if not exists pgcrypto;

create table public.menu_categories (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name_en text not null,
  name_ar text not null,
  description_en text,
  description_ar text,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.menu_products (
  id uuid primary key default gen_random_uuid(),
  category_id uuid not null references public.menu_categories(id) on delete restrict,
  slug text unique,
  name_en text not null,
  name_ar text not null,
  description_en text,
  description_ar text,
  price numeric(10,2) check (price is null or price >= 0),
  currency text not null default 'USD' check (currency = 'USD'),
  image_url text,
  tags text[] not null default '{}',
  is_featured boolean not null default false,
  is_available boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.site_settings (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz not null default now()
);

create index menu_categories_active_order_idx on public.menu_categories (is_active, sort_order);
create index menu_products_category_available_order_idx on public.menu_products (category_id, is_available, sort_order);
create index menu_products_featured_idx on public.menu_products (is_featured) where is_featured = true and is_available = true;

create or replace function public.set_updated_at()
returns trigger language plpgsql set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger menu_categories_set_updated_at before update on public.menu_categories for each row execute function public.set_updated_at();
create trigger menu_products_set_updated_at before update on public.menu_products for each row execute function public.set_updated_at();
create trigger site_settings_set_updated_at before update on public.site_settings for each row execute function public.set_updated_at();

alter table public.menu_categories enable row level security;
alter table public.menu_products enable row level security;
alter table public.site_settings enable row level security;

create policy "Public can read active menu categories" on public.menu_categories
for select to anon, authenticated using (is_active = true);

create policy "Public can read available menu products" on public.menu_products
for select to anon, authenticated using (
  is_available = true and exists (
    select 1 from public.menu_categories c
    where c.id = menu_products.category_id and c.is_active = true
  )
);

create policy "Public can read public site settings" on public.site_settings
for select to anon, authenticated using (key in ('brand', 'contact', 'social', 'ordering'));

revoke all on public.menu_categories from anon, authenticated;
revoke all on public.menu_products from anon, authenticated;
revoke all on public.site_settings from anon, authenticated;
grant select on public.menu_categories to anon, authenticated;
grant select on public.menu_products to anon, authenticated;
grant select on public.site_settings to anon, authenticated;

insert into public.menu_categories (slug, name_en, name_ar, sort_order) values
('breakfast','Breakfast','فطور',10),
('hummus-foul','Hummus & Foul','حمص وفول',20),
('falafel','Falafel','فلافل',30),
('shawarma','Shawarma','شاورما',40),
('sandwiches','Sandwiches','سندويشات',50),
('snacks','Snacks','سناك',60),
('meals','Meals','وجبات',70),
('platters','Platters','سخنات',80),
('burgers','Burgers','برغر',90),
('pizza','Pizza','بيتزا',100),
('drinks','Drinks','مشروبات',110),
('desserts','Desserts','حلويات',120)
on conflict (slug) do nothing;

insert into public.site_settings (key, value) values
('brand','{"name":"NABOULSI","tagline_en":"A Taste Worth Remembering.","tagline_ar":"الطعم الذي لا يُنسى","primary_color":"#D71920","secondary_color":"#101010"}'::jsonb),
('ordering','{"method":"whatsapp","enabled":true}'::jsonb)
on conflict (key) do nothing;

-- Qlub White-Label Platform: initial multi-tenant schema
-- Apply in a new Supabase project after reviewing policies for your deployment.

create extension if not exists pgcrypto;

create type public.platform_role as enum ('owner', 'support');
create type public.restaurant_role as enum ('admin', 'manager', 'editor', 'staff');
create type public.order_status as enum ('pending', 'accepted', 'preparing', 'ready', 'completed', 'cancelled');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  platform_role public.platform_role,
  created_at timestamptz not null default now()
);

create table public.restaurants (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  logo_url text,
  cover_url text,
  primary_color text not null default '#c8a66a',
  secondary_color text not null default '#111515',
  currency text not null default 'SAR',
  default_locale text not null default 'en',
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.restaurant_members (
  restaurant_id uuid not null references public.restaurants(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role public.restaurant_role not null default 'staff',
  created_at timestamptz not null default now(),
  primary key (restaurant_id, user_id)
);

create table public.branches (
  id uuid primary key default gen_random_uuid(),
  restaurant_id uuid not null references public.restaurants(id) on delete cascade,
  name text not null,
  address text,
  phone text,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.menu_categories (
  id uuid primary key default gen_random_uuid(),
  restaurant_id uuid not null references public.restaurants(id) on delete cascade,
  name text not null,
  name_ar text,
  description text,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.products (
  id uuid primary key default gen_random_uuid(),
  restaurant_id uuid not null references public.restaurants(id) on delete cascade,
  category_id uuid references public.menu_categories(id) on delete set null,
  name text not null,
  name_ar text,
  description text,
  description_ar text,
  image_url text,
  price numeric(12,2) not null default 0 check (price >= 0),
  compare_at_price numeric(12,2),
  is_available boolean not null default true,
  is_featured boolean not null default false,
  sort_order integer not null default 0,
  allergens text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.product_options (
  id uuid primary key default gen_random_uuid(),
  restaurant_id uuid not null references public.restaurants(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete cascade,
  name text not null,
  is_required boolean not null default false,
  min_select integer not null default 0,
  max_select integer not null default 1,
  created_at timestamptz not null default now()
);

create table public.product_option_values (
  id uuid primary key default gen_random_uuid(),
  restaurant_id uuid not null references public.restaurants(id) on delete cascade,
  option_id uuid not null references public.product_options(id) on delete cascade,
  name text not null,
  price_delta numeric(12,2) not null default 0
);

create table public.restaurant_domains (
  id uuid primary key default gen_random_uuid(),
  restaurant_id uuid not null references public.restaurants(id) on delete cascade,
  hostname text not null unique,
  is_verified boolean not null default false,
  created_at timestamptz not null default now()
);

create table public.qr_codes (
  id uuid primary key default gen_random_uuid(),
  restaurant_id uuid not null references public.restaurants(id) on delete cascade,
  branch_id uuid references public.branches(id) on delete set null,
  label text not null,
  target_path text not null default '/',
  token text not null unique default encode(gen_random_bytes(16), 'hex'),
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.orders (
  id uuid primary key default gen_random_uuid(),
  restaurant_id uuid not null references public.restaurants(id) on delete cascade,
  branch_id uuid references public.branches(id) on delete set null,
  order_number bigserial,
  customer_name text,
  customer_phone text,
  order_type text not null default 'pickup',
  status public.order_status not null default 'pending',
  currency text not null default 'SAR',
  subtotal numeric(12,2) not null default 0,
  total numeric(12,2) not null default 0,
  notes text,
  created_at timestamptz not null default now()
);

create table public.order_items (
  id uuid primary key default gen_random_uuid(),
  restaurant_id uuid not null references public.restaurants(id) on delete cascade,
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid references public.products(id) on delete set null,
  product_name_snapshot text not null,
  quantity integer not null check (quantity > 0),
  unit_price numeric(12,2) not null,
  options_snapshot jsonb not null default '[]'
);

create index products_restaurant_category_idx on public.products(restaurant_id, category_id, sort_order);
create index categories_restaurant_sort_idx on public.menu_categories(restaurant_id, sort_order);
create index orders_restaurant_created_idx on public.orders(restaurant_id, created_at desc);
create index members_user_idx on public.restaurant_members(user_id);

-- Security helper: users can access a restaurant only if they are a member.
create or replace function public.is_restaurant_member(target_restaurant uuid)
returns boolean language sql stable security definer set search_path = public
as $$ select exists (
  select 1 from public.restaurant_members m
  where m.restaurant_id = target_restaurant and m.user_id = auth.uid()
); $$;

create or replace function public.is_platform_owner()
returns boolean language sql stable security definer set search_path = public
as $$ select exists (
  select 1 from public.profiles p
  where p.id = auth.uid() and p.platform_role = 'owner'
); $$;

alter table public.profiles enable row level security;
alter table public.restaurants enable row level security;
alter table public.restaurant_members enable row level security;
alter table public.branches enable row level security;
alter table public.menu_categories enable row level security;
alter table public.products enable row level security;
alter table public.product_options enable row level security;
alter table public.product_option_values enable row level security;
alter table public.restaurant_domains enable row level security;
alter table public.qr_codes enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;

create policy "profile self read" on public.profiles for select using (id = auth.uid() or public.is_platform_owner());
create policy "profile self update" on public.profiles for update using (id = auth.uid()) with check (id = auth.uid());

create policy "restaurant member read" on public.restaurants for select using (public.is_restaurant_member(id) or public.is_platform_owner() or is_published);
create policy "platform owner manages restaurants" on public.restaurants for all using (public.is_platform_owner()) with check (public.is_platform_owner());

create policy "members read own memberships" on public.restaurant_members for select using (user_id = auth.uid() or public.is_platform_owner());
create policy "owner manages memberships" on public.restaurant_members for all using (public.is_platform_owner()) with check (public.is_platform_owner());

-- Tenant tables: members may read; writes are restricted to restaurant admins/managers/editors.
do $$
declare t text;
begin
  foreach t in array array['branches','menu_categories','products','product_options','product_option_values','restaurant_domains','qr_codes'] loop
    execute format('create policy %I on public.%I for select using (public.is_restaurant_member(restaurant_id) or public.is_platform_owner())', t || '_tenant_read', t);
    execute format('create policy %I on public.%I for all using (public.is_platform_owner() or exists (select 1 from public.restaurant_members m where m.restaurant_id = %I.restaurant_id and m.user_id = auth.uid() and m.role in (''admin'',''manager'',''editor''))) with check (public.is_platform_owner() or exists (select 1 from public.restaurant_members m where m.restaurant_id = %I.restaurant_id and m.user_id = auth.uid() and m.role in (''admin'',''manager'',''editor'')))', t || '_tenant_write', t, t, t);
  end loop;
end $$;

create policy "orders tenant read" on public.orders for select using (public.is_restaurant_member(restaurant_id) or public.is_platform_owner());
create policy "orders tenant update" on public.orders for update using (public.is_restaurant_member(restaurant_id) or public.is_platform_owner()) with check (public.is_restaurant_member(restaurant_id) or public.is_platform_owner());
create policy "order items tenant read" on public.order_items for select using (public.is_restaurant_member(restaurant_id) or public.is_platform_owner());

-- Public menu reads are intentionally limited to published restaurants.
create policy "public categories for published restaurants" on public.menu_categories for select using (
  exists (select 1 from public.restaurants r where r.id = restaurant_id and r.is_published)
);
create policy "public products for published restaurants" on public.products for select using (
  exists (select 1 from public.restaurants r where r.id = restaurant_id and r.is_published)
);

-- IMPORTANT: public order creation should be implemented through a validated server endpoint
-- (or narrowly scoped RPC), never by exposing service-role credentials in the browser.

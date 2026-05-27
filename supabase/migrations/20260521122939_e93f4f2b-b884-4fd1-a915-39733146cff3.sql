
-- =========================
-- ROLES
-- =========================
create type public.app_role as enum ('admin', 'customer');

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  role app_role not null default 'customer',
  created_at timestamptz not null default now(),
  unique (user_id, role)
);

alter table public.user_roles enable row level security;

create or replace function public.has_role(_user_id uuid, _role app_role)
returns boolean
language sql stable security definer set search_path = public
as $$
  select exists (select 1 from public.user_roles where user_id = _user_id and role = _role)
$$;

create policy "Users view own roles" on public.user_roles
  for select using (auth.uid() = user_id or public.has_role(auth.uid(), 'admin'));
create policy "Admins manage roles" on public.user_roles
  for all using (public.has_role(auth.uid(), 'admin')) with check (public.has_role(auth.uid(), 'admin'));

-- =========================
-- PROFILES
-- =========================
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  avatar_url text,
  phone text,
  email text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Profiles viewable by owner or admin" on public.profiles
  for select using (auth.uid() = id or public.has_role(auth.uid(), 'admin'));
create policy "Users update own profile" on public.profiles
  for update using (auth.uid() = id);
create policy "Users insert own profile" on public.profiles
  for insert with check (auth.uid() = id);

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public
as $$
begin
  insert into public.profiles (id, display_name, email, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', split_part(new.email,'@',1)),
    new.email,
    new.raw_user_meta_data->>'avatar_url'
  ) on conflict (id) do nothing;

  insert into public.user_roles (user_id, role) values (new.id, 'customer')
  on conflict do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- =========================
-- PRODUCTS
-- =========================
create table public.products (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  tagline text,
  description text,
  price numeric(10,2) not null check (price >= 0),
  category text,
  stock integer not null default 0,
  image_url text,
  gallery jsonb default '[]'::jsonb,
  is_featured boolean default false,
  is_active boolean default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.products enable row level security;

create policy "Active products visible to all" on public.products
  for select using (is_active = true or public.has_role(auth.uid(), 'admin'));
create policy "Admins manage products" on public.products
  for all using (public.has_role(auth.uid(), 'admin')) with check (public.has_role(auth.uid(), 'admin'));

-- =========================
-- ORDERS
-- =========================
create type public.order_status as enum ('pending', 'paid', 'failed', 'canceled');
create type public.payment_method as enum ('mpesa', 'card', 'cash');

create table public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  product_id uuid references public.products(id) on delete set null,
  product_name text not null,
  quantity integer not null default 1 check (quantity > 0),
  unit_price numeric(10,2) not null,
  total numeric(10,2) not null,
  status order_status not null default 'pending',
  payment_method payment_method not null default 'mpesa',
  phone text,
  delivery_address text,
  notes text,
  mpesa_checkout_id text,
  mpesa_receipt text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.orders enable row level security;

create policy "Users view own orders" on public.orders
  for select using (auth.uid() = user_id or public.has_role(auth.uid(), 'admin'));
create policy "Users create own orders" on public.orders
  for insert with check (auth.uid() = user_id);
create policy "Admins update any order" on public.orders
  for update using (public.has_role(auth.uid(), 'admin') or auth.uid() = user_id);

-- =========================
-- M-PESA TRANSACTIONS
-- =========================
create type public.mpesa_status as enum ('pending', 'success', 'failed', 'canceled');

create table public.mpesa_transactions (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references public.orders(id) on delete cascade,
  checkout_request_id text unique,
  merchant_request_id text,
  phone text not null,
  amount numeric(10,2) not null,
  status mpesa_status not null default 'pending',
  mpesa_receipt text,
  result_code integer,
  result_desc text,
  raw_payload jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.mpesa_transactions enable row level security;

create policy "Users view own mpesa via orders" on public.mpesa_transactions
  for select using (
    public.has_role(auth.uid(), 'admin')
    or exists (select 1 from public.orders o where o.id = mpesa_transactions.order_id and o.user_id = auth.uid())
  );

-- =========================
-- NOTIFICATIONS
-- =========================
create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade, -- null = admin broadcast
  title text not null,
  body text,
  type text default 'info',
  read boolean default false,
  created_at timestamptz not null default now()
);

alter table public.notifications enable row level security;

create policy "Users view own + admin sees all" on public.notifications
  for select using (
    auth.uid() = user_id
    or (user_id is null and public.has_role(auth.uid(), 'admin'))
    or public.has_role(auth.uid(), 'admin')
  );
create policy "Users update own notif" on public.notifications
  for update using (auth.uid() = user_id or public.has_role(auth.uid(), 'admin'));
create policy "Admins create notif" on public.notifications
  for insert with check (public.has_role(auth.uid(), 'admin'));

-- =========================
-- NEWS
-- =========================
create table public.news (
  id uuid primary key default gen_random_uuid(),
  message text not null,
  link text,
  is_active boolean default true,
  created_at timestamptz not null default now()
);

alter table public.news enable row level security;
create policy "News public read" on public.news for select using (is_active = true or public.has_role(auth.uid(),'admin'));
create policy "Admins manage news" on public.news for all using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));

-- =========================
-- updated_at triggers
-- =========================
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end; $$;

create trigger trg_products_updated before update on public.products
  for each row execute function public.touch_updated_at();
create trigger trg_orders_updated before update on public.orders
  for each row execute function public.touch_updated_at();
create trigger trg_mpesa_updated before update on public.mpesa_transactions
  for each row execute function public.touch_updated_at();
create trigger trg_profiles_updated before update on public.profiles
  for each row execute function public.touch_updated_at();

-- =========================
-- STORAGE bucket for product images
-- =========================
insert into storage.buckets (id, name, public) values ('product-images', 'product-images', true)
on conflict (id) do nothing;

create policy "Product images public read" on storage.objects
  for select using (bucket_id = 'product-images');
create policy "Admins upload product images" on storage.objects
  for insert with check (bucket_id = 'product-images' and public.has_role(auth.uid(),'admin'));
create policy "Admins update product images" on storage.objects
  for update using (bucket_id = 'product-images' and public.has_role(auth.uid(),'admin'));
create policy "Admins delete product images" on storage.objects
  for delete using (bucket_id = 'product-images' and public.has_role(auth.uid(),'admin'));

-- Realtime for orders + notifications + mpesa
alter publication supabase_realtime add table public.orders;
alter publication supabase_realtime add table public.notifications;
alter publication supabase_realtime add table public.mpesa_transactions;

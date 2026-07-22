-- Tablas para tienda en línea Vital Life

create table if not exists categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique,
  description text,
  icon text,
  image text,
  sort_order int default 0,
  created_at timestamptz default now()
);

comment on table categories is 'Categorías de productos mostradas en el sitio';

insert into categories (name, slug, description, image, sort_order)
values
  ('Guantes', 'guantes', 'Guantes estériles y no estériles.', '/guantes.png', 10),
  ('Material de Curación', 'curacion', 'Todo lo necesario para el cuidado y curación de heridas.', '/material-curacion.png', 20),
  ('Vendas y Gasas', 'vendas', 'Vendas, gasas y apósitos.', '/material-curacion.png', 30),
  ('Jeringas', 'jeringas', 'Jeringas, agujas y sistemas de punción.', '/vias-iv.png', 40),
  ('Medicamentos', 'medicamentos', 'Soluciones y medicamentos.', '/diagnostico.png', 50),
  ('Equipo Médico', 'equipo', 'Equipo de diagnóstico y soporte.', '/diagnostico.png', 60)
on conflict (slug) do update set
  name = excluded.name,
  description = excluded.description,
  image = excluded.image,
  sort_order = excluded.sort_order;

create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  category text not null references categories(slug),
  price int not null default 0,
  description text not null default '',
  image text not null default '',
  in_stock boolean not null default true,
  featured boolean not null default false,
  sizes jsonb default null,
  quote_only boolean not null default false,
  created_at timestamptz default now()
);

comment on table products is 'Catálogo de productos de la tienda';

-- Índices útiles
create index if not exists products_category_idx on products(category);
create index if not exists products_featured_idx on products(featured);
create index if not exists products_in_stock_idx on products(in_stock);

create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  status text not null default 'pending',
  first_name text not null,
  last_name text not null,
  address text not null,
  colonia text not null,
  city text not null,
  cp text not null,
  phone text not null,
  subtotal int not null default 0,
  iva int not null default 0,
  total int not null default 0,
  created_at timestamptz default now()
);

comment on table orders is 'Pedidos realizados por los clientes';

create table if not exists order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders(id) on delete cascade,
  product_id uuid references products(id) on delete set null,
  name text not null,
  price int not null default 0,
  quantity int not null default 1,
  size text
);

comment on table order_items is 'Líneas de producto de cada pedido';

-- Políticas de seguridad (RLS)
alter table categories enable row level security;
alter table products enable row level security;
alter table orders enable row level security;
alter table order_items enable row level security;

-- Políticas públicas: lectura de catálogo, inserción de pedidos
-- Anon puede leer productos y categorías
create policy "Allow public read products" on products
  for select to anon using (true);

create policy "Allow public read categories" on categories
  for select to anon using (true);

-- Anon puede insertar pedidos (flujo de compra sin autenticación)
create policy "Allow public insert orders" on orders
  for insert to anon with check (true);

create policy "Allow public insert order items" on order_items
  for insert to anon with check (true);

-- Lectura de pedidos limitada por clave de acceso no se implementa aquí por simplicidad.
-- El service role puede leer/insertar todo.

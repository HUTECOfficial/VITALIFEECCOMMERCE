-- Guías de Envia.com generadas desde el CMS y configuración de envíos editable.
-- Requiere 011_order_shipping.sql.

alter table orders add column if not exists tracking_number text;
alter table orders add column if not exists tracking_url text;
alter table orders add column if not exists shipping_label_url text;
alter table orders add column if not exists shipping_label_cost numeric(10,2);
alter table orders add column if not exists shipping_label_created_at timestamptz;
alter table orders add column if not exists shipping_label_requested_at timestamptz;
alter table orders add column if not exists envia_shipment_id bigint;

comment on column orders.shipping_label_cost is 'Lo que Envia.com cobró por la guía (puede diferir de shipping_cost, que pagó el cliente)';
comment on column orders.shipping_label_requested_at is 'Bloqueo temporal para no generar dos guías del mismo pedido al mismo tiempo';

create index if not exists orders_created_at_idx on orders(created_at desc);

-- Una sola fila con la dirección de origen, paqueterías activas y caja estándar.
-- Solo el servidor (service role) la lee y escribe.
create table if not exists shipping_settings (
  id boolean primary key default true,
  settings jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  constraint shipping_settings_singleton check (id),
  constraint shipping_settings_object_check check (jsonb_typeof(settings) = 'object')
);

alter table shipping_settings enable row level security;

revoke all on shipping_settings from anon, authenticated;
grant all on shipping_settings to service_role;

create or replace function set_shipping_settings_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists shipping_settings_set_updated_at on shipping_settings;
create trigger shipping_settings_set_updated_at
before update on shipping_settings
for each row execute function set_shipping_settings_updated_at();

revoke all on function set_shipping_settings_updated_at() from public;

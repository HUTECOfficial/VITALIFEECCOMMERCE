-- Inventario por combinación de color y talla/medida.
-- Una fila sin color ni talla representa un producto sin opciones.
create table if not exists product_variants (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references products(id) on delete cascade,
  color text not null default '',
  size text not null default '',
  stock_quantity integer not null default 0 check (stock_quantity >= 0),
  created_at timestamptz not null default now(),
  unique (product_id, color, size)
);

create index if not exists product_variants_product_id_idx on product_variants(product_id);

-- Las variantes se administran con la credencial de servidor desde el CMS;
-- no se deben poder modificar directamente desde el navegador.
alter table product_variants enable row level security;

-- Conserva las existencias actuales como la variante sin opciones, por lo que
-- ningún producto pierde inventario al activar esta mejora.
insert into product_variants (product_id, color, size, stock_quantity)
select id, '', '', stock_quantity
from products
where not exists (
  select 1 from product_variants where product_variants.product_id = products.id
);

-- Guarda también la selección en el pedido para poder descontar exactamente la
-- combinación que el cliente pagó y mantener el historial legible.
alter table order_items add column if not exists color text;

create or replace function sync_product_stock_from_variants()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  affected_product_id uuid := coalesce(new.product_id, old.product_id);
  total_stock integer;
begin
  select coalesce(sum(stock_quantity), 0)
  into total_stock
  from product_variants
  where product_id = affected_product_id;

  update products
  set stock_quantity = total_stock, in_stock = total_stock > 0
  where id = affected_product_id;
  return coalesce(new, old);
end;
$$;

drop trigger if exists product_variants_sync_product_stock on product_variants;
create trigger product_variants_sync_product_stock
after insert or update or delete on product_variants
for each row execute function sync_product_stock_from_variants();

-- También cubre productos creados por importadores o scripts: comienzan con
-- una variante sin opciones que conserva su stock inicial.
create or replace function initialize_product_variant_inventory()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into product_variants (product_id, color, size, stock_quantity)
  values (new.id, '', '', new.stock_quantity)
  on conflict (product_id, color, size) do nothing;
  return new;
end;
$$;

drop trigger if exists products_initialize_variant_inventory on products;
create trigger products_initialize_variant_inventory
after insert on products
for each row execute function initialize_product_variant_inventory();

-- Sincroniza los totales ya existentes una vez creada la tabla.
update products as product
set
  stock_quantity = totals.stock_quantity,
  in_stock = totals.stock_quantity > 0
from (
  select product_id, coalesce(sum(stock_quantity), 0)::integer as stock_quantity
  from product_variants
  group by product_id
) as totals
where product.id = totals.product_id;

-- Reemplaza el descuento por producto por un descuento de la combinación
-- concreta de color/talla elegida durante el checkout.
create or replace function finalize_paid_order(
  p_order_id uuid,
  p_payment_intent text default null
)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  payment_completed boolean;
begin
  update orders
  set
    status = 'paid',
    stripe_payment_intent = p_payment_intent,
    paid_at = now()
  where id = p_order_id
    and status = 'pending'
  returning true into payment_completed;

  if not coalesce(payment_completed, false) then
    return false;
  end if;

  update product_variants as variant
  set stock_quantity = greatest(variant.stock_quantity - ordered.quantity, 0)
  from (
    select
      product_id,
      coalesce(color, '') as color,
      coalesce(size, '') as size,
      sum(quantity)::integer as quantity
    from order_items
    where order_id = p_order_id
      and product_id is not null
    group by product_id, coalesce(color, ''), coalesce(size, '')
  ) as ordered
  where variant.product_id = ordered.product_id
    and variant.color = ordered.color
    and variant.size = ordered.size;

  return true;
end;
$$;

revoke all on function finalize_paid_order(uuid, text) from public;
grant execute on function finalize_paid_order(uuid, text) to service_role;

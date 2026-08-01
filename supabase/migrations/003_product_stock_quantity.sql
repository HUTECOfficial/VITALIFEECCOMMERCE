-- Cantidad disponible para mostrar existencias reales en el catálogo.
alter table products
  add column if not exists stock_quantity integer;

alter table products
  alter column stock_quantity set default 0;

update products
set stock_quantity = case when in_stock then 1 else 0 end
where stock_quantity is null;

alter table products
  alter column stock_quantity set not null;

alter table products
  add constraint products_stock_quantity_nonnegative
  check (stock_quantity >= 0) not valid;

alter table products
  validate constraint products_stock_quantity_nonnegative;

create index if not exists products_stock_quantity_idx on products(stock_quantity);

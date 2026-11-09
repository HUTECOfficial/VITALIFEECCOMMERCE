-- Envío cotizado con Envia.com para cada pedido
alter table orders add column if not exists state text;
alter table orders add column if not exists shipping_carrier text;
alter table orders add column if not exists shipping_service text;
alter table orders add column if not exists shipping_description text;
alter table orders add column if not exists shipping_cost numeric(10,2) not null default 0;

comment on column orders.shipping_cost is 'Costo del envío cobrado al cliente (IVA incluido). total = subtotal + iva + shipping_cost';

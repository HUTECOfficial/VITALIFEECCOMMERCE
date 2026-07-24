-- Agregar columnas de Stripe a la tabla orders
alter table orders add column if not exists stripe_session_id text;
alter table orders add column if not exists stripe_payment_intent text;
alter table orders add column if not exists paid_at timestamptz;

-- Permitir centavos en totales (antes eran int, fallaban valores como 0.32 de IVA)
alter table orders alter column subtotal type numeric(10,2) using subtotal::numeric(10,2);
alter table orders alter column iva type numeric(10,2) using iva::numeric(10,2);
alter table orders alter column total type numeric(10,2) using total::numeric(10,2);
alter table order_items alter column price type numeric(10,2) using price::numeric(10,2);

-- Índice para buscar por session id
create index if not exists orders_stripe_session_idx on orders(stripe_session_id);

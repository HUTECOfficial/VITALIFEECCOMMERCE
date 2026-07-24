-- Agregar columnas de Stripe a la tabla orders
alter table orders add column if not exists stripe_session_id text;
alter table orders add column if not exists stripe_payment_intent text;
alter table orders add column if not exists paid_at timestamptz;

-- Índice para buscar por session id
create index if not exists orders_stripe_session_idx on orders(stripe_session_id);

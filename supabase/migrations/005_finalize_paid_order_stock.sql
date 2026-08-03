-- Descuenta inventario una sola vez al confirmar el pago en Stripe.
-- El webhook llama esta función con una credencial de servidor, no desde el navegador.
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

  update products as product
  set
    stock_quantity = greatest(product.stock_quantity - ordered.quantity, 0),
    in_stock = greatest(product.stock_quantity - ordered.quantity, 0) > 0
  from (
    select product_id, sum(quantity)::integer as quantity
    from order_items
    where order_id = p_order_id
      and product_id is not null
    group by product_id
  ) as ordered
  where product.id = ordered.product_id;

  return true;
end;
$$;

revoke all on function finalize_paid_order(uuid, text) from public;
grant execute on function finalize_paid_order(uuid, text) to service_role;

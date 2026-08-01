export const STRIPE_MINIMUM_ORDER_MXN = 10;

export function roundCurrency(value: number): number {
  return Math.round(value * 100) / 100;
}

export function calculateCheckoutTotals(subtotal: number) {
  const roundedSubtotal = roundCurrency(subtotal);
  const iva = roundCurrency(roundedSubtotal * 0.16);

  return {
    subtotal: roundedSubtotal,
    iva,
    total: roundCurrency(roundedSubtotal + iva),
  };
}

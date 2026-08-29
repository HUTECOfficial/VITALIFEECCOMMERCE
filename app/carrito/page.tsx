"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, Plus, Minus, ShoppingCart, ArrowRight } from "lucide-react";
import { useClientCart } from "@/store/cartStore";
import { formatPrice } from "@/lib/utils";
import { STRIPE_MINIMUM_ORDER_MXN, calculateCheckoutTotals } from "@/lib/checkout";
import FadeInWhenVisible from "@/components/animations/FadeInWhenVisible";
import { getQuoteWhatsAppUrl } from "@/lib/whatsapp";

export default function CarritoPage() {
  const { items, removeItem, updateQuantity, itemCount, clearCart, isReady } =
    useClientCart();
  const count = itemCount();
  const purchasableTotal = items.reduce(
    (sum, item) => sum + (item.quoteOnly ? 0 : item.price * item.quantity),
    0
  );
  const { subtotal, iva, total: totalFinal } = calculateCheckoutTotals(purchasableTotal);
  const meetsCheckoutMinimum = totalFinal >= STRIPE_MINIMUM_ORDER_MXN;
  const hasQuoteItems = items.some((item) => item.quoteOnly);

  if (!isReady) {
    return (
      <div className="min-h-screen pt-24 hero-gradient">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-8 bg-gray-200/50 rounded w-64 mb-8 animate-pulse" />
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {[1, 2, 3].map((n) => (
                <div key={n} className="white-card p-4 sm:p-5 flex gap-4 animate-pulse">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl bg-gray-200/50 shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200/50 rounded w-3/4" />
                    <div className="h-3 bg-gray-200/50 rounded w-1/2" />
                    <div className="h-3 bg-gray-200/50 rounded w-1/4" />
                  </div>
                </div>
              ))}
            </div>
            <div className="lg:col-span-1">
              <div className="white-card p-6 space-y-4 animate-pulse">
                <div className="h-5 bg-gray-200/50 rounded w-1/2" />
                <div className="h-3 bg-gray-200/50 rounded w-full" />
                <div className="h-3 bg-gray-200/50 rounded w-full" />
                <div className="h-10 bg-gray-200/50 rounded w-full" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (count === 0) {
    return (
      <div className="min-h-screen pt-24 hero-gradient flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="w-24 h-24 rounded-full bg-[#e8f4fd] flex items-center justify-center mx-auto mb-6">
            <ShoppingCart className="w-12 h-12 text-[#1a3a6b]/30" />
          </div>
          <h2 className="text-2xl font-bold text-[#1a3a6b] mb-3">
            Tu carrito está vacío
          </h2>
          <p className="text-gray-500 mb-8">
            Explora nuestro catálogo de insumos médicos y agrega los productos que necesitas.
          </p>
          <Link
            href="/insumos"
            className="inline-flex items-center gap-2 bg-[#1a3a6b] text-white px-6 py-3 rounded-full font-medium hover:bg-[#2eb8d4] transition-all hover:scale-105"
          >
            Ver productos
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-32 lg:pb-16 hero-gradient">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeInWhenVisible>
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-[#1a3a6b]">
              Carrito de compras
              <span className="ml-2 text-lg font-normal text-gray-400">
                ({count} artículo{count !== 1 ? "s" : ""})
              </span>
            </h1>
            <button
              onClick={clearCart}
              className="text-sm text-red-400 hover:text-red-600 transition-colors"
            >
              Vaciar carrito
            </button>
          </div>
        </FadeInWhenVisible>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Items list */}
          <div className="lg:col-span-2 space-y-4">
            <AnimatePresence>
              {items.map((item) => (
                <motion.div
                  key={item.cartId}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20, height: 0 }}
                  className="white-card p-4 sm:p-5 flex gap-4"
                >
                  <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-white shrink-0">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-contain p-1"
                      sizes="96px"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <Link
                          href={`/productos/${item.slug}`}
                          className="font-semibold text-[#1a3a6b] text-sm hover:text-[#2eb8d4] transition-colors line-clamp-2"
                        >
                          {item.name}
                        </Link>
                        {item.size && (
                          <p className="text-[10px] bg-[#1a3a6b] text-white px-1.5 py-0.5 rounded inline-block mt-0.5">
                            Talla: {item.size}
                          </p>
                        )}
                        {item.color && (
                          <p className="ml-1 text-[10px] bg-[#2eb8d4] text-white px-1.5 py-0.5 rounded inline-block mt-0.5">
                            Color: {item.color}
                          </p>
                        )}
                        <p className="text-[#2eb8d4] font-bold text-sm mt-0.5">
                          {item.quoteOnly ? "Precio por cotizar" : formatPrice(item.price)}
                        </p>
                      </div>
                      <button
                        onClick={() => removeItem(item.cartId)}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors shrink-0"
                        aria-label={`Eliminar ${item.name} del carrito`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(item.cartId, item.quantity - 1)}
                          className="w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center hover:border-[#2eb8d4] hover:text-[#2eb8d4] transition-colors"
                          aria-label="Reducir cantidad"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-8 text-center font-semibold text-[#1a3a6b] text-sm">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.cartId, item.quantity + 1)}
                          className="w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center hover:border-[#2eb8d4] hover:text-[#2eb8d4] transition-colors"
                          aria-label="Aumentar cantidad"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                      <span className="font-bold text-[#1a3a6b] text-sm">
                        {item.quoteOnly ? "Por cotizar" : formatPrice(item.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Order summary */}
          <div className="lg:col-span-1">
            <FadeInWhenVisible direction="right">
              <div className="white-card p-6 sticky top-24">
                <h2 className="font-bold text-[#1a3a6b] text-lg mb-5">
                  Resumen del pedido
                </h2>
                <div className="space-y-3 mb-5">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Subtotal</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>IVA (16%)</span>
                    <span>{formatPrice(iva)}</span>
                  </div>
                  <div className="h-px bg-gray-100" />
                  <div className="flex justify-between font-bold text-[#1a3a6b]">
                    <span>Total</span>
                    <span className="text-xl">{formatPrice(totalFinal)}</span>
                  </div>
                </div>
                {hasQuoteItems ? (
                  <p className="rounded-xl bg-[#e8f4fd] px-3 py-2 text-xs font-medium text-[#1a3a6b]">
                    Tu carrito incluye productos que requieren cotización. Envíanos la lista por WhatsApp y te responderemos con disponibilidad y precio.
                  </p>
                ) : meetsCheckoutMinimum ? (
                  <Link
                    href="/checkout"
                    className="w-full inline-flex items-center justify-center gap-2 bg-[#1a3a6b] text-white py-3 rounded-full font-medium hover:bg-[#2eb8d4] transition-all hover:scale-105 shadow-lg"
                  >
                    Proceder al pago
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                ) : (
                  <>
                    <p className="mb-3 rounded-xl bg-amber-50 px-3 py-2 text-xs font-medium text-amber-900">
                      Mínimo para pago con tarjeta: {formatPrice(STRIPE_MINIMUM_ORDER_MXN)}. Agrega {formatPrice(STRIPE_MINIMUM_ORDER_MXN - totalFinal)} más.
                    </p>
                    <span className="w-full inline-flex items-center justify-center gap-2 bg-gray-300 text-white py-3 rounded-full font-medium cursor-not-allowed">
                      Agrega productos para continuar
                    </span>
                  </>
                )}
                {hasQuoteItems && (
                  <a
                    href={getQuoteWhatsAppUrl(items)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 w-full inline-flex items-center justify-center gap-2 rounded-full bg-[#25D366] py-3 font-bold text-white transition-all hover:-translate-y-0.5 hover:bg-[#20bd5a]"
                  >
                    Cotizar carrito por WhatsApp
                  </a>
                )}
                <Link
                  href="/insumos"
                  className="mt-3 w-full inline-flex items-center justify-center gap-2 text-[#1a3a6b] text-sm hover:text-[#2eb8d4] transition-colors"
                >
                  Seguir comprando
                </Link>
              </div>
            </FadeInWhenVisible>
          </div>
        </div>

        {/* Mobile sticky checkout */}
        <div className="lg:hidden fixed bottom-0 inset-x-0 z-40 p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] bg-white/90 backdrop-blur-xl border-t border-[#1a3a6b]/10">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="text-[11px] uppercase tracking-wide font-bold text-[#1a3a6b]/55">Total</p>
              <p className="text-[#1a3a6b] font-black text-lg leading-none">{formatPrice(totalFinal)}</p>
            </div>
            {hasQuoteItems ? (
              <a
                href={getQuoteWhatsAppUrl(items)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-w-[170px] items-center justify-center gap-2 rounded-xl bg-[#25D366] px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-[#20bd5a]"
              >
                Cotizar por WhatsApp
              </a>
            ) : meetsCheckoutMinimum ? (
              <Link
                href="/checkout"
                className="inline-flex items-center justify-center gap-2 bg-[#1a3a6b] text-white px-5 py-3 rounded-xl font-bold text-sm min-w-[170px]"
              >
                Proceder al pago
                <ArrowRight className="w-4 h-4" />
              </Link>
            ) : (
              <span className="inline-flex items-center justify-center bg-gray-300 text-white px-5 py-3 rounded-xl font-bold text-sm min-w-[170px]">
                Mínimo {formatPrice(STRIPE_MINIMUM_ORDER_MXN)}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

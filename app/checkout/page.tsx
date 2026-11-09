"use client";

import { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CheckCircle2, ArrowLeft, Truck } from "lucide-react";
import Link from "next/link";
import { useClientCart } from "@/store/cartStore";
import { formatPrice } from "@/lib/utils";
import { STRIPE_MINIMUM_ORDER_MXN, calculateCheckoutTotals, roundCurrency } from "@/lib/checkout";
import type { ShippingOption } from "@/lib/envia";
import FadeInWhenVisible from "@/components/animations/FadeInWhenVisible";

const schema = z.object({
  firstName: z.string().min(2, "Requerido"),
  lastName: z.string().min(2, "Requerido"),
  address: z.string().min(5, "Ingresa una dirección válida"),
  colonia: z.string().min(2, "Requerido"),
  city: z.string().min(2, "Requerido"),
  cp: z.string().length(5, "El código postal debe tener 5 dígitos"),
  phone: z.string().min(10, "Teléfono inválido"),
});

type FormData = z.infer<typeof schema>;

interface ShippingQuote {
  key: string;
  options: ShippingOption[];
  error?: string;
}

function formatDeliveryDate(date: string | null) {
  if (!date) return "";
  const parsed = new Date(`${date}T12:00:00`);
  if (Number.isNaN(parsed.getTime())) return "";
  return parsed.toLocaleDateString("es-MX", { weekday: "short", day: "numeric", month: "short" });
}

export default function CheckoutPage() {
  const [redirecting, setRedirecting] = useState(false);
  const [checkoutError, setCheckoutError] = useState("");
  const { items, total, itemCount, isReady } = useClientCart();
  const count = itemCount();
  const { subtotal, iva, total: totalFinal } = calculateCheckoutTotals(total());
  const meetsCheckoutMinimum = totalFinal >= STRIPE_MINIMUM_ORDER_MXN;

  const {
    register,
    handleSubmit,
    control,
    getValues,
    setValue,
    getFieldState,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema), defaultValues: { city: "León" } });

  const [shippingQuote, setShippingQuote] = useState<ShippingQuote | null>(null);
  const [quoteNonce, setQuoteNonce] = useState(0);
  const [selectedShippingId, setSelectedShippingId] = useState("");
  const cp = useWatch({ control, name: "cp" }) ?? "";
  const cpIsValid = /^\d{5}$/.test(cp);
  const quoteKey = `${cp}#${quoteNonce}`;
  const currentQuote = cpIsValid && shippingQuote?.key === quoteKey ? shippingQuote : null;
  const quoteLoading = cpIsValid && !currentQuote;
  const selectedShipping = currentQuote?.options.find((option) => option.id === selectedShippingId) ?? null;
  const grandTotal = roundCurrency(totalFinal + (selectedShipping?.price ?? 0));

  useEffect(() => {
    if (!cpIsValid) return;
    const controller = new AbortController();
    const timer = setTimeout(async () => {
      try {
        const res = await fetch("/api/shipping/quote", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ cp: getValues("cp"), city: getValues("city"), colonia: getValues("colonia") }),
          signal: controller.signal,
        });
        const result = await res.json();
        if (!res.ok || !Array.isArray(result.options)) {
          setShippingQuote({ key: quoteKey, options: [], error: result.error || "No se pudo cotizar el envío." });
          return;
        }
        setShippingQuote({ key: quoteKey, options: result.options });
        setSelectedShippingId((current) =>
          result.options.some((option: ShippingOption) => option.id === current) ? current : result.options[0].id
        );
        if (result.location?.city && !getFieldState("city").isDirty) {
          setValue("city", result.location.city);
        }
      } catch {
        if (controller.signal.aborted) return;
        setShippingQuote({ key: quoteKey, options: [], error: "Error de conexión al cotizar el envío." });
      }
    }, 350);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [cpIsValid, quoteKey, getValues, setValue, getFieldState]);

  const onSubmit = async (data: FormData) => {
    if (!meetsCheckoutMinimum) {
      setCheckoutError(`Agrega ${formatPrice(STRIPE_MINIMUM_ORDER_MXN - totalFinal)} más para alcanzar el mínimo de compra de ${formatPrice(STRIPE_MINIMUM_ORDER_MXN)}.`);
      return;
    }
    if (!selectedShipping) {
      setCheckoutError("Elige una opción de envío para continuar.");
      return;
    }

    setCheckoutError("");
    setRedirecting(true);
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: data.firstName,
          lastName: data.lastName,
          address: data.address,
          colonia: data.colonia,
          city: data.city,
          cp: data.cp,
          phone: data.phone,
          shippingOptionId: selectedShipping.id,
          items: items.map((item) => ({
            productId: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            size: item.size,
            color: item.color,
          })),
        }),
      });

      const result = await res.json();
      if (!res.ok || !result.url) {
        const msg = result.error || 'No se pudo iniciar el pago. Intenta de nuevo.';
        setCheckoutError(result.details ? `${msg} ${result.details}` : msg);
        setRedirecting(false);
        if (res.status === 409) setQuoteNonce((n) => n + 1);
        return;
      }

      window.location.assign(result.url);
    } catch {
      alert('Error de conexión. Intenta de nuevo.');
      setRedirecting(false);
    }
  };

  if (!isReady) {
    return (
      <div className="min-h-screen pt-24 pb-16 hero-gradient">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-5 bg-gray-200/50 rounded w-48 mb-8 animate-pulse" />
          <div className="h-8 bg-gray-200/50 rounded w-64 mb-8 animate-pulse" />
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              <div className="white-card p-6 sm:p-8 space-y-4 animate-pulse">
                <div className="grid sm:grid-cols-2 gap-5">
                  <div className="h-10 bg-gray-200/50 rounded" />
                  <div className="h-10 bg-gray-200/50 rounded" />
                </div>
                <div className="h-10 bg-gray-200/50 rounded" />
                <div className="grid sm:grid-cols-2 gap-5">
                  <div className="h-10 bg-gray-200/50 rounded" />
                  <div className="h-10 bg-gray-200/50 rounded" />
                </div>
                <div className="h-10 bg-gray-200/50 rounded" />
                <div className="h-10 bg-gray-200/50 rounded" />
              </div>
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
        <div className="text-center">
          <h2 className="text-2xl font-bold text-[#1a3a6b] mb-4">
            No hay productos en el carrito
          </h2>
          <Link
            href="/insumos"
            className="inline-flex items-center gap-2 bg-[#1a3a6b] text-white px-6 py-3 rounded-full font-medium hover:bg-[#2eb8d4] transition-all"
          >
            Ver productos
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16 hero-gradient">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeInWhenVisible>
          <div className="flex items-center gap-3 mb-8">
            <Link
              href="/carrito"
              className="inline-flex items-center gap-2 text-[#1a3a6b] text-sm font-medium hover:text-[#2eb8d4] transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Volver al carrito
            </Link>
          </div>
          <h1 className="text-3xl font-bold text-[#1a3a6b] mb-8">
            Datos de envío
          </h1>
        </FadeInWhenVisible>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2">
            <FadeInWhenVisible direction="left">
              <div className="white-card p-6 sm:p-8">
                <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nombre *
                      </label>
                      <input
                        type="text"
                        {...register("firstName")}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-sm outline-none focus:ring-2 focus:ring-[#2eb8d4] focus:border-transparent transition"
                        placeholder="Carlos"
                      />
                      {errors.firstName && (
                        <p className="text-red-500 text-xs mt-1">{errors.firstName.message}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Apellido *
                      </label>
                      <input
                        type="text"
                        {...register("lastName")}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-sm outline-none focus:ring-2 focus:ring-[#2eb8d4] focus:border-transparent transition"
                        placeholder="García"
                      />
                      {errors.lastName && (
                        <p className="text-red-500 text-xs mt-1">{errors.lastName.message}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Dirección *
                    </label>
                    <input
                      type="text"
                      {...register("address")}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-sm outline-none focus:ring-2 focus:ring-[#2eb8d4] focus:border-transparent transition"
                      placeholder="Av. Torres Landa 1234, Int. 5"
                    />
                    {errors.address && (
                      <p className="text-red-500 text-xs mt-1">{errors.address.message}</p>
                    )}
                  </div>

                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Colonia *
                      </label>
                      <input
                        type="text"
                        {...register("colonia")}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-sm outline-none focus:ring-2 focus:ring-[#2eb8d4] focus:border-transparent transition"
                        placeholder="Jardines del Moral"
                      />
                      {errors.colonia && (
                        <p className="text-red-500 text-xs mt-1">{errors.colonia.message}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Ciudad *
                      </label>
                      <input
                        type="text"
                        {...register("city")}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-sm outline-none focus:ring-2 focus:ring-[#2eb8d4] focus:border-transparent transition"
                        placeholder="León"
                      />
                      {errors.city && (
                        <p className="text-red-500 text-xs mt-1">{errors.city.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Código Postal *
                      </label>
                      <input
                        type="text"
                        {...register("cp")}
                        maxLength={5}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-sm outline-none focus:ring-2 focus:ring-[#2eb8d4] focus:border-transparent transition"
                        placeholder="37000"
                      />
                      {errors.cp && (
                        <p className="text-red-500 text-xs mt-1">{errors.cp.message}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Teléfono *
                      </label>
                      <input
                        type="tel"
                        {...register("phone")}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-sm outline-none focus:ring-2 focus:ring-[#2eb8d4] focus:border-transparent transition"
                        placeholder="477 000 0000"
                      />
                      {errors.phone && (
                        <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <p className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                      <Truck className="w-4 h-4 text-[#2eb8d4]" />
                      Opciones de envío *
                    </p>
                    {!cpIsValid ? (
                      <p className="p-4 rounded-xl border border-dashed border-gray-200 text-sm text-gray-500">
                        Escribe tu código postal para ver paqueterías, precios y tiempos de entrega.
                      </p>
                    ) : quoteLoading ? (
                      <div className="space-y-2" aria-busy="true">
                        <p className="text-sm text-gray-500">Cotizando envío…</p>
                        {[0, 1, 2].map((i) => (
                          <div key={i} className="h-16 rounded-xl bg-gray-200/50 animate-pulse" />
                        ))}
                      </div>
                    ) : currentQuote?.error ? (
                      <div role="alert" className="p-4 rounded-xl border border-red-200 bg-red-50 text-sm text-red-700">
                        {currentQuote.error}{" "}
                        <button type="button" onClick={() => setQuoteNonce((n) => n + 1)} className="font-semibold underline">
                          Reintentar
                        </button>
                      </div>
                    ) : (
                      <div role="radiogroup" aria-label="Opciones de envío" className="space-y-2">
                        {currentQuote?.options.map((option) => {
                          const checked = option.id === selectedShippingId;
                          const date = formatDeliveryDate(option.deliveryDate);
                          return (
                            <label
                              key={option.id}
                              className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition ${checked ? "border-[#2eb8d4] bg-[#e8f4fd] ring-1 ring-[#2eb8d4]" : "border-gray-200 bg-white hover:border-[#2eb8d4]/50"}`}
                            >
                              <input
                                type="radio"
                                name="shippingOption"
                                value={option.id}
                                checked={checked}
                                onChange={() => setSelectedShippingId(option.id)}
                                className="accent-[#1a3a6b] w-4 h-4 shrink-0"
                              />
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-[#1a3a6b]">{option.serviceName}</p>
                                <p className="text-xs text-gray-500">
                                  {option.deliveryEstimate}
                                  {date && ` · llega aprox. ${date}`}
                                </p>
                              </div>
                              <span className="font-bold text-[#1a3a6b] text-sm shrink-0">{formatPrice(option.price)}</span>
                            </label>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  <div className="pt-2 p-4 bg-[#e8f4fd] border border-[#2eb8d4]/20 rounded-xl text-sm text-[#1a3a6b]/70">
                    <strong>Pago seguro:</strong> Serás redirigido a Stripe para completar tu pago de forma segura.
                  </div>

                  {!meetsCheckoutMinimum && (
                    <div role="alert" className="p-4 rounded-xl border border-amber-200 bg-amber-50 text-sm text-amber-900">
                      El pago con tarjeta requiere un mínimo de {formatPrice(STRIPE_MINIMUM_ORDER_MXN)}. Agrega {formatPrice(STRIPE_MINIMUM_ORDER_MXN - totalFinal)} más al carrito.
                    </div>
                  )}
                  {checkoutError && (
                    <div role="alert" className="p-4 rounded-xl border border-red-200 bg-red-50 text-sm text-red-700">
                      {checkoutError}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmitting || redirecting || !meetsCheckoutMinimum || !selectedShipping}
                    className="w-full inline-flex items-center justify-center gap-2 bg-[#1a3a6b] text-white py-4 rounded-full font-semibold text-base hover:bg-[#2eb8d4] transition-all hover:scale-105 disabled:opacity-60 shadow-lg"
                  >
                    {isSubmitting || redirecting ? (
                      <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <CheckCircle2 className="w-5 h-5" />
                    )}
                    {isSubmitting || redirecting ? "Redirigiendo a Stripe..." : !meetsCheckoutMinimum ? "Agrega productos para continuar" : !selectedShipping ? "Elige tu envío para continuar" : "Pagar con Stripe"}
                  </button>
                </form>
              </div>
            </FadeInWhenVisible>
          </div>

          {/* Order summary */}
          <div>
            <FadeInWhenVisible direction="right">
              <div className="white-card p-6 sticky top-24">
                <h2 className="font-bold text-[#1a3a6b] text-lg mb-2">
                  Resumen del pedido
                </h2>
                <p className="text-gray-500 text-sm mb-4">
                  {count} artículo{count !== 1 ? "s" : ""} en el carrito
                </p>

                {/* Desglose de productos */}
                <div className="bg-[#f8fbff] rounded-xl p-4 mb-5">
                  <h3 className="text-xs font-bold text-[#1a3a6b] uppercase tracking-wider mb-3">
                    Productos
                  </h3>
                  <div className="space-y-4">
                    {items.map((item) => (
                      <div key={item.cartId} className="border-b border-gray-200 pb-3 last:border-0 last:pb-0">
                        <div className="flex justify-between text-sm">
                          <div className="flex-1 min-w-0 mr-3">
                            <p className="text-gray-700 font-medium">{item.name} {[item.color && `Color: ${item.color}`, item.size && `Presentación: ${item.size}`].filter(Boolean).length ? `(${[item.color && `Color: ${item.color}`, item.size && `Presentación: ${item.size}`].filter(Boolean).join(" · ")})` : ""}</p>
                            <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-gray-500">
                              <span>Cant: {item.quantity}</span>
                              <span>·</span>
                              <span>{formatPrice(item.price)} c/u</span>
                              {item.size && (
                                <>
                                  <span>·</span>
                                  <span className="text-[#1a3a6b] font-medium">{item.size}</span>
                                </>
                              )}
                              {item.color && (
                                <div className="flex justify-between text-xs">
                                  <span className="text-gray-500">Color</span>
                                  <span className="text-[#1a3a6b] font-medium">{item.color}</span>
                                </div>
                              )}
                            </div>
                          </div>
                          <span className="font-bold text-[#1a3a6b] shrink-0 text-sm">
                            {formatPrice(item.price * item.quantity)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="border-t border-gray-100 pt-4 space-y-2">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Subtotal</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>IVA (16%)</span>
                    <span>{formatPrice(iva)}</span>
                  </div>
                  <div className="flex justify-between gap-3 text-sm text-gray-600">
                    <span>Envío</span>
                    <span className="text-right">{selectedShipping ? formatPrice(selectedShipping.price) : quoteLoading ? "Cotizando…" : "Ingresa tu C.P."}</span>
                  </div>
                  <div className="flex justify-between font-bold text-[#1a3a6b] pt-1">
                    <span>Total</span>
                    <span className="text-xl">{formatPrice(grandTotal)}</span>
                  </div>
                </div>
              </div>
            </FadeInWhenVisible>
          </div>
        </div>
      </div>
    </div>
  );
}

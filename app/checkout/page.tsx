"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useClientCart } from "@/store/cartStore";
import { formatPrice } from "@/lib/utils";
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

export default function CheckoutPage() {
  const [redirecting, setRedirecting] = useState(false);
  const { items, total, itemCount, clearCart, isReady } = useClientCart();
  const count = itemCount();
  const subtotal = Math.round(total() * 100) / 100;
  const iva = Math.round(subtotal * 0.16 * 100) / 100;
  const totalFinal = Math.round((subtotal + iva) * 100) / 100;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
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
          subtotal,
          iva,
          total: totalFinal,
          items: items.map((item) => ({
            productId: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            size: item.size,
          })),
        }),
      });

      const result = await res.json();
      if (!res.ok || !result.url) {
        const msg = result.error || 'No se pudo iniciar el pago. Intenta de nuevo.';
        alert(result.details ? `${msg}\n${result.details}` : msg);
        setRedirecting(false);
        return;
      }

      clearCart();
      window.location.href = result.url;
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
                        defaultValue="León"
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

                  <div className="pt-2 p-4 bg-[#e8f4fd] border border-[#2eb8d4]/20 rounded-xl text-sm text-[#1a3a6b]/70">
                    <strong>Pago seguro:</strong> Serás redirigido a Stripe para completar tu pago de forma segura.
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting || redirecting}
                    className="w-full inline-flex items-center justify-center gap-2 bg-[#1a3a6b] text-white py-4 rounded-full font-semibold text-base hover:bg-[#2eb8d4] transition-all hover:scale-105 disabled:opacity-60 shadow-lg"
                  >
                    {isSubmitting || redirecting ? (
                      <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <CheckCircle2 className="w-5 h-5" />
                    )}
                    {isSubmitting || redirecting ? "Redirigiendo a Stripe..." : "Pagar con Stripe"}
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
                            <p className="text-gray-700 font-medium">{item.name} {item.size ? `(${item.size})` : ""}</p>
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
                  <div className="flex justify-between font-bold text-[#1a3a6b] pt-1">
                    <span>Total</span>
                    <span className="text-xl">{formatPrice(totalFinal)}</span>
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

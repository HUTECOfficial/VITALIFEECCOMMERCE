"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { XCircle, ShoppingCart } from "lucide-react";
import { Suspense } from "react";

function CancelledContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("order");

  return (
    <div className="min-h-screen pt-24 hero-gradient flex items-center justify-center">
      <div className="text-center max-w-md mx-auto px-4">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
          className="w-24 h-24 rounded-full bg-red-50 border-4 border-red-200 flex items-center justify-center mx-auto mb-6"
        >
          <XCircle className="w-12 h-12 text-red-400" />
        </motion.div>
        <h2 className="text-2xl font-bold text-[#1a3a6b] mb-3">
          Pago cancelado
        </h2>
        <p className="text-gray-500 mb-2">
          El pago fue cancelado. Tu carrito sigue intacto y puedes intentarlo
          nuevamente cuando estés listo.
        </p>
        {orderId && (
          <p className="text-[#1a3a6b]/50 text-sm mb-8">
            Pedido: {orderId.slice(0, 8)}
          </p>
        )}
        <Link
          href="/carrito"
          className="inline-flex items-center gap-2 bg-[#1a3a6b] text-white px-6 py-3 rounded-full font-medium hover:bg-[#2eb8d4] transition-all"
        >
          <ShoppingCart className="w-4 h-4" />
          Volver al carrito
        </Link>
      </div>
    </div>
  );
}

export default function CancelledPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white" />}>
      <CancelledContent />
    </Suspense>
  );
}

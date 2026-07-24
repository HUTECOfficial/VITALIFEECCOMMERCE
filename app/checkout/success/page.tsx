"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { CheckCircle2, ShoppingBag } from "lucide-react";
import { Suspense } from "react";

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("order");

  return (
    <div className="min-h-screen pt-24 hero-gradient flex items-center justify-center">
      <div className="text-center max-w-md mx-auto px-4">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
          className="w-24 h-24 rounded-full bg-green-50 border-4 border-green-200 flex items-center justify-center mx-auto mb-6"
        >
          <CheckCircle2 className="w-12 h-12 text-green-500" />
        </motion.div>
        <h2 className="text-2xl font-bold text-[#1a3a6b] mb-3">
          ¡Pago completado!
        </h2>
        <p className="text-gray-500 mb-2">
          Tu pago fue procesado exitosamente. Recibirás una confirmación por correo
          y nos comunicaremos contigo para coordinar la entrega.
        </p>
        {orderId && (
          <p className="text-[#1a3a6b] font-bold mb-8">
            Pedido: {orderId.slice(0, 8)}
          </p>
        )}
        <Link
          href="/insumos"
          className="inline-flex items-center gap-2 bg-[#1a3a6b] text-white px-6 py-3 rounded-full font-medium hover:bg-[#2eb8d4] transition-all"
        >
          <ShoppingBag className="w-4 h-4" />
          Seguir comprando
        </Link>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white" />}>
      <SuccessContent />
    </Suspense>
  );
}

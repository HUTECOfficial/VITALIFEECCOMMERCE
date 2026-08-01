import { Boxes, CheckCircle2, Clock3 } from "lucide-react";
import { cn } from "@/lib/utils";

interface StockIndicatorProps {
  quantity?: number;
  inStock: boolean;
  compact?: boolean;
}

export function StockIndicator({ quantity, inStock, compact = false }: StockIndicatorProps) {
  const hasExactQuantity = typeof quantity === "number";
  const available = hasExactQuantity ? quantity > 0 : inStock;
  const lowStock = hasExactQuantity && quantity > 0 && quantity <= 5;
  const label = !available
    ? "Agotado"
    : hasExactQuantity
      ? `${quantity} ${quantity === 1 ? "unidad" : "unidades"} disponibles`
      : "Disponible";

  if (compact) {
    return (
      <span
        className={cn(
          "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-bold",
          !available
            ? "border-rose-100 bg-rose-50 text-rose-700"
            : lowStock
              ? "border-amber-100 bg-amber-50 text-amber-700"
              : "border-emerald-100 bg-emerald-50 text-emerald-700"
        )}
      >
        <span className={cn("h-1.5 w-1.5 rounded-full", !available ? "bg-rose-500" : lowStock ? "bg-amber-500 animate-pulse" : "bg-emerald-500")} />
        {label}
      </span>
    );
  }

  if (!available) {
    return (
      <div className="inline-flex items-center gap-3 rounded-2xl border border-rose-100 bg-rose-50 px-4 py-3 text-rose-700">
        <Clock3 className="h-5 w-5" />
        <div>
          <p className="text-xs font-bold uppercase tracking-wide">Inventario</p>
          <p className="font-black">Agotado por ahora</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border px-4 py-3 shadow-sm",
        lowStock ? "border-amber-200 bg-amber-50" : "border-emerald-100 bg-emerald-50"
      )}
    >
      <div className={cn("absolute inset-y-0 left-0 w-1", lowStock ? "bg-amber-400" : "bg-emerald-400")} />
      <div className="flex items-center gap-3">
        <div className={cn("flex h-10 w-10 items-center justify-center rounded-xl", lowStock ? "bg-amber-100 text-amber-700" : "bg-white text-emerald-600")}>
          <Boxes className="h-5 w-5" />
        </div>
        <div className="leading-tight">
          <p className={cn("text-[10px] font-black uppercase tracking-[0.16em]", lowStock ? "text-amber-700" : "text-emerald-700")}>Inventario disponible</p>
          {hasExactQuantity ? (
            <p className={cn("text-xl font-black", lowStock ? "text-amber-900" : "text-emerald-900")}>
              {quantity} <span className="text-sm font-bold">{quantity === 1 ? "unidad" : "unidades"}</span>
            </p>
          ) : (
            <p className="text-sm font-bold text-emerald-800">Listo para envío</p>
          )}
        </div>
        {!lowStock && <CheckCircle2 className="ml-auto h-5 w-5 text-emerald-500" />}
      </div>
      {lowStock && <p className="mt-2 text-xs font-semibold text-amber-800">Últimas piezas disponibles</p>}
    </div>
  );
}

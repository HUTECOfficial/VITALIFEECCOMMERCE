import Link from "next/link";
import type { Product } from "@/types";
import { getProductNameParts } from "@/lib/product-name";

export function ProductCatalogSummary({ product, showBrand = false }: { product: Product; showBrand?: boolean }) {
  const productName = getProductNameParts(product.name, product.brand);
  const brand = product.brand || productName.brand;
  const details = [...productName.details];

  if (product.presentation && !details.some((detail) => detail.value.toLocaleLowerCase("es-MX") === product.presentation?.toLocaleLowerCase("es-MX"))) {
    details.unshift({ label: "Presentación", value: product.presentation });
  }

  return (
    <>
      <Link href={`/productos/${product.slug}`}>
        <h3 className="text-base font-black leading-tight text-[#1a3a6b] transition-colors hover:text-[#2eb8d4]">
          {productName.title}
        </h3>
      </Link>
      {showBrand && brand && <p className="mt-1 text-[10px] font-black uppercase tracking-wide text-[#1a3a6b]/50">{brand}</p>}
      {details.length > 0 && (
        <dl className="mb-2 mt-2 flex flex-wrap gap-1.5">
          {details.slice(0, 2).map((detail, index) => (
            <div key={`${detail.label}-${detail.value}-${index}`} className="rounded-lg bg-[#e8f4fd] px-2 py-1 text-[10px] leading-tight text-[#1a3a6b]">
              <dt className="inline font-black uppercase tracking-wide text-[#2eb8d4]">{detail.label}: </dt>
              <dd className="inline font-bold">{detail.value}</dd>
            </div>
          ))}
        </dl>
      )}
    </>
  );
}

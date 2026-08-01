"use client";

import { useState } from "react";
import Image from "next/image";
import { ZoomIn } from "lucide-react";

interface ProductImageZoomProps {
  src: string;
  images?: string[];
  alt: string;
}

export function ProductImageZoom({ src, images = [], alt }: ProductImageZoomProps) {
  const [isZoomed, setIsZoomed] = useState(false);
  const [transformOrigin, setTransformOrigin] = useState("50% 50%");
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const gallery = [src, ...images.filter((image) => image !== src)];
  const activeImage = gallery[activeImageIndex] ?? src;

  function updateZoomOrigin(event: React.PointerEvent<HTMLButtonElement>) {
    if (event.pointerType !== "mouse") return;

    const bounds = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - bounds.left) / bounds.width) * 100;
    const y = ((event.clientY - bounds.top) / bounds.height) * 100;

    setTransformOrigin(`${x}% ${y}%`);
    setIsZoomed(true);
  }

  return (
    <div className="space-y-3">
    <button
      type="button"
      onPointerMove={updateZoomOrigin}
      onPointerLeave={(event) => {
        if (event.pointerType === "mouse") setIsZoomed(false);
      }}
      onPointerUp={(event) => {
        if (event.pointerType === "touch") setIsZoomed((zoomed) => !zoomed);
      }}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          setIsZoomed((zoomed) => !zoomed);
        }
      }}
      aria-label={`Ampliar imagen ${activeImageIndex + 1} de ${alt}`}
      aria-pressed={isZoomed}
      className="group relative h-80 w-full overflow-hidden rounded-3xl bg-white text-left shadow-lg outline-none focus-visible:ring-4 focus-visible:ring-[#2eb8d4]/50 md:h-96"
    >
      <Image
        src={activeImage}
        alt={alt}
        fill
        className={`object-contain p-4 ${isZoomed ? "scale-[1.85]" : "scale-100"} transition-transform duration-200 ease-out`}
        style={{ transformOrigin }}
        sizes="(max-width: 768px) 100vw, 50vw"
        priority
      />
      <span className="pointer-events-none absolute bottom-4 right-4 inline-flex items-center gap-2 rounded-full bg-[#1a3a6b]/90 px-3 py-2 text-xs font-bold text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
        <ZoomIn className="h-4 w-4" />
        {isZoomed ? "Alejar" : "Ampliar"}
      </span>
      <span className="sr-only">En computadora, mueve el cursor para acercar la imagen. En móvil, toca para ampliar.</span>
    </button>
    {gallery.length > 1 && (
      <div className="flex items-center justify-center gap-3" aria-label="Galería de imágenes del producto">
        {gallery.map((image, index) => (
          <button
            key={image}
            type="button"
            onClick={() => {
              setActiveImageIndex(index);
              setIsZoomed(false);
              setTransformOrigin("50% 50%");
            }}
            className={`relative h-16 w-16 overflow-hidden rounded-xl border-2 bg-white transition-all ${
              activeImageIndex === index
                ? "border-[#2eb8d4] ring-2 ring-[#2eb8d4]/20"
                : "border-[#1a3a6b]/10 hover:border-[#2eb8d4]/60"
            }`}
            aria-label={`Ver foto ${index + 1} de ${alt}`}
            aria-pressed={activeImageIndex === index}
          >
            <Image src={image} alt="" fill className="object-contain p-1" sizes="64px" />
          </button>
        ))}
      </div>
    )}
    </div>
  );
}

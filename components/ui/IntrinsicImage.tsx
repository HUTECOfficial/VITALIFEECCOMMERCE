"use client";

import Image from "next/image";
import { useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type IntrinsicImageProps = {
  src: string;
  alt: string;
  sizes: string;
  className?: string;
  wrapperClassName?: string;
  fallbackAspectRatio?: number;
  fixedAspectRatio?: number;
  priority?: boolean;
  children?: ReactNode;
};

export default function IntrinsicImage({
  src,
  alt,
  sizes,
  className,
  wrapperClassName,
  fallbackAspectRatio = 16 / 9,
  fixedAspectRatio,
  priority,
  children,
}: IntrinsicImageProps) {
  const [aspectRatio, setAspectRatio] = useState(fallbackAspectRatio);

  return (
    <div
      className={cn("relative w-full overflow-hidden", wrapperClassName)}
      style={{ aspectRatio: fixedAspectRatio ?? aspectRatio }}
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        className={cn("object-cover", className)}
        onLoad={(event) => {
          if (fixedAspectRatio) return;
          const { naturalWidth, naturalHeight } = event.currentTarget;
          if (naturalWidth && naturalHeight) {
            const nextAspectRatio = naturalWidth / naturalHeight;
            setAspectRatio((current) => current === nextAspectRatio ? current : nextAspectRatio);
          }
        }}
      />
      {children}
    </div>
  );
}

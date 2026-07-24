import { generateLogoImage } from "@/lib/og-image";

export const alt = "Vital Life Insumos Médicos";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function TwitterImage() {
  return generateLogoImage(size.width, size.height);
}

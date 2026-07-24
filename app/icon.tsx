import { generateLogoImage } from "@/lib/og-image";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return generateLogoImage(size.width, size.height);
}

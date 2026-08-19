import { generateFaviconImage } from "@/lib/og-image";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return generateFaviconImage(size.width, size.height);
}

import { ImageResponse } from "next/og";
import { readFileSync } from "fs";
import { join } from "path";

export function generateLogoImage(width: number, height: number) {
  const dataUrl = getLogoDataUrl();

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#ffffff",
        }}
      >
        <img
          src={dataUrl}
          alt="Vital Life"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center",
          }}
        />
      </div>
    ),
    { width, height }
  );
}

export function generateFaviconImage(width: number, height: number) {
  const dataUrl = getLogoDataUrl();

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
          background: "#ffffff",
        }}
      >
        <img
          src={dataUrl}
          alt="Vital Life"
          style={{
            width: "350%",
            height: "350%",
            flexShrink: 0,
            objectFit: "contain",
            transform: "translateY(5%)",
          }}
        />
      </div>
    ),
    { width, height }
  );
}

function getLogoDataUrl() {
  const logo = readFileSync(join(process.cwd(), "public", "vitalife-logo.png"));
  return `data:image/png;base64,${logo.toString("base64")}`;
}

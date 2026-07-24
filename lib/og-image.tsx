import { ImageResponse } from "next/og";
import { readFileSync } from "fs";
import { join } from "path";

export function generateLogoImage(width: number, height: number) {
  const logo = readFileSync(join(process.cwd(), "public", "vitalife-logo.png"));
  const base64 = logo.toString("base64");
  const dataUrl = `data:image/png;base64,${base64}`;

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

import { ImageResponse } from "next/og";

export const alt = "Vital Life Insumos Médicos";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #1a3a6b 0%, #2eb8d4 100%)",
          color: "white",
          padding: "80px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 160,
            height: 160,
            background: "rgba(255,255,255,0.15)",
            borderRadius: 32,
            marginBottom: 40,
          }}
        >
          <span
            style={{
              fontSize: 90,
              fontWeight: 900,
              fontFamily: "Inter, sans-serif",
              letterSpacing: "-3px",
            }}
          >
            VL
          </span>
        </div>
        <div
          style={{
            fontSize: 72,
            fontWeight: 900,
            fontFamily: "Inter, sans-serif",
            marginBottom: 16,
            textAlign: "center",
          }}
        >
          Vital Life
        </div>
        <div
          style={{
            fontSize: 36,
            fontFamily: "Inter, sans-serif",
            opacity: 0.95,
            textAlign: "center",
          }}
        >
          Insumos Médicos · León, Guanajuato
        </div>
      </div>
    ),
    { ...size }
  );
}

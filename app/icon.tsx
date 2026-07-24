import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #1a3a6b 0%, #2eb8d4 100%)",
          borderRadius: "6px",
        }}
      >
        <span
          style={{
            fontSize: 20,
            color: "white",
            fontWeight: 900,
            fontFamily: "Inter, sans-serif",
            letterSpacing: "-1px",
          }}
        >
          VL
        </span>
      </div>
    ),
    { ...size }
  );
}

import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
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
          borderRadius: "32px",
        }}
      >
        <span
          style={{
            fontSize: 100,
            color: "white",
            fontWeight: 900,
            fontFamily: "Inter, sans-serif",
            letterSpacing: "-4px",
          }}
        >
          VL
        </span>
      </div>
    ),
    { ...size }
  );
}

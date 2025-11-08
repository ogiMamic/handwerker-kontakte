import { ImageResponse } from "next/og"

export const runtime = "edge"
export const alt = "Handwerker Kontakte - Finden Sie den richtigen Handwerker"
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = "image/png"

export default async function OgImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #F97316 0%, #EA580C 100%)",
        padding: "60px",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "24px",
          marginBottom: "40px",
        }}
      >
        <div
          style={{
            width: "120px",
            height: "120px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "white",
            borderRadius: "24px",
            boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
          }}
        >
          <svg width="80" height="80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M13.75 2L10.25 2C10.1119 2 10 2.11193 10 2.25V6.25C10 6.38807 10.1119 6.5 10.25 6.5H13.75C13.8881 6.5 14 6.38807 14 6.25V2.25C14 2.11193 13.8881 2 13.75 2Z"
              fill="#F97316"
            />
            <path d="M6 8L3.5 10.5L12 19L20.5 10.5L18 8L12 14L6 8Z" fill="#F97316" />
            <rect x="11" y="19" width="2" height="3" fill="#F97316" />
          </svg>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            color: "white",
          }}
        >
          <div
            style={{
              fontSize: "72px",
              fontWeight: "bold",
              lineHeight: "1",
              marginBottom: "12px",
            }}
          >
            Handwerker Kontakte
          </div>
          <div
            style={{
              fontSize: "32px",
              fontWeight: "500",
              opacity: 0.95,
            }}
          >
            Finden Sie den richtigen Handwerker für Ihr Projekt
          </div>
        </div>
      </div>
      <div
        style={{
          display: "flex",
          gap: "40px",
          marginTop: "40px",
          color: "white",
          fontSize: "24px",
          fontWeight: "500",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div
            style={{
              width: "32px",
              height: "32px",
              borderRadius: "50%",
              background: "rgba(255,255,255,0.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            ✓
          </div>
          Schnell
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div
            style={{
              width: "32px",
              height: "32px",
              borderRadius: "50%",
              background: "rgba(255,255,255,0.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            ✓
          </div>
          Einfach
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div
            style={{
              width: "32px",
              height: "32px",
              borderRadius: "50%",
              background: "rgba(255,255,255,0.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            ✓
          </div>
          Zuverlässig
        </div>
      </div>
    </div>,
    {
      ...size,
    },
  )
}

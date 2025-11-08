import { ImageResponse } from "next/og"

export const runtime = "edge"
export const size = {
  width: 180,
  height: 180,
}
export const contentType = "image/png"

export default function AppleIcon() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #F97316 0%, #EA580C 100%)",
        borderRadius: "36px",
      }}
    >
      <svg width="100" height="100" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M13.75 2L10.25 2C10.1119 2 10 2.11193 10 2.25V6.25C10 6.38807 10.1119 6.5 10.25 6.5H13.75C13.8881 6.5 14 6.38807 14 6.25V2.25C14 2.11193 13.8881 2 13.75 2Z"
          fill="white"
        />
        <path d="M6 8L3.5 10.5L12 19L20.5 10.5L18 8L12 14L6 8Z" fill="white" opacity="0.95" />
        <rect x="11" y="19" width="2" height="3" rx="0.5" fill="white" opacity="0.9" />
      </svg>
    </div>,
    {
      ...size,
    },
  )
}

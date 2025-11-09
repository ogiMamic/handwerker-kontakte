import { ImageResponse } from "next/og"

export const runtime = "edge"
export const size = {
  width: 32,
  height: 32,
}
export const contentType = "image/png"

export default function Icon() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #2563EB 0%, #1E40AF 100%)",
        borderRadius: "6px",
      }}
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M3.5 13L8 17.5L20 5.5L18.5 4L8 14.5L5 11.5L3.5 13Z"
          fill="white"
          stroke="white"
          strokeWidth="1"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <rect x="17" y="2" width="4" height="10" rx="1" fill="white" transform="rotate(45 17 2)" />
        <rect x="6" y="17" width="2" height="5" rx="0.5" fill="white" />
      </svg>
    </div>,
    {
      ...size,
    },
  )
}

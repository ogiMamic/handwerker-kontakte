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
        background: "linear-gradient(135deg, #2563EB 0%, #1E40AF 100%)",
        borderRadius: "36px",
      }}
    >
      <svg width="100" height="100" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M14.5 3L9.5 3C9.22386 3 9 3.22386 9 3.5L9 7.5C9 7.77614 9.22386 8 9.5 8L14.5 8C14.7761 8 15 7.77614 15 7.5L15 3.5C15 3.22386 14.7761 3 14.5 3Z"
          fill="white"
        />
        <path d="M4.5 9.5L2 12L12 22L22 12L19.5 9.5L12 17L4.5 9.5Z" fill="white" />
        <rect x="10.5" y="20" width="3" height="2" rx="0.5" fill="white" opacity="0.9" />
      </svg>
    </div>,
    {
      ...size,
    },
  )
}

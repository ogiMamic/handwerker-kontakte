// app/manifest.ts
import type { MetadataRoute } from "next"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Handwerker-Kontakte",
    short_name: "Handwerker",
    description: "Connect with skilled craftsmen for your projects",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#4f46e5",
    icons: [
      {
        src: "/icons/icon-192x192.png", // Ažurirajte putanju
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icons/icon-512x512.png", // Ažurirajte putanju
        sizes: "512x512",
        type: "image/png",
      },
    ],
  }
}
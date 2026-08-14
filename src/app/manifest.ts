import type { MetadataRoute } from "next"

function manifest(): MetadataRoute.Manifest {
  return {
    name: "GKJ Slogohimo",
    short_name: "GKJ Slogohimo",

    description:
      "Website resmi GKJ Slogohimo untuk informasi ibadah, Pawartos, agenda, berita, galeri, dan pelayanan jemaat.",

    start_url: "/",
    scope: "/",

    display: "standalone",

    background_color: "#ffffff",

    theme_color: "#39a37b",

    icons: [
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  }
}

export default manifest

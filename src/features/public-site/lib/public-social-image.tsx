import { ImageResponse } from "next/og"

import { getPublicSiteSettings } from "@/features/public-site/queries/get-public-site-settings"

const PUBLIC_SOCIAL_IMAGE_SIZE = {
  width: 1200,
  height: 630,
}

async function createPublicSocialImageResponse() {
  const settings = await getPublicSiteSettings()

  const supportingText =
    settings.tagline ??
    "Informasi ibadah, Pawartos, pengumuman, berita, agenda, dan kehidupan jemaat."

  return new ImageResponse(
    <div
      style={{
        display: "flex",
        width: "100%",
        height: "100%",
        background: "#f7f8f4",
        color: "#153326",
        padding: "72px",
        fontFamily: "sans-serif",
      }}
    >
      <div
        style={{
          display: "flex",
          width: "100%",
          flexDirection: "column",
          justifyContent: "space-between",
          border: "2px solid #dce5df",
          borderRadius: "32px",
          padding: "58px 64px",
          background: "#ffffff",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            fontSize: "24px",
            fontWeight: 600,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "#397256",
          }}
        >
          <div
            style={{
              width: "18px",
              height: "18px",
              borderRadius: "9999px",
              background: "#397256",
            }}
          />
          Website Resmi
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "26px",
          }}
        >
          <div
            style={{
              display: "flex",
              maxWidth: "980px",
              fontSize: "76px",
              fontWeight: 700,
              lineHeight: 1.05,
              letterSpacing: "-0.04em",
            }}
          >
            {settings.siteName}
          </div>

          <div
            style={{
              display: "flex",
              maxWidth: "900px",
              fontSize: "30px",
              lineHeight: 1.35,
              color: "#66776e",
            }}
          >
            {supportingText}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            fontSize: "22px",
            color: "#397256",
          }}
        >
          Ibadah · Pawartos · Pengumuman · Berita · Agenda · Galeri
        </div>
      </div>
    </div>,
    PUBLIC_SOCIAL_IMAGE_SIZE
  )
}

export { createPublicSocialImageResponse, PUBLIC_SOCIAL_IMAGE_SIZE }

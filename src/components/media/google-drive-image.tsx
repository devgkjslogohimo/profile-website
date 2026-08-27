import { ImageIcon } from "lucide-react"
import Image from "next/image"

import { getGoogleDriveMediaUrl, GoogleDriveSourceWidth } from "@/lib/google-drive"

type GoogleDriveImageProps = {
  url: string | null
  alt: string
  className?: string
  eager?: boolean
  fetchPriority?: "high" | "low" | "auto"
  sourceWidth?: GoogleDriveSourceWidth
  sizes?: string
}

function GoogleDriveImage({
  url,
  alt,
  className,
  eager = false,
  fetchPriority = "auto",
  sourceWidth,
  sizes = "(max-width: 768px) 100vw, 50vw",
}: GoogleDriveImageProps) {
  const imageUrl = url
    ? getGoogleDriveMediaUrl(url, sourceWidth ? { sourceWidth } : undefined)
    : null

  if (!imageUrl) {
    return (
      <div
        className={`flex aspect-video w-full items-center justify-center overflow-hidden rounded-xl border bg-muted/30 ${
          className ?? ""
        }`}
      >
        <div className="text-center text-muted-foreground">
          <ImageIcon className="mx-auto size-6" />

          <p className="mt-2 text-xs">Belum ada gambar</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`overflow-hidden rounded-xl border bg-muted/30 ${className ?? ""}`}>
      <Image
        src={imageUrl}
        alt={alt}
        width={1600}
        height={900}
        sizes={sizes}
        loading={eager ? "eager" : "lazy"}
        fetchPriority={fetchPriority}
        className="aspect-video h-auto w-full object-cover"
      />
    </div>
  )
}

export { GoogleDriveImage }

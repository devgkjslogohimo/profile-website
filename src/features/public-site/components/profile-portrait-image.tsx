import Image from "next/image"
import { FiUser } from "react-icons/fi"

import { getGoogleDriveMediaUrl } from "@/lib/google-drive"

type ProfilePortraitImageProps = {
  url: string | null
  alt: string
  className?: string
  eager?: boolean
  sizes?: string
}

function ProfilePortraitImage({
  url,
  alt,
  className,
  eager = false,
  sizes = "(max-width: 639px) 50vw, (max-width: 1023px) 33vw, 25vw",
}: ProfilePortraitImageProps) {
  const imageUrl = url ? getGoogleDriveMediaUrl(url) : null

  return (
    <div
      className={`relative aspect-4/5 w-full overflow-hidden rounded-xl border bg-muted/30 ${
        className ?? ""
      }`}
    >
      {imageUrl ? (
        <Image
          src={imageUrl}
          alt={alt}
          fill
          sizes={sizes}
          loading={eager ? "eager" : "lazy"}
          className="object-cover object-top"
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-muted-foreground/45">
            <FiUser aria-hidden="true" className="mx-auto size-9 sm:size-10" />

            <p className="mt-2 text-xs">Belum ada foto</p>
          </div>
        </div>
      )}
    </div>
  )
}

export { ProfilePortraitImage }

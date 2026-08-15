"use client"

import Image from "next/image"
import { lazy, Suspense, useMemo, useState } from "react"
import { FiMaximize2 } from "react-icons/fi"

import { getGoogleDriveMediaUrl } from "@/lib/google-drive"

const GalleryLightboxViewer = lazy(() =>
  import("./gallery-lightbox-viewer").then((module) => ({
    default: module.GalleryLightboxViewer,
  }))
)

type GalleryPhotoLightboxImage = {
  id: string
  imageUrl: string
  caption: string | null
  altText: string | null
}

type GalleryPhotoLightboxProps = {
  albumTitle: string
  images: GalleryPhotoLightboxImage[]
}

function GalleryPhotoLightbox({ albumTitle, images }: GalleryPhotoLightboxProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)

  const resolvedImages = useMemo(
    () =>
      images.flatMap((image, index) => {
        const thumbnailSrc = getGoogleDriveMediaUrl(image.imageUrl, {
          sourceWidth: 1200,
        })

        const fullSrc = getGoogleDriveMediaUrl(image.imageUrl, {
          sourceWidth: 2000,
        })

        if (!thumbnailSrc || !fullSrc) {
          return []
        }

        const alt = image.altText || image.caption || `Dokumentasi ${albumTitle} ${index + 1}`

        return [
          {
            id: image.id,
            thumbnailSrc,
            fullSrc,
            alt,
            caption: image.caption,
          },
        ]
      }),
    [albumTitle, images]
  )

  const lightboxSlides = useMemo(
    () =>
      resolvedImages.map((image) => ({
        src: image.fullSrc,
        alt: image.alt,
        description: image.caption || undefined,
      })),
    [resolvedImages]
  )

  if (resolvedImages.length === 0) {
    return null
  }

  return (
    <>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {resolvedImages.map((image, index) => {
          const isFirstImage = index === 0

          return (
            <button
              key={image.id}
              type="button"
              onClick={() => setActiveIndex(index)}
              aria-label={`Perbesar ${image.alt}`}
              className="group relative aspect-4/3 overflow-hidden rounded-2xl text-left focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:outline-none"
            >
              <Image
                src={image.thumbnailSrc}
                alt={image.alt}
                fill
                sizes="(max-width: 639px) calc(100vw - 2.5rem), (max-width: 1023px) calc(50vw - 2.5rem), calc(33.333vw - 2rem)"
                quality={60}
                loading={isFirstImage ? "eager" : "lazy"}
                fetchPriority={isFirstImage ? "high" : "auto"}
                className="object-cover transition-transform duration-300 ease-out group-hover:scale-[1.015] motion-reduce:transition-none"
              />

              <span className="pointer-events-none absolute top-3 right-3 flex size-9 items-center justify-center rounded-full bg-black/55 text-white opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
                <FiMaximize2 aria-hidden="true" className="size-4" />
              </span>
            </button>
          )
        })}
      </div>

      {activeIndex !== null ? (
        <Suspense fallback={null}>
          <GalleryLightboxViewer
            index={activeIndex}
            slides={lightboxSlides}
            onClose={() => setActiveIndex(null)}
            onView={setActiveIndex}
          />
        </Suspense>
      ) : null}
    </>
  )
}

export { GalleryPhotoLightbox, type GalleryPhotoLightboxImage }

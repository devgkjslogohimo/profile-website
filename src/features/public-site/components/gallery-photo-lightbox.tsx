/* eslint-disable @next/next/no-img-element */
"use client"

import "yet-another-react-lightbox/plugins/captions.css"
import "yet-another-react-lightbox/plugins/counter.css"
import "yet-another-react-lightbox/styles.css"

import { useMemo, useState } from "react"
import { FiMaximize2 } from "react-icons/fi"
import Lightbox from "yet-another-react-lightbox"
import Captions from "yet-another-react-lightbox/plugins/captions"
import Counter from "yet-another-react-lightbox/plugins/counter"
import Fullscreen from "yet-another-react-lightbox/plugins/fullscreen"
import Zoom from "yet-another-react-lightbox/plugins/zoom"

import { getGoogleDriveMediaUrl } from "@/lib/google-drive"

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

  if (resolvedImages.length === 0) {
    return null
  }

  return (
    <>
      <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
        {resolvedImages.map((image, index) => (
          <figure
            key={image.id}
            className="mb-4 break-inside-avoid overflow-hidden rounded-2xl border border-border/70 bg-background"
          >
            <button
              type="button"
              onClick={() => setActiveIndex(index)}
              aria-label={`Perbesar ${image.alt}`}
              title="Klik untuk memperbesar"
              className="group relative block w-full cursor-zoom-in overflow-hidden bg-muted/30 text-left outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
            >
              <img
                src={image.thumbnailSrc}
                alt={image.alt}
                loading={index < 3 ? "eager" : "lazy"}
                decoding="async"
                fetchPriority={index === 0 ? "high" : "auto"}
                className="block h-auto w-full transition-transform duration-700 ease-out group-hover:scale-[1.018] motion-reduce:transform-none motion-reduce:transition-none"
              />

              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/20 via-transparent to-transparent opacity-0 transition-opacity duration-500 ease-out group-hover:opacity-100 motion-reduce:transition-none"
              />

              <span className="pointer-events-none absolute right-3 bottom-3 z-10 flex size-10 items-center justify-center rounded-full border border-white/20 bg-black/55 text-white shadow-sm backdrop-blur-sm transition-opacity duration-300 motion-reduce:transition-none md:opacity-0 md:group-hover:opacity-100 md:group-focus-visible:opacity-100">
                <FiMaximize2 aria-hidden="true" className="size-4" />
              </span>
            </button>

            {image.caption ? (
              <figcaption className="px-4 py-3 text-sm leading-6 text-muted-foreground">
                {image.caption}
              </figcaption>
            ) : null}
          </figure>
        ))}
      </div>

      <Lightbox
        open={activeIndex !== null}
        close={() => setActiveIndex(null)}
        index={activeIndex ?? 0}
        slides={resolvedImages.map((image) => ({
          src: image.fullSrc,
          alt: image.alt,
          description: image.caption || undefined,
        }))}
        plugins={[Captions, Counter, Fullscreen, Zoom]}
        on={{
          view: ({ index }) => setActiveIndex(index),
        }}
        animation={{
          fade: 220,
          swipe: 420,
          navigation: 320,

          easing: {
            fade: "ease-out",
            swipe: "cubic-bezier(0.22, 1, 0.36, 1)",
            navigation: "cubic-bezier(0.22, 1, 0.36, 1)",
          },
        }}
        carousel={{
          imageFit: "contain",
          padding: 16,
          spacing: "12%",
          preload: 2,
        }}
        controller={{
          closeOnBackdropClick: true,
          closeOnPullDown: true,
        }}
        captions={{
          descriptionTextAlign: "start",
          descriptionMaxLines: 4,
        }}
        counter={{
          separator: " / ",
        }}
        zoom={{
          maxZoomPixelRatio: 2.5,
          scrollToZoom: true,
        }}
      />
    </>
  )
}

export { GalleryPhotoLightbox, type GalleryPhotoLightboxImage }

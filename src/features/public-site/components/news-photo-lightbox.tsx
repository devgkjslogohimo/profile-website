"use client"

import "yet-another-react-lightbox/plugins/captions.css"
import "yet-another-react-lightbox/plugins/counter.css"
import "yet-another-react-lightbox/styles.css"

import Image from "next/image"
import { useMemo, useState } from "react"
import { FiMaximize2 } from "react-icons/fi"
import Lightbox from "yet-another-react-lightbox"
import Captions from "yet-another-react-lightbox/plugins/captions"
import Counter from "yet-another-react-lightbox/plugins/counter"
import Fullscreen from "yet-another-react-lightbox/plugins/fullscreen"
import Zoom from "yet-another-react-lightbox/plugins/zoom"

import { getGoogleDriveMediaUrl } from "@/lib/google-drive"

type NewsPhotoLightboxImage = {
  id: string
  googleDriveUrl: string
  altText: string | null
  caption: string | null
}

type NewsPhotoLightboxProps = {
  newsTitle: string
  images: NewsPhotoLightboxImage[]
}

function NewsPhotoLightbox({ newsTitle, images }: NewsPhotoLightboxProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)

  const resolvedImages = useMemo(
    () =>
      images.flatMap((image, index) => {
        const src = getGoogleDriveMediaUrl(image.googleDriveUrl)

        if (!src) {
          return []
        }

        const alt = image.altText || image.caption || `Dokumentasi ${newsTitle} ${index + 1}`

        return [
          {
            id: image.id,
            src,
            alt,
            caption: image.caption,
          },
        ]
      }),
    [images, newsTitle]
  )

  if (resolvedImages.length === 0) {
    return null
  }

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {resolvedImages.map((image, index) => (
          <figure
            key={image.id}
            className="overflow-hidden rounded-xl border border-border/70 bg-background"
          >
            <button
              type="button"
              onClick={() => setActiveIndex(index)}
              aria-label={`Perbesar ${image.alt}`}
              title="Klik untuk memperbesar"
              className="group relative block aspect-4/3 w-full cursor-zoom-in overflow-hidden bg-muted/30 text-left outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 24vw"
                loading="lazy"
                className="object-cover transition-transform duration-300 group-hover:scale-[1.02] motion-reduce:transform-none motion-reduce:transition-none"
              />

              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/15 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100"
              />

              <span className="pointer-events-none absolute right-3 bottom-3 z-10 flex size-10 items-center justify-center rounded-full border border-white/20 bg-black/55 text-white shadow-sm backdrop-blur-sm transition md:opacity-0 md:group-hover:opacity-100 md:group-focus-visible:opacity-100">
                <FiMaximize2 aria-hidden="true" className="size-4" />
              </span>
            </button>

            {image.caption ? (
              <figcaption className="px-3 py-3 text-xs leading-5 text-muted-foreground">
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
          src: image.src,
          alt: image.alt,
          description: image.caption || undefined,
        }))}
        plugins={[Captions, Counter, Fullscreen, Zoom]}
        on={{
          view: ({ index }) => setActiveIndex(index),
        }}
        carousel={{
          imageFit: "contain",
          padding: 12,
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
          maxZoomPixelRatio: 2,
          scrollToZoom: true,
        }}
      />
    </>
  )
}

export { NewsPhotoLightbox }

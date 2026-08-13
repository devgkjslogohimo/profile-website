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

type LocationPhotoLightboxProps = {
  locationName: string

  images: {
    id: string
    imageUrl: string
    caption: string | null
    altText: string
  }[]
}

function LocationPhotoLightbox({ locationName, images }: LocationPhotoLightboxProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)

  const resolvedImages = useMemo(
    () =>
      images.flatMap((image, index) => {
        const src = getGoogleDriveMediaUrl(image.imageUrl)

        if (!src) {
          return []
        }

        const alt = image.altText || image.caption || `Foto ${locationName}`

        return [
          {
            id: image.id,
            src,
            alt,
            caption: image.caption,
            index,
          },
        ]
      }),
    [images, locationName]
  )

  if (resolvedImages.length === 0) {
    return null
  }

  return (
    <>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {resolvedImages.map((image, index) => (
          <figure key={image.id} className="overflow-hidden rounded-2xl border bg-background">
            <button
              type="button"
              onClick={() => setActiveIndex(index)}
              className="group relative block aspect-4/3 w-full cursor-zoom-in overflow-hidden bg-muted/30 text-left outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
              aria-label={`Perbesar ${image.alt}`}
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                loading="lazy"
                className="object-cover transition-transform duration-300 group-hover:scale-[1.02] motion-reduce:transform-none motion-reduce:transition-none"
              />

              <span className="pointer-events-none absolute right-3 bottom-3 z-10 flex size-9 items-center justify-center rounded-full border border-white/20 bg-black/55 text-white shadow-sm backdrop-blur-sm transition-opacity md:opacity-0 md:group-hover:opacity-100 md:group-focus-visible:opacity-100">
                <FiMaximize2 aria-hidden="true" className="size-4" />
              </span>
            </button>

            {image.caption ? (
              <figcaption className="p-4 text-sm leading-6 text-muted-foreground">
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

export { LocationPhotoLightbox }

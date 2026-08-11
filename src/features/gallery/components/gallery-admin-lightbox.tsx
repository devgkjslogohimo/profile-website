"use client"

import "yet-another-react-lightbox/plugins/captions.css"
import "yet-another-react-lightbox/plugins/counter.css"
import "yet-another-react-lightbox/styles.css"

import { Maximize2 } from "lucide-react"
import { createContext, type ReactNode, useContext, useMemo, useState } from "react"
import Lightbox from "yet-another-react-lightbox"
import Captions from "yet-another-react-lightbox/plugins/captions"
import Counter from "yet-another-react-lightbox/plugins/counter"
import Fullscreen from "yet-another-react-lightbox/plugins/fullscreen"
import Zoom from "yet-another-react-lightbox/plugins/zoom"

import { getGoogleDriveMediaUrl } from "@/lib/google-drive"

type GalleryAdminLightboxImage = {
  id: string
  imageUrl: string
  caption: string | null
  altText: string | null
}

type GalleryAdminLightboxProviderProps = {
  images: GalleryAdminLightboxImage[]
  children: ReactNode
}

type GalleryAdminLightboxTriggerProps = {
  imageId: string
  label: string
  children: ReactNode
}

type OpenGalleryImage = (imageId: string) => void

const GalleryAdminLightboxContext = createContext<OpenGalleryImage | null>(null)

function GalleryAdminLightboxProvider({ images, children }: GalleryAdminLightboxProviderProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)

  const resolvedImages = useMemo(
    () =>
      images.flatMap((image, index) => {
        const src = getGoogleDriveMediaUrl(image.imageUrl)

        if (!src) {
          return []
        }

        return [
          {
            id: image.id,
            slide: {
              src,
              alt: image.altText || image.caption || `Foto galeri ${index + 1}`,
              description: image.caption || undefined,
            },
          },
        ]
      }),
    [images]
  )

  function openImage(imageId: string) {
    const index = resolvedImages.findIndex((image) => image.id === imageId)

    if (index === -1) {
      return
    }

    setActiveIndex(index)
  }

  return (
    <GalleryAdminLightboxContext.Provider value={openImage}>
      {children}

      <Lightbox
        open={activeIndex !== null}
        close={() => setActiveIndex(null)}
        index={activeIndex ?? 0}
        slides={resolvedImages.map((image) => image.slide)}
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
    </GalleryAdminLightboxContext.Provider>
  )
}

function GalleryAdminLightboxTrigger({
  imageId,
  label,
  children,
}: GalleryAdminLightboxTriggerProps) {
  const openImage = useContext(GalleryAdminLightboxContext)

  if (!openImage) {
    throw new Error(
      "GalleryAdminLightboxTrigger harus berada di dalam GalleryAdminLightboxProvider."
    )
  }

  return (
    <button
      type="button"
      onClick={() => openImage(imageId)}
      className="group relative block w-full cursor-zoom-in overflow-hidden rounded-xl text-left outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
      aria-label={`Buka ${label} dalam lightbox`}
      title="Klik untuk memperbesar"
    >
      {children}

      <span className="pointer-events-none absolute right-3 bottom-3 flex size-9 items-center justify-center rounded-full border bg-background/90 shadow-sm backdrop-blur-sm transition md:opacity-0 md:group-hover:opacity-100 md:group-focus-visible:opacity-100">
        <Maximize2 className="size-4" />
      </span>
    </button>
  )
}

export { GalleryAdminLightboxProvider, GalleryAdminLightboxTrigger }

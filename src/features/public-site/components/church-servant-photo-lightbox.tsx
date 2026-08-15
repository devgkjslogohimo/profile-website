"use client"

import "yet-another-react-lightbox/plugins/captions.css"
import "yet-another-react-lightbox/plugins/counter.css"
import "yet-another-react-lightbox/styles.css"

import { createContext, type ReactNode, useContext, useMemo, useState } from "react"
import { FiMaximize2 } from "react-icons/fi"
import Lightbox from "yet-another-react-lightbox"
import Captions from "yet-another-react-lightbox/plugins/captions"
import Counter from "yet-another-react-lightbox/plugins/counter"
import Fullscreen from "yet-another-react-lightbox/plugins/fullscreen"
import Zoom from "yet-another-react-lightbox/plugins/zoom"

import { getGoogleDriveMediaUrl } from "@/lib/google-drive"

type ChurchServantPhotoLightboxImage = {
  id: string
  photoUrl: string
  fullName: string
  position: string
  locationName: string
  period: string
}

type ChurchServantPhotoLightboxProps = {
  images: ChurchServantPhotoLightboxImage[]
  children: ReactNode
}

type ChurchServantPhotoLightboxTriggerProps = {
  imageId: string
  label: string
  children: ReactNode
}

type ChurchServantPhotoContextValue = {
  openImage: (imageId: string) => void
}

const ChurchServantPhotoContext = createContext<ChurchServantPhotoContextValue | null>(null)

function ChurchServantPhotoLightbox({ images, children }: ChurchServantPhotoLightboxProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)

  const resolvedImages = useMemo(
    () =>
      images.flatMap((image) => {
        const src = getGoogleDriveMediaUrl(image.photoUrl, {
          sourceWidth: 2000,
        })

        if (!src) {
          return []
        }

        return [
          {
            ...image,
            src,
          },
        ]
      }),
    [images]
  )

  function openImage(imageId: string) {
    const index = resolvedImages.findIndex((image) => image.id === imageId)

    if (index >= 0) {
      setActiveIndex(index)
    }
  }

  return (
    <ChurchServantPhotoContext.Provider value={{ openImage }}>
      {children}

      <Lightbox
        open={activeIndex !== null}
        close={() => setActiveIndex(null)}
        index={activeIndex ?? 0}
        slides={resolvedImages.map((image) => ({
          src: image.src,
          alt: `Foto ${image.fullName}`,
          description: `${image.fullName}\n${image.position} · ${image.locationName} · Periode ${image.period}`,
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
          preload: 1,
        }}
        controller={{
          closeOnBackdropClick: true,
          closeOnPullDown: true,
        }}
        captions={{
          descriptionTextAlign: "center",
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
    </ChurchServantPhotoContext.Provider>
  )
}

function ChurchServantPhotoLightboxTrigger({
  imageId,
  label,
  children,
}: ChurchServantPhotoLightboxTriggerProps) {
  const context = useContext(ChurchServantPhotoContext)

  if (!context) {
    throw new Error(
      "ChurchServantPhotoLightboxTrigger harus berada di dalam ChurchServantPhotoLightbox."
    )
  }

  return (
    <button
      type="button"
      onClick={() => context.openImage(imageId)}
      aria-label={label}
      title="Klik untuk memperbesar"
      className="group relative block w-full cursor-zoom-in rounded-xl text-left outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
    >
      {children}

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-xl bg-linear-to-t from-black/15 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100"
      />

      <span className="pointer-events-none absolute right-3 bottom-3 z-10 flex size-9 items-center justify-center rounded-full border border-white/20 bg-black/55 text-white shadow-sm backdrop-blur-sm transition md:opacity-0 md:group-hover:opacity-100 md:group-focus-visible:opacity-100">
        <FiMaximize2 aria-hidden="true" className="size-4" />
      </span>
    </button>
  )
}

export {
  ChurchServantPhotoLightbox,
  type ChurchServantPhotoLightboxImage,
  ChurchServantPhotoLightboxTrigger,
}

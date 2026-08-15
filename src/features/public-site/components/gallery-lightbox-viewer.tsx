"use client"

import "yet-another-react-lightbox/plugins/captions.css"
import "yet-another-react-lightbox/plugins/counter.css"
import "yet-another-react-lightbox/styles.css"

import Lightbox from "yet-another-react-lightbox"
import Captions from "yet-another-react-lightbox/plugins/captions"
import Counter from "yet-another-react-lightbox/plugins/counter"
import Fullscreen from "yet-another-react-lightbox/plugins/fullscreen"
import Zoom from "yet-another-react-lightbox/plugins/zoom"

type GalleryLightboxViewerSlide = {
  src: string
  alt: string
  description?: string
}

type GalleryLightboxViewerProps = {
  index: number
  slides: GalleryLightboxViewerSlide[]
  onClose: () => void
  onView: (index: number) => void
}

function GalleryLightboxViewer({ index, slides, onClose, onView }: GalleryLightboxViewerProps) {
  return (
    <Lightbox
      open
      close={onClose}
      index={index}
      slides={slides}
      plugins={[Captions, Counter, Fullscreen, Zoom]}
      on={{
        view: ({ index: nextIndex }) => onView(nextIndex),
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
  )
}

export { GalleryLightboxViewer, type GalleryLightboxViewerSlide }

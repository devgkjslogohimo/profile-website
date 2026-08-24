"use client"

import Image from "next/image"
import { useEffect, useState } from "react"
import { FiChevronLeft, FiChevronRight, FiPause, FiPlay } from "react-icons/fi"

import { getGoogleDriveMediaUrl } from "@/lib/google-drive"

type HeroImageSlide = {
  id: string
  imageUrl: string
  altText: string
}

type HeroImageSliderProps = {
  slides: HeroImageSlide[]
}

const SLIDE_DURATION = 6000
const PRELOAD_LEAD_TIME = 1500

function HeroImageSlider({ slides }: HeroImageSliderProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [preparedIndex, setPreparedIndex] = useState<number | null>(null)

  const [paused, setPaused] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)

  const hasMultiple = slides.length > 1

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)")

    function updateReducedMotion() {
      setReducedMotion(mediaQuery.matches)
    }

    updateReducedMotion()

    mediaQuery.addEventListener("change", updateReducedMotion)

    return () => {
      mediaQuery.removeEventListener("change", updateReducedMotion)
    }
  }, [])

  useEffect(() => {
    if (!hasMultiple || paused || reducedMotion) {
      return
    }

    const nextIndex = (activeIndex + 1) % slides.length

    const prepareTimeout = window.setTimeout(() => {
      setPreparedIndex(nextIndex)
    }, SLIDE_DURATION - PRELOAD_LEAD_TIME)

    const slideTimeout = window.setTimeout(() => {
      setActiveIndex(nextIndex)
      setPreparedIndex(null)
    }, SLIDE_DURATION)

    return () => {
      window.clearTimeout(prepareTimeout)
      window.clearTimeout(slideTimeout)
    }
  }, [activeIndex, hasMultiple, paused, reducedMotion, slides.length])

  if (slides.length === 0) {
    return null
  }

  function activateSlide(index: number) {
    setPreparedIndex(null)
    setActiveIndex(index)
  }

  function showPrevious() {
    activateSlide((activeIndex - 1 + slides.length) % slides.length)
  }

  function showNext() {
    activateSlide((activeIndex + 1) % slides.length)
  }

  return (
    <div className="absolute inset-0">
      <div className="absolute inset-0">
        {slides.map((slide, index) => {
          const isActive = index === activeIndex

          const isPrepared = index === preparedIndex

          if (!isActive && !isPrepared) {
            return null
          }

          const imageUrl = getGoogleDriveMediaUrl(slide.imageUrl)

          if (!imageUrl) {
            return null
          }

          return (
            <div
              key={slide.id}
              aria-hidden={!isActive}
              className={`absolute inset-0 transition-opacity duration-1000 ease-out motion-reduce:transition-none ${
                isActive ? "opacity-100" : "pointer-events-none opacity-0"
              }`}
            >
              <Image
                src={imageUrl}
                alt={isActive ? slide.altText : ""}
                fill
                sizes="100vw"
                quality={75}
                loading={index === 0 ? "eager" : "lazy"}
                fetchPriority={index === 0 ? "high" : "auto"}
                decoding={index === 0 ? "sync" : "async"}
                className="object-cover"
              />
            </div>
          )
        })}
      </div>

      <div
        aria-hidden="true"
        className="absolute inset-0 bg-linear-to-r from-black/75 via-black/55 to-black/35"
      />

      <div
        aria-hidden="true"
        className="absolute inset-0 bg-linear-to-t from-black/30 via-transparent to-black/10"
      />

      {hasMultiple ? (
        <div className="absolute right-0 bottom-5 left-0 z-20 md:bottom-7">
          <div className="mx-auto flex w-fit items-center gap-2 rounded-full border border-white/20 bg-black/25 px-2 py-1.5 shadow-lg backdrop-blur-sm">
            <button
              type="button"
              onClick={showPrevious}
              aria-label="Foto hero sebelumnya"
              className="flex size-9 items-center justify-center rounded-full text-white transition-colors hover:bg-white/15 focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none"
            >
              <FiChevronLeft aria-hidden="true" className="size-5" />
            </button>

            <div className="flex items-center gap-1.5" aria-label="Pilih foto hero">
              {slides.map((slide, index) => {
                const isActive = index === activeIndex

                return (
                  <button
                    key={slide.id}
                    type="button"
                    onClick={() => activateSlide(index)}
                    aria-label={`Tampilkan foto hero ${index + 1}`}
                    aria-current={isActive ? "true" : undefined}
                    className="flex size-8 items-center justify-center rounded-full focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none"
                  >
                    <span
                      aria-hidden="true"
                      className={`block rounded-full transition-all duration-300 motion-reduce:transition-none ${
                        isActive ? "h-2 w-6 bg-white" : "size-2 bg-white/50 hover:bg-white/80"
                      }`}
                    />
                  </button>
                )
              })}
            </div>

            <button
              type="button"
              onClick={showNext}
              aria-label="Foto hero berikutnya"
              className="flex size-9 items-center justify-center rounded-full text-white transition-colors hover:bg-white/15 focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none"
            >
              <FiChevronRight aria-hidden="true" className="size-5" />
            </button>

            {!reducedMotion ? (
              <button
                type="button"
                onClick={() => {
                  setPreparedIndex(null)

                  setPaused((current) => !current)
                }}
                aria-label={
                  paused ? "Lanjutkan pergantian foto otomatis" : "Jeda pergantian foto otomatis"
                }
                className="flex size-9 items-center justify-center rounded-full text-white transition-colors hover:bg-white/15 focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none"
              >
                {paused ? (
                  <FiPlay aria-hidden="true" className="size-4" />
                ) : (
                  <FiPause aria-hidden="true" className="size-4" />
                )}
              </button>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  )
}

export { HeroImageSlider }

export type { HeroImageSlide }
